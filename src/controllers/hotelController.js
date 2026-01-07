const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHotels = async (_, res) => {
  res.json(await prisma.hotel.findMany());
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
