import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: mongoConfig,
    }),
  ],
})
export class DatabaseModule {}
