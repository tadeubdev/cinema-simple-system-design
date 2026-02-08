import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoomUpdatedEvent } from '../events/room-updated.event';

@Injectable()
export class RoomUpdatedListener {
  @OnEvent('room.updated')
  handle(event: RoomUpdatedEvent) {
    const requestId = event.requestId || 'N/A';
    const capacityInfo = event.capacity
      ? ` with capacity ${event.capacity}`
      : '';
    console.log(`[${requestId}] Room updated: ${event.roomId}${capacityInfo}`);
  }
}
