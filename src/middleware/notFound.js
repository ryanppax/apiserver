module.exports = function notFound(req, res, _next) {
  res.status(404).json({ error: "route not found" });
};
