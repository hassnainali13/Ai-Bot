function timeout(req, res, next) {
  res.setTimeout(15000, () => {
    res.status(408).json({ error: "Request timeout" });
  });
  next();
}

module.exports = timeout;
