import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionUpdatedEvent } from '../events/session-updated.events';

@Injectable()
export class SessionUpdatedListener {
  @OnEvent('session.updated')
  handle(event: SessionUpdatedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(
      `[${requestId}] Session updated: ${event.sessionId} for movie ${event.movieId} in room ${event.roomId} at ${event.dateStart} - ${event.dateEnd}`,
    );
  }
}
