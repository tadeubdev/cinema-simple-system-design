import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './postgres.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig())],
})
export class DatabaseModule {}
