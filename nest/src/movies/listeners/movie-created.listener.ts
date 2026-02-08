import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MovieCreatedEvent } from '../events/movie-created.event';

@Injectable()
export class MovieCreatedListener {
  @OnEvent('movie.created')
  handle(event: MovieCreatedEvent) {
    console.log('Movie created:', event.movieId);
  }
}
