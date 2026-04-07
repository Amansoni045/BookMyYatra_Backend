const NodeCache = require("node-cache");

// stdTTL is the default time-to-live for each cache entry in seconds
// checkperiod is the period in seconds for an automatic delete check interval.
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Use the requested URL as the cache key
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`[CACHE HIT] Returning cached response for: ${key}`);
    return res.status(200).json(cachedResponse);
  } else {
    // Overwrite res.json to intercept the response before sending it
    const originalJson = res.json;
    res.json = (body) => {
      console.log(`[CACHE MISS] Caching response for: ${key}`);
      cache.set(key, body, duration);
      // Restore the original json and send the response
      res.json = originalJson;
      return res.json(body);
    };
    next();
  }
};

module.exports = cacheMiddleware;
