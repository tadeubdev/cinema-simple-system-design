const { getRedisClient } = require('../config/redis');

/**
 * Middleware de cache Redis
 * @param {number} ttl - Tempo de vida do cache em segundos (padrão: 60s)
 */
const cacheMiddleware = (ttl = 60) => {
  return async (req, res, next) => {
    // Apenas cachear requisições GET
    if (req.method !== 'GET') {
      return next();
    }

    const redisClient = getRedisClient();
    
    // Se Redis não está disponível, continuar sem cache
    if (!redisClient || !redisClient.isOpen) {
      return next();
    }

    try {
      // Gerar chave de cache baseada na URL completa (incluindo query params)
      const cacheKey = `cache:${req.originalUrl || req.url}`;
      
      // Tentar buscar do cache
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS: ${cacheKey}`);
      
      // Interceptar a resposta JSON original
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Salvar no cache
        redisClient
          .setEx(cacheKey, ttl, JSON.stringify(data))
          .catch(err => console.error('Erro ao salvar no cache:', err.message));
        
        // Enviar resposta normal
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Erro no middleware de cache:', error.message);
      next();
    }
  };
};

module.exports = cacheMiddleware;
