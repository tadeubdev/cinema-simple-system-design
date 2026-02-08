import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionDeletedEvent } from '../events/session-deleted.events';

@Injectable()
export class SessionDeletedListener {
  @OnEvent('session.deleted')
  handle(event: SessionDeletedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(
      `[${requestId}] Session deleted: ${event.sessionId} for movie ${event.movieId} in room ${event.roomId} at ${event.dateStart} - ${event.dateEnd}`,
    );
  }
}
