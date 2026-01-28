const express = require("express");
const {sendBookingNotification} = require("../controllers/notificationController");

const router = express.Router();

router.post("/notify", sendBookingNotification);

module.exports = router;
