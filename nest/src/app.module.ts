import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './infra/mongo/database.module';
import { CacheModule } from './infra/cache/cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    CacheModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
