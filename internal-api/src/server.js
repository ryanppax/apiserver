const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`API listening at http://apiserver:${PORT}`);
});

function shutdown(signal) {
  console.log(`\n${signal} received, closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
