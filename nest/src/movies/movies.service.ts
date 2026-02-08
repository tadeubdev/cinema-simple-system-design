/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CacheService } from 'src/infra/cache/cache.service';
import {
  AllMoviesQueryDto,
  buildMoviesListCacheKey,
} from './dto/all-movies-query.dto';
import { MovieUpdatedEvent } from './events/movie-updated.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<Movie>,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(query: AllMoviesQueryDto): Promise<Movie[]> {
    query.page = Number(query.page) || 1;
    query.limit = Number(query.limit) || 10;
    query.limit = Math.min(query.limit, 100);
    const skip = (query.page - 1) * query.limit;
    const dateFilter: Record<string, Date> = {};

    if (query.date_start && !isNaN(Date.parse(query.date_start))) {
      dateFilter.$gte = new Date(query.date_start);
    }
    if (query.date_end && !isNaN(Date.parse(query.date_end))) {
      dateFilter.$lte = new Date(query.date_end);
    }

    const cacheKey = buildMoviesListCacheKey(query);
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Movie[];
    }

    let stmt = this.movieModel.find();

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      stmt = stmt.or([{ title: searchRegex }, { description: searchRegex }]);
    }

    if (Object.keys(dateFilter).length > 0) {
      stmt = stmt
        .where('releaseDate')
        .gte(dateFilter.$gte?.getTime())
        .lte(dateFilter.$lte?.getTime());
    }

    const result = await stmt
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .exec();
    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<Movie | null> {
    const cacheKey = `movies:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Movie;
    }
    const movie = await this.movieModel.findById(id).exec();
    if (movie) {
      await this.cache.set(cacheKey, movie);
    }
    return movie;
  }

  async create(movieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(movieDto);
    const movie = await createdMovie.save();
    await this.cache.delByPrefix('movies:list:');
    this.eventEmitter.emit(
      'movie.updated',
      new MovieUpdatedEvent(movie._id.toString()),
    );
    return movie;
  }

  async update(id: string, movie: UpdateMovieDto): Promise<Movie | null> {
    const movieExists = await this.movieModel.exists({ _id: id }).exec();
    if (!movieExists) {
      return null;
    }
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, movie, { new: true })
      .exec();
    await this.cache.delByPrefix('movies:list:');
    this.eventEmitter.emit('movie.updated', new MovieUpdatedEvent(id));
    return updatedMovie;
  }
}
