import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieCreatedListener } from './listeners/movie-created.listener';
import { MovieUpdatedListener } from './listeners/movie-updated.listener';
import { Movie } from './movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieDeletedListener } from './listeners/movie-deleted.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MovieCreatedListener,
    MovieUpdatedListener,
    MovieDeletedListener,
  ],
})
export class MoviesModule {}
