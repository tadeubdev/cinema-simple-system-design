import { hashObjectWithPrefix } from "src/shared/hash-object";

export interface AllMoviesQueryDto {
  search?: string;
  page?: number;
  limit?: number;
  date_start?: string;
  date_end?: string;
}

export function buildMoviesListCacheKey(query: AllMoviesQueryDto) {
  return hashObjectWithPrefix('movies:list', {
    search: query.search || '',
    page: query.page || 1,
    limit: query.limit || 10,
    date_start: query.date_start || '',
    date_end: query.date_end || '',
  });
}
