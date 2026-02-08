import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionCreatedEvent } from '../events/session-created.event';

@Injectable()
export class SessionCreatedListener {
  @OnEvent('session.created')
  handle(event: SessionCreatedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(
      `[${requestId}] Session created: ${event.sessionId} for movie ${event.movieId} in room ${event.roomId} at ${event.dateStart} - ${event.dateEnd}`,
    );
  }
}
