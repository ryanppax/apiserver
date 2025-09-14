
const jwt = require("jsonwebtoken");
process.env.DOTENV_CONFIG_QUIET = "true";  // force silence
require("dotenv").config();

const iss = process.env.JWT_ISSUER || "https://tokens.local/";
const aud = process.env.JWT_AUDIENCE || "apiserver";
const sub = process.argv[2] || "svc:dev";
const scope = process.argv.slice(3).join(" ") || "items:read items:write";

const priv = process.env.JWT_PRIVATE_KEY || process.env.JWT_SECRET;
if (!priv) {
  console.error("Set JWT_PRIVATE_KEY (for RS256) or JWT_SECRET (for HS256) in env.");
  process.exit(1);
}

const alg = process.env.JWT_PRIVATE_KEY ? "RS256" : "HS256";
const token = jwt.sign({ sub, scope }, priv, { algorithm: alg, issuer: iss, audience: aud, expiresIn: "15m" });
console.log(token);
