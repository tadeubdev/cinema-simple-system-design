import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  url: string;
  ttl: number;
}

export default registerAs<RedisConfig>('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  ttl: Number(process.env.REDIS_TTL) || 60000, // Default TTL of 60 seconds
}));

// const config = configService.get('redis');
// return {
//     store: createKeyv(config.url),
//     ttl: config.ttl, // global TTL in milliseconds
// };
