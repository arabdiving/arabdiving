require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const securityHeaders = require("./middleware/securityHeaders");
const rateLimit = require("./middleware/rateLimit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const diveSiteRoutes = require("./routes/diveSiteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const statsRoutes = require("./routes/statsRoutes");
const contentRoutes = require("./routes/contentRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const logbookRoutes = require("./routes/logbookRoutes");
const commentRoutes = require("./routes/commentRoutes");
const childProfileRoutes = require("./routes/childProfileRoutes");
const partnerCenterRoutes = require("./routes/partnerCenterRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sizeProfileRoutes = require("./routes/sizeProfileRoutes");
const friendRoutes = require("./routes/friendRoutes");
const dmRoutes = require("./routes/dmRoutes");
const ogPreviewRoutes = require("./routes/ogPreviewRoutes");

const app = express();

connectDB();

// Trust proxy so req.ip is accurate behind a reverse proxy / host platform.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Security headers on every response.
app.use(securityHeaders);

// CORS: only allow configured origins (comma-separated in CORS_ORIGIN).
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, mobile apps) with no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Throttle auth endpoints to slow down brute-force / abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: "محاولات تسجيل دخول كثيرة. يرجى المحاولة بعد قليل.",
});

app.get("/", (req, res) => {
  res.json({ message: "ArabDiving API Running" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dive-sites", diveSiteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/logbook", logbookRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/child-profiles", childProfileRoutes);
app.use("/api/partner-centers", partnerCenterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/size-profiles", sizeProfileRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/dm", dmRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/og-preview", ogPreviewRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
