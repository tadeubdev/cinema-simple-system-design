import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './config/redis.config';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, mongoConfig],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
