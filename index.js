const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

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
  console.log(`👉 http://localhost:${PORT}`);
});
