export interface RedisConfig {
  uri: string;
  password?: string;
  ttl?: number; // Time to live in seconds
}

export const redisConfig = (): any => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL, 10) : 3600, // Default to 1 hour
});
