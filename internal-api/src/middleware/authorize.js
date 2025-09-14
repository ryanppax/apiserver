module.exports = (...required) => (req, res, next) => {
  const scopes = (req.user?.scope || "").split(" ").filter(Boolean);
  const ok = required.every(s => scopes.includes(s));
  return ok ? next() : res.status(403).json({ error: "forbidden" });
};
