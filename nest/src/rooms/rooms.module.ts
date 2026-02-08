import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Seat } from './seat.entity';
import { RoomUpdatedListener } from './listeners/room-updated.listener';
import { RoomCreatedListener } from './listeners/room-created.listener';
import { RoomDeletedListener } from './listeners/room-deleted.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Seat])],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomCreatedListener,
    RoomUpdatedListener,
    RoomDeletedListener,
  ],
})
export class RoomsModule {}
