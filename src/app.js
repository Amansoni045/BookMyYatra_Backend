const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();

// Security: Set security HTTP headers
app.use(helmet());

// Performance & Security: Rate limiting to prevent DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_LOCAL_URL,
      process.env.FRONTEND_DEPLOYED_URL,
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.use("/api", routes);

module.exports = app;
