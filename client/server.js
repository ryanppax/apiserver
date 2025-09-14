require("dotenv").config();

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

const privateKeyPath = path.join(__dirname, "..", "private.pem");
const privateKey = fs.readFileSync(privateKeyPath);

const ISSUER = process.env.JWT_ISSUER || "client";
const AUDIENCE = process.env.JWT_AUDIENCE || "apiserver";

function signToken() {
  return jwt.sign({ sub: "client-service" }, privateKey, {
    algorithm: "RS256",
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: "5m"
  });
}

app.use(
  "/client",
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    pathRewrite: { "^/client": "" },
    onProxyReq: (proxyReq) => {
      const token = signToken();
      proxyReq.setHeader("Authorization", `Bearer ${token}`);
    }
  })
);

app.listen(PORT, () => {
  console.log(`Client server listening on http://localhost:${PORT}`);
});

