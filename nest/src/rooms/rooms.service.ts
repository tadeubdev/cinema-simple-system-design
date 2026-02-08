import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Room } from './room.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CacheService } from 'src/infra/cache/cache.service';
import { EventEmitter2 } from 'eventemitter2';
import { ClsService } from 'nestjs-cls/dist/src/lib/cls.service';
import {
  AllRoomsQueryDto,
  buildRoomsListCacheKey,
} from './dto/all-rooms-query.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomCreatedEvent } from './events/room-created.event';
import { Seat } from './seat.entity';
import { RoomDeletedEvent } from './events/room-deleted.event';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomUpdatedEvent } from './events/room-updated.event';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly repository: Repository<Room>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {}

  async findAll(query: AllRoomsQueryDto): Promise<Room[]> {
    query.page = Number(query.page) || 1;
    query.limit = Number(query.limit) || 10;
    query.limit = Math.min(query.limit, 100);
    const skip = (query.page - 1) * query.limit;

    const cacheKey = buildRoomsListCacheKey(query);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Room[];
    }

    let stmt = this.repository.createQueryBuilder('room');

    if (query.search) {
      stmt = stmt.where('room.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const result = await stmt.skip(skip).take(query.limit).getMany();
    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<Room | null> {
    const cacheKey = `rooms:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Room;
    }
    const room = await this.repository.findOne({
      where: { id },
      relations: ['seats'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (room) {
      await this.cache.set(cacheKey, room);
    }
    return room;
  }

  async create(roomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.repository.exists({
      where: { name: roomDto.name },
    });
    if (existing) {
      throw new ConflictException('Room with this name already exists');
    }
    const roomCreated = this.repository.create(roomDto);
    const capacity = Number(roomDto.capacity) || 0;
    roomCreated.seats = Array.from({ length: capacity }).map((_, i) => {
      const seat = new Seat();
      seat.number = '0'.concat((i + 1).toString().padStart(2, '0'));
      return seat;
    });
    const room = await this.repository.save(roomCreated);
    await this.cache.delByPrefix('rooms:list:');
    this.eventEmitter.emit(
      'room.created',
      new RoomCreatedEvent(
        room.id.toString(),
        capacity,
        this.cls.get('requestId'),
      ),
    );
    return room;
  }

  async update(id: string, roomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.repository.findOne({
      where: { id },
      relations: ['seats'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (roomDto.name && roomDto.name !== room.name) {
      const existing = await this.repository.exists({
        where: { name: roomDto.name },
      });
      if (existing) {
        throw new ConflictException('Room with this name already exists');
      }
    }
    Object.assign(room, roomDto);

    if (roomDto.capacity !== undefined) {
      const capacity = Number(roomDto.capacity);
      const currentSeatsCount = room.seats.length;

      if (capacity < currentSeatsCount) {
        // Remove seats excedentes
        const seatsToRemove = room.seats.slice(capacity);
        await this.seatRepository.remove(seatsToRemove);
        room.seats = room.seats.slice(0, capacity);
      } else if (capacity > currentSeatsCount) {
        // Adiciona novas seats
        const additionalSeats = Array.from({
          length: capacity - currentSeatsCount,
        }).map((_, i) => {
          const seat = new Seat();
          seat.number = '0'.concat(
            (currentSeatsCount + i + 1).toString().padStart(2, '0'),
          );
          return seat;
        });
        room.seats.push(...additionalSeats);
      }
    }

    await this.repository.save(room);
    await this.cache.delByPrefix('rooms:list:');
    await this.cache.del(`rooms:${id}`);
    this.eventEmitter.emit(
      'room.updated',
      new RoomUpdatedEvent(
        room.id.toString(),
        room.seats.length,
        this.cls.get('requestId'),
      ),
    );
    return room;
  }

  async delete(id: string): Promise<void> {
    const room = await this.repository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    await this.repository.delete(id);
    await this.cache.delByPrefix('rooms:list:');
    await this.cache.del(`rooms:${id}`);
    this.eventEmitter.emit(
      'room.deleted',
      new RoomDeletedEvent(id, this.cls.get('requestId')),
    );
  }
}
