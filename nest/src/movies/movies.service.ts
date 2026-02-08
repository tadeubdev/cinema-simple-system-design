/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<Movie>,
  ) {}

  findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    date_start?: string;
    date_end?: string;
  }): Promise<Movie[]> {
    const page = Number(query.page) || 1;
    let limit = Number(query.limit) || 10;
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;
    const dateFilter: Record<string, Date> = {};

    if (query.date_start && !isNaN(Date.parse(query.date_start))) {
      dateFilter.$gte = new Date(query.date_start);
    }
    if (query.date_end && !isNaN(Date.parse(query.date_end))) {
      dateFilter.$lte = new Date(query.date_end);
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

    return stmt.sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  }

  findOne(id: string): Promise<Movie | null> {
    return this.movieModel.findById(id).exec();
  }

  create(movie: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async update(id: string, movie: UpdateMovieDto): Promise<Movie | null> {
    const movieExists = await this.movieModel.exists({ _id: id }).exec();
    if (!movieExists) {
      return null;
    }
    return this.movieModel.findByIdAndUpdate(id, movie, { new: true }).exec();
  }
}
