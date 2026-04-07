const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

const hotel = require("../controllers/hotelController");
const authCtrl = require("../controllers/authController");
const adminCtrl = require("../controllers/adminController");

const notificationRoutes = require("./notificationRoutes");
const paymentRoutes = require("./paymentRoutes");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.get("/me", auth, authCtrl.me);
router.post("/logout", auth, authCtrl.logout);

// Cache hotel lists for 5 minutes (300 seconds) to simulate blazingly fast scaled response
router.get("/hotels", cacheMiddleware(300), hotel.getHotels);
router.get("/hotels/:id", cacheMiddleware(300), hotel.getHotelById);

router.get("/admin/analytics", auth, admin, adminCtrl.getAnalytics);
router.post("/admin/hotels", auth, admin, hotel.createHotel);
router.put("/admin/hotels/:id", auth, admin, hotel.updateHotel);
router.delete("/admin/hotels/:id", auth, admin, hotel.deleteHotel);

router.use("/notifications", notificationRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
