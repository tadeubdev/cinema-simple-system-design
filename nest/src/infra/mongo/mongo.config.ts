import { MongooseModuleOptions } from '@nestjs/mongoose';

export interface MongoConfig {
  uri: string;
  autoIndex?: boolean;
}

export const mongoConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cinema',
  autoIndex:
    process.env.MONGODB_AUTO_INDEX === undefined ||
    process.env.MONGODB_AUTO_INDEX === 'true',
});
