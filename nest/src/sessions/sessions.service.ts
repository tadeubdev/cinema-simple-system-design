/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectRepository } from '@nestjs/typeorm';
import {
  AllSessionsQueryDto,
  buildSessionsListCacheKey,
} from './dtos/all-sessions.query';
import { Repository } from 'typeorm/repository/Repository';
import { CacheService } from 'src/infra/cache/cache.service';
import { EventEmitter2 } from 'eventemitter2';
import { ClsService } from 'nestjs-cls/dist/src/lib/cls.service';
import { Session } from './session.entity';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CreateSessionQueryDto } from './dtos/create-session.query';
import { DataSource } from 'typeorm/data-source/DataSource';
import { SessionSeat } from './session-seat.entity';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { SessionCreatedEvent } from './events/session-created.event';
import { UpdateSessionQueryDto } from './dtos/update-session.query';

@Injectable()
export default class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
    private readonly cache: CacheService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {}

  async getAllSessions(query: AllSessionsQueryDto): Promise<Session[]> {
    const cacheKey = buildSessionsListCacheKey(query);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Session[];
    }

    let stmt = this.repository.createQueryBuilder('session');
    if (query.movie_id) {
      stmt = stmt.andWhere('session.movie_id = :movie_id', {
        movie_id: query.movie_id,
      });
    }
    if (query.room_id) {
      stmt = stmt.andWhere('session.room_id = :room_id', {
        room_id: query.room_id,
      });
    }
    if (query.date_start) {
      stmt = stmt.andWhere('session.date >= :date_start', {
        date_start: query.date_start,
      });
    }
    if (query.date_end) {
      stmt = stmt.andWhere('session.date <= :date_end', {
        date_end: query.date_end,
      });
    }

    const sessions = await stmt.getMany();
    await this.cache.set(cacheKey, sessions, 60); // cache for 60 seconds
    return sessions;
  }

  async createSession(body: CreateSessionQueryDto) {
    // check if exists session in the same room that overlaps with the new session
    const overlappingSession = await this.repository
      .createQueryBuilder('session')
      .where('session.roomId = :roomId', { roomId: body.room_id })
      .andWhere(
        '(session.dateStart < :dateEnd AND session.dateEnd > :dateStart)',
        { dateStart: body.date_start, dateEnd: body.date_end },
      )
      .getOne();
    if (overlappingSession) {
      throw new ConflictException(
        'There is an overlapping session in the same room',
      );
    }
    return await this.dataSource.transaction(async (manager) => {
      const seatIds = await manager
        .createQueryBuilder()
        .select('s.id')
        .from('seats', 's')
        .where('s.roomId = :roomId', { roomId: body.room_id })
        .getRawMany<{ s_id: string }>()
        .then((rows) => rows.map((r) => r.s_id));
      if (seatIds.length === 0) {
        throw new ConflictException('Room has no seats');
      }

      const session = manager.create(Session, {
        movie: { id: body.movie_id } as any,
        room: { id: body.room_id } as any,
        dateStart: body.date_start,
        dateEnd: body.date_end,
      });
      await manager.save(session);

      const sessionSeats = seatIds.map((seatId) => {
        const ss = new SessionSeat();
        ss.session = session;
        ss.seatId = seatId;
        return ss;
      });
      await manager.save(SessionSeat, sessionSeats);

      this.eventEmitter.emit(
        'session.created',
        new SessionCreatedEvent(
          session.id,
          body.movie_id,
          body.room_id,
          body.date_start,
          body.date_end,
          this.cls.get('requestId'),
        ),
      );

      return session;
    });
  }

  async updateSession(sessionId: string, body: UpdateSessionQueryDto) {
    return await this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(Session, {
        where: { id: sessionId },
        relations: ['room', 'movie'],
      });
      if (!session) {
        throw new ConflictException('Session not found');
      }
      if (body.movie_id) {
        session.movie = { id: body.movie_id } as any;
      }
      if (body.room_id) {
        session.room = { id: body.room_id } as any;
      }

      // if date_start or date_end is updated, check for overlapping sessions
      if (body.date_start || body.date_end) {
        const dateStart = body.date_start
          ? new Date(body.date_start)
          : session.dateStart;
        const dateEnd = body.date_end
          ? new Date(body.date_end)
          : session.dateEnd;

        const overlappingSession = await manager
          .createQueryBuilder(Session, 'session')
          .where('session.roomId = :roomId', {
            roomId: body.room_id || session.room.id,
          })
          .andWhere('session.id != :sessionId', { sessionId })
          .andWhere(
            '(session.dateStart < :dateEnd AND session.dateEnd > :dateStart)',
            { dateStart, dateEnd },
          )
          .getOne();
        if (overlappingSession) {
          throw new ConflictException(
            'There is an overlapping session in the same room',
          );
        }
      }

      if (body.date_start) {
        session.dateStart = new Date(body.date_start);
      }
      if (body.date_end) {
        session.dateEnd = new Date(body.date_end);
      }
      await manager.save(session);

      return session;
    });
  }
}
