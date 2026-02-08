import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import type { AllMoviesQueryDto } from './dto/all-movies-query.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/')
  findAll(
    @Query()
    query: AllMoviesQueryDto,
  ) {
    return this.moviesService.findAll(query);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
    if (!movie) {
      return {
        statusCode: 404,
        message: 'Movie not found',
      };
    }
    return movie;
  }

  @Post('/')
  async create(@Body() body: CreateMovieDto) {
    const movie = await this.moviesService.create(body);
    if (!movie) {
      return {
        statusCode: 400,
        message: 'Error creating movie',
      };
    }
    return movie;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    const updatedMovie = await this.moviesService.update(id, body);
    if (!updatedMovie) {
      return {
        statusCode: 400,
        message: 'Error updating movie',
      };
    }
    return updatedMovie;
  }
}
