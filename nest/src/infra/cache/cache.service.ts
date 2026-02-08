/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number) {
    const payload = JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, payload);
    }
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async delByPrefix(prefix: string) {
    // delete all keys matching the prefix (using SCAN to avoid blocking)
    const stream = this.redis.scanStream({
      match: `${prefix}*`,
      count: 100,
    });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        const pipeline = this.redis.pipeline();
        keys.forEach((key) => {
          pipeline.del(key);
        });
        await pipeline.exec();
      }
    });

    return new Promise<void>((resolve, reject) => {
      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
