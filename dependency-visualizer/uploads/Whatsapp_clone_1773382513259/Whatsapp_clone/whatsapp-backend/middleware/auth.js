const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Try Authorization header → "Bearer token"
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Try Cookie token
    if (!token && req.cookies?.[process.env.COOKIE_NAME || "token"]) {
      token = req.cookies[process.env.COOKIE_NAME || "token"];
    }

    // No token found
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach to req
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};
