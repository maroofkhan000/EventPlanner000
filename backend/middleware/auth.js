const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  try {
    req.user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    console.error("Auth user lookup error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user not found" });
  }

  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
