
require("dotenv").config({quiet:true});
const express = require("express");
const cors = require("cors");

const itemsRouter = require("./routes/items.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const jwtAuth = require("./middleware/jwtAuth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "apiserver", time: new Date().toISOString() });
});

app.use(jwtAuth(true));
app.use("/items", itemsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
