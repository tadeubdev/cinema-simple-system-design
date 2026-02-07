import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesService {
  private movies = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      director: 'Frank Darabont',
      releaseYear: 1994,
    },
  ];

  findAll() {
    return this.movies;
  }
}
