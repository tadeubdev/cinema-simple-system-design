import { hashObjectWithPrefix } from 'src/common/hash-object';

export interface AllSessionsQueryDto {
  movie_id?: string;
  room_id?: string;
  date_start?: string;
  date_end?: string;
}

export function buildSessionsListCacheKey(query: AllSessionsQueryDto) {
  return hashObjectWithPrefix('sessions:list', {
    movieId: query.movie_id || '',
    roomId: query.room_id || '',
    dateStart: query.date_start || '',
    dateEnd: query.date_end || '',
  });
}
