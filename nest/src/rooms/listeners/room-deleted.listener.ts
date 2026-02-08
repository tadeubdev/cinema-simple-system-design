import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomDeletedEvent } from '../events/room-deleted.event';

@Injectable()
export class RoomDeletedListener {
  @OnEvent('room.deleted')
  handle(event: RoomDeletedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(`[${requestId}] Room deleted: ${event.roomId}`);
  }
}
