const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT;

const config = {
  frontend: {
    local: process.env.FRONTEND_LOCAL_URL,
    deployed: process.env.FRONTEND_DEPLOYED_URL,
  },
  backend: {
    local: `http://localhost:${PORT}`,
    deployed: process.env.BACKEND_DEPLOYED_URL,
  },
};

const allowedOrigins = [
  config.frontend.deployed,
  config.frontend.local
].filter(Boolean);

if (allowedOrigins.length === 0) {
    console.log("⚠️ CORS allowed origins are not set. Check your .env file.");
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

app.get('/hotels', async (req, res) => {
    try {
        const hotels = await prisma.hotel.findMany();
        res.json(hotels);
    } 
    catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT:- ${PORT}`);
  console.log(`👉 Local URL: ${config.backend.local}`);
  console.log(`🔗 Allowing requests from: ${allowedOrigins.join(', ')}`);
});