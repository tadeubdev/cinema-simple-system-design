export interface AllMoviesQueryDto {
  search?: string;
  page?: number;
  limit?: number;
  date_start?: string;
  date_end?: string;
}

export function buildMoviesCacheKey(query: AllMoviesQueryDto) {
  const normalized = {
    search: query.search || '',
    page: query.page || 1,
    limit: query.limit || 10,
    date_start: query.date_start || '',
    date_end: query.date_end || '',
  };
  return `movies:list:${JSON.stringify(normalized)}`;
}
