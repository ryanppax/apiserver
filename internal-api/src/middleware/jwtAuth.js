const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function getPublicKey() {
  const defaultPath = path.join(__dirname, "../../../public.pem");
  const file = process.env.JWT_PUBLIC_KEY_FILE || defaultPath;
  try {
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

const isRS = !!(process.env.JWT_PUBLIC_KEY || getPublicKey());
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
    const key = isRS ? (process.env.JWT_PUBLIC_KEY || getPublicKey()) : process.env.JWT_SECRET;
    if (!key) return res.status(500).json({ error: "server misconfigured: no JWT key" });
    const payload = jwt.verify(token, key, verifyOpts);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
};
