import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MovieCreatedEvent } from '../events/movie-created.event';

@Injectable()
export class MovieCreatedListener {
  @OnEvent('movie.created')
  handle(event: MovieCreatedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(`[${requestId}] Movie created: ${event.movieId}`);
  }
}
