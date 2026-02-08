import { Module } from '@nestjs/common';
import SessionsController from './sessions.controller';
import SessionsService from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Session } from './session.entity';
import { SessionSeat } from './session-seat.entity';
import { SessionCreatedListener } from './listeners/session-created.listener';
import { SessionDeletedListener } from './listeners/session-deleted.listener';
import { SessionUpdatedListener } from './listeners/session-updated.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionSeat])],
  controllers: [SessionsController],
  exports: [],
  providers: [
    SessionsService,
    SessionCreatedListener,
    SessionUpdatedListener,
    SessionDeletedListener,
  ],
})
export class SessionsModule {}
