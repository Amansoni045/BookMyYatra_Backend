const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHotels = async (req, res) => {
  try {
    const { location, tag, minPrice, maxPrice, limit = 50 } = req.query;

    const where = {};
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (tag) where.tag = { contains: tag, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const hotels = await prisma.hotel.findMany({
      where,
      take: Number(limit),
      orderBy: { rating: 'desc' }
    });

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search execution failed" });
  }
};

exports.getHotelById = async (req, res) => {
  const hotel = await prisma.hotel.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!hotel) return res.status(404).json({ message: "Not found" });
  res.json(hotel);
};

exports.createHotel = async (req, res) => {
  res.status(201).json(await prisma.hotel.create({ data: req.body }));
};

exports.updateHotel = async (req, res) => {
  res.json(
    await prisma.hotel.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    })
  );
};

exports.deleteHotel = async (req, res) => {
  await prisma.hotel.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Deleted" });
};
