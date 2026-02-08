import { hashObjectWithPrefix } from 'src/common/hash-object';

export interface AllRoomsQueryDto {
  search?: string;
  page?: number;
  limit?: number;
  date_start?: string;
  date_end?: string;
}

export function buildRoomsListCacheKey(query: AllRoomsQueryDto) {
  return hashObjectWithPrefix('rooms:list', {
    search: query.search || '',
    page: query.page || 1,
    limit: query.limit || 10,
    date_start: query.date_start || '',
    date_end: query.date_end || '',
  });
}
