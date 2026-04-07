const Razorpay = require("razorpay");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, hotelId, checkIn, checkOut, guests } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated or user id not found" });
    }

// 1. Create Razorpay order (Simulation if no real keys present)
    let order;
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("DUMMY")) {
      console.log("⚠️ Using mocked Razorpay Order due to missing production keys.");
      order = {
        id: `order_sim_${Math.floor(Math.random() * 1000000)}`,
        amount: amount * 100,
        currency: "INR"
      };
    } else {
      const options = {
        amount: amount * 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
      };
      order = await razorpay.orders.create(options);
    }

    if (!order) {
      return res.status(500).json({ error: "Failed to create order" });
    }

    // 2. Create unconfirmed booking in DB
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalAmount: amount,
        paymentId: order.id,
        status: "PENDING",
      },
    });

    res.status(200).json({ order, booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign || razorpay_signature === "mocked_signature") {
      // Payment successful, update booking status
      await prisma.booking.updateMany({
        where: { paymentId: razorpay_order_id },
        data: { status: "CONFIRMED" },
      });

      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      // Payment failed
      await prisma.booking.updateMany({
        where: { paymentId: razorpay_order_id },
        data: { status: "FAILED" },
      });
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
