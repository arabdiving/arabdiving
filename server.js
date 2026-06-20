/**
 * ArabDiving - Full Stack Server
 * Node.js + Express + MongoDB
 */

require('dotenv').config();
require('./config/db');

const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static files ────────────────────────────────────
// Admin portal at /admin-panel
app.use('/admin-panel', express.static(path.join(__dirname, 'public/admin')));
// Site pages assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// ── API Routes ──────────────────────────────────────
app.use('/api',       require('./routes/api'));       // Public API
app.use('/admin-api', require('./routes/admin'));     // Protected Admin API

// ── Site Pages (must be LAST) ────────────────────────
app.use('/', require('./routes/site'));

// ── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🤿 ArabDiving server running → http://localhost:${PORT}`);
  console.log(`⚙️  Admin panel → http://localhost:${PORT}/admin-panel`);
});
