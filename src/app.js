const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_LOCAL_URL,
      process.env.FRONTEND_DEPLOYED_URL,
    ],
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.use("/api", routes);

module.exports = app;
