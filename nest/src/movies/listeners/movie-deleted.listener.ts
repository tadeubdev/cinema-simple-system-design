import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MovieDeletedEvent } from '../events/movie-deleted.event';

@Injectable()
export class MovieDeletedListener {
  @OnEvent('movie.deleted')
  handle(event: MovieDeletedEvent) {
    const requestId = event.requestId || 'N/A';
    console.log(`[${requestId}] Movie deleted: ${event.movieId}`);
  }
}
