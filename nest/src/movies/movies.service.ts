import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CacheService } from 'src/infra/cache/cache.service';
import {
  AllMoviesQueryDto,
  buildMoviesListCacheKey,
} from './dto/all-movies-query.dto';
import { MovieUpdatedEvent } from './events/movie-updated.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm/repository/Repository';
import { Movie } from './movie.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { MovieDeletedEvent } from './events/movie-deleted.event';
import { MovieCreatedEvent } from './events/movie-created.event';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private readonly cache: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
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

    let stmt = this.repository.createQueryBuilder('movie');

    if (query.search) {
      stmt = stmt.where('movie.title ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (Object.keys(dateFilter).length > 0) {
      stmt = stmt.andWhere('movie.releaseDate BETWEEN :start AND :end', {
        start: dateFilter.$gte || new Date(0),
        end: dateFilter.$lte || new Date(),
      });
    }

    const result = await stmt
      .orderBy('movie.createdAt', 'DESC')
      .skip(skip)
      .take(query.limit)
      .getMany();
    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<Movie | null> {
    const cacheKey = `movies:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as Movie;
    }
    const movie = await this.repository.findOneBy({ id });
    if (movie) {
      await this.cache.set(cacheKey, movie);
    }
    return movie;
  }

  async create(movieDto: CreateMovieDto): Promise<Movie> {
    // check if movie with same title and dateStart and dateEnd already exists
    const existingMovie = await this.repository.findOne({
      where: {
        title: movieDto.title,
        dateStart: new Date(movieDto.dateStart),
        dateEnd: new Date(movieDto.dateEnd),
      },
    });
    if (existingMovie) {
      return existingMovie;
    }
    const movie = this.repository.create({
      ...movieDto,
      dateStart: new Date(movieDto.dateStart),
      dateEnd: new Date(movieDto.dateEnd),
    });
    const savedMovie = await this.repository.save(movie);
    await this.cache.delByPrefix('movies:list:');
    this.eventEmitter.emit(
      'movie.created',
      new MovieCreatedEvent(
        savedMovie.id.toString(),
        this.cls.get('requestId'),
      ),
    );
    return movie;
  }

  async update(id: string, movie: UpdateMovieDto): Promise<Movie | null> {
    const movieExists = await this.repository.exist({ where: { id } });
    if (!movieExists) {
      return null;
    }
    await this.repository.update(id, movie);
    const updatedMovie = await this.repository.findOneBy({ id });
    await this.cache.delByPrefix('movies:list:');
    this.eventEmitter.emit(
      'movie.updated',
      new MovieUpdatedEvent(id, this.cls.get('requestId')),
    );
    return updatedMovie;
  }

  async delete(id: string): Promise<boolean> {
    const movieExists = await this.repository.exists({ where: { id } });
    if (!movieExists) {
      return false;
    }
    await this.repository.delete(id);
    await this.cache.delByPrefix('movies:list:');
    this.eventEmitter.emit(
      'movie.deleted',
      new MovieDeletedEvent(id, this.cls.get('requestId')),
    );
    return true;
  }
}
