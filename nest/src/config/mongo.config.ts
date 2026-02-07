import { registerAs } from '@nestjs/config';

export interface MongoConfig {
  uri: string;
}

export default registerAs<MongoConfig>('mongo', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cinema',
}));

// const config = configService.get('mongo');
