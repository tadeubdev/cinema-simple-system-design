import { createHash } from 'node:crypto';

export function hashObject(obj: unknown): string {
  return createHash('sha1').update(JSON.stringify(obj)).digest('hex');
}

export function hashObjectWithPrefix(prefix: string, obj: unknown): string {
  return `${prefix}:${hashObject(obj)}`;
}
