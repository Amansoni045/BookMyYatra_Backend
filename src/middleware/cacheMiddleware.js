const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const cacheMiddleware = (duration) => (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`[CACHE HIT] Returning cached response for: ${key}`);
    return res.status(200).json(cachedResponse);
  } else {
    const originalJson = res.json;
    res.json = (body) => {
      console.log(`[CACHE MISS] Caching response for: ${key}`);
      cache.set(key, body, duration);
      res.json = originalJson;
      return res.json(body);
    };
    next();
  }
};

module.exports = cacheMiddleware;
