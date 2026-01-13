const userLimits = new Map();

function rateLimit(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  if (!userLimits.has(ip)) userLimits.set(ip, []);

  const timestamps = userLimits
    .get(ip)
    .filter(t => now - t < 60000);

  timestamps.push(now);
  userLimits.set(ip, timestamps);

  if (timestamps.length > 5) {
    return res.status(429).json({
      reply: "Please wait a minute before sending more messages.",
    });
  }

  next();
}

module.exports = rateLimit;
