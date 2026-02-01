const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Máximo de tentativas de reconexão atingido');
            return new Error('Muitas tentativas de reconexão');
          }
          return retries * 100;
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('Redis: Conectando...');
    });

    redisClient.on('ready', () => {
      console.log('Redis: Conectado e pronto');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis: Reconectando...');
    });

    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('Erro ao conectar ao Redis:', error.message);
    console.log('Aplicação continuará sem cache');
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis: Conexão fechada');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis
};
