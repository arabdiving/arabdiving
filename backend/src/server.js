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
const productRoutes = require("./routes/productRoutes");
const courseRoutes = require("./routes/courseRoutes");
const storeRoutes = require("./routes/storeRoutes");
const sizeProfileRoutes = require("./routes/sizeProfileRoutes");
const friendRoutes = require("./routes/friendRoutes");
const dmRoutes = require("./routes/dmRoutes");
const ogPreviewRoutes = require("./routes/ogPreviewRoutes");
const travelRoutes = require("./routes/travelRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const emailAdminRoutes = require("./routes/emailAdminRoutes");
const { startAutomation } = require("./lib/emailAutomation");

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

// السماح دائماً بأصل الخادم نفسه (APP_URL).
// المتصفح يرسل ترويسة Origin مع طلبات POST حتى من نفس الموقع،
// لذلك الصفحات التي يخدمها هذا الخادم (مثل /email/subscribe.html)
// تحتاج أن يكون أصلها ضمن القائمة المسموح بها.
if (process.env.APP_URL) {
  const self = process.env.APP_URL.trim().replace(/\/$/, "");
  if (self && !allowedOrigins.includes(self)) allowedOrigins.push(self);
}

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
app.use("/api/products", productRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/size-profiles", sizeProfileRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/dm", dmRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/og-preview", ogPreviewRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/email-admin", emailAdminRoutes);
app.use("/uploads", express.static("uploads"));

// صفحات البريد الجاهزة: نموذج الاشتراك + لوحة تحكم الإيميلات
app.use("/email", express.static(require("path").join(__dirname, "public/email")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // تشغيل محرّك أتمتة تسلسل الترحيب
  startAutomation();
});
