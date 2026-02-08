/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Redis from 'ioredis';
import { redisConfig } from './redis.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const config = redisConfig();
    return new Redis({
      host: config.url.split(':')[1].replace('//', ''),
      port: parseInt(config.url.split(':')[2], 10),
      password: config.password,
    });
  },
};
