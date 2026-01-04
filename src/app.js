const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const authRoutes = require("./routes/routes");

app.use(cors({
    origin: [
      process.env.FRONTEND_LOCAL_URL,
      process.env.FRONTEND_DEPLOYED_URL,
    ].filter(Boolean),
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});


app.use("/api/auth", authRoutes);


module.exports = app;
