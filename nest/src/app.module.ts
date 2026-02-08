import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './infra/mongo/database.module';

@Module({
  imports: [MoviesModule, DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
