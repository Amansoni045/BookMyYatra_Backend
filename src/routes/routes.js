const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const hotel = require("../controllers/hotelController");
const authCtrl = require("../controllers/authController");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.get("/me", auth, authCtrl.me);
router.post("/logout", auth, authCtrl.logout);

router.get("/hotels", hotel.getHotels);
router.get("/hotels/:id", hotel.getHotelById);

router.post("/admin/hotels", auth, admin, hotel.createHotel);
router.put("/admin/hotels/:id", auth, admin, hotel.updateHotel);
router.delete("/admin/hotels/:id", auth, admin, hotel.deleteHotel);

module.exports = router;
