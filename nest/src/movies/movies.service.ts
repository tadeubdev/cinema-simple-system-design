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

  findAll() {
    return this.movieModel.find().sort({ createdAt: -1 }).exec();
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
