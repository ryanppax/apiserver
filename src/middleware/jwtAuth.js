const jwt = require("jsonwebtoken");

const isRS = !!process.env.JWT_PUBLIC_KEY;
const verifyOpts = {
  algorithms: [isRS ? "RS256" : "HS256"],
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  clockTolerance: 5
};

module.exports = (required = true) => (req, res, next) => {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return required ? res.status(401).json({ error: "missing token" }) : next();

  try {
    const key = isRS ? process.env.JWT_PUBLIC_KEY : process.env.JWT_SECRET;
    if (!key) return res.status(500).json({ error: "server misconfigured: no JWT key" });
    const payload = jwt.verify(token, key, verifyOpts);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
};
