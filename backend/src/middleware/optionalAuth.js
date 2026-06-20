const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Sets req.user if a valid token is present; otherwise continues anonymously.
const optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (h && h.startsWith("Bearer")) {
      const token = h.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    /* ignore invalid token — treat as anonymous */
  }
  next();
};

module.exports = { optionalAuth };
