const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

getHotels = async (req, res) => {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
};

getHotelById = async (req, res) => {
    const hotel = await prisma.hotel.findUnique({
        where: {
            id: Number(req.params.id)
        },
    });

    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" })
    };
    res.json(hotel);
};

module.exports = { getHotels, getHotelById };