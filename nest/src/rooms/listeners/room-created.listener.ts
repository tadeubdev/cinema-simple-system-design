import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomCreatedEvent } from '../events/room-created.event';

@Injectable()
export class RoomCreatedListener {
  @OnEvent('room.created')
  handle(event: RoomCreatedEvent) {
    const requestId = event.requestId || 'N/A';
    const capacityInfo = event.capacity
      ? ` with capacity ${event.capacity}`
      : '';
    console.log(`[${requestId}] Room created: ${event.roomId}${capacityInfo}`);
  }
}
