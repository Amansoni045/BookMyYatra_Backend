const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalHotels = await prisma.hotel.count();
    const totalBookings = await prisma.booking.count();

    const completedBookings = await prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      select: { totalAmount: true }
    });

    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    res.status(200).json({
      totalUsers,
      totalHotels,
      totalBookings,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
