// Simple in-memory rate limiter. Good for a single instance.
// For multi-instance deployments, swap for a Redis-backed limiter.
const rateLimit = ({ windowMs, max, message }) => {
  const hits = new Map();

  // Periodically clear expired buckets so the map doesn't grow forever.
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (now > entry.reset) hits.delete(key);
    }
  }, windowMs).unref?.();

  return (req, res, next) => {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    let entry = hits.get(key);
    if (!entry || now > entry.reset) {
      entry = { count: 0, reset: now + windowMs };
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.reset - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        success: false,
        message:
          message || "محاولات كثيرة جدًا. يرجى المحاولة لاحقًا.",
      });
    }

    next();
  };
};

module.exports = rateLimit;
