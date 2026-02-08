import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MovieUpdatedEvent } from '../events/movie-updated.event';

@Injectable()
export class MovieUpdatedListener {
  @OnEvent('movie.updated')
  handle(event: MovieUpdatedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(`[${requestId}] Movie updated: ${event.movieId}`);
  }
}
