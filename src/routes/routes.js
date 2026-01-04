const express = require("express");
const router = express.Router();

const { signup,login,me,logout } = require("../controllers/authController");
const { getHotels, getHotelById } = require("../controllers/hotelController");
const authMiddleware = require("../middlewares/middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

router.get("/hotels", getHotels);
router.get("/hotels/:id", getHotelById);

module.exports = router;
