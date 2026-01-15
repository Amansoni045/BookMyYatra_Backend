const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    console.log("🔐 [AUTH MIDDLEWARE] Request to:", req.method, req.path);
    console.log("📋 [AUTH MIDDLEWARE] Headers:", JSON.stringify(req.headers, null, 2));

    const authHeader = req.headers.authorization;
    console.log("🎫 [AUTH MIDDLEWARE] Authorization header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ [AUTH MIDDLEWARE] No valid Authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 [AUTH MIDDLEWARE] Token extracted:", token ? `${token.substring(0, 20)}...` : "null");

    console.log("🔍 [AUTH MIDDLEWARE] Verifying token with JWT_SECRET...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ [AUTH MIDDLEWARE] Token decoded successfully:", decoded);

    console.log("🔍 [AUTH MIDDLEWARE] Fetching user from database, ID:", decoded.id);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.error("❌ [AUTH MIDDLEWARE] User not found in database for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ [AUTH MIDDLEWARE] User found:", user);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ [AUTH MIDDLEWARE] Error:", error.name, error.message);
    console.error("📍 [AUTH MIDDLEWARE] Error stack:", error.stack);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
