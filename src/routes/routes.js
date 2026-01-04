const express = require("express");
const router = express.Router();

const { signup,login,me } = require("../controllers/controller");
const authMiddleware = require("../middlewares/middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);

module.exports = router;


