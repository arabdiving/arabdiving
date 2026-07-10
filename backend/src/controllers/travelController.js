/*
  تكامل Amadeus Self-Service — أسعار طيران وفنادق حية داخل الموقع.

  التسجيل (مجاني وفوري): https://developers.amadeus.com
  1) أنشئ حسابًا → My Self-Service Workspace → Create New App.
  2) انسخ API Key و API Secret إلى backend/.env:
       AMADEUS_CLIENT_ID=xxxx
       AMADEUS_CLIENT_SECRET=xxxx
       AMADEUS_ENV=test        # بيئة تجريبية ببيانات وهمية — بدّلها إلى production بعد الترقية المجانية
  3) بيئة test مجانية بالكامل (بيانات تجريبية). الترقية لـ production مجانية
     وتشمل حصة شهرية مجانية من الاستعلامات ثم دفع رمزي لكل نداء إضافي.

  ملاحظات:
  - بدون المفاتيح، النقاط ترجع { enabled:false } والواجهة تتحول تلقائيًا للروابط العميقة.
  - كاش داخلي 15 دقيقة لكل استعلام لتوفير الحصة.
  - الحجز النهائي يتم عند مزود الحجز (رابط معبأ) — عرض الأسعار الحية عندنا، والدفع عندهم.
*/

const fetch = require("node-fetch");

const HOSTS = {
  test: "https://test.api.amadeus.com",
  production: "https://api.amadeus.com",
};
const HOST = HOSTS[process.env.AMADEUS_ENV === "production" ? "production" : "test"];
const ID = process.env.AMADEUS_CLIENT_ID || "";
const SECRET = process.env.AMADEUS_CLIENT_SECRET || "";

const enabled = () => Boolean(ID && SECRET);

/* ── OAuth token مع كاش ── */
let tokenCache = { token: "", exp: 0 };
async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.exp - 60_000) return tokenCache.token;
  const res = await fetch(`${HOST}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(ID)}&client_secret=${encodeURIComponent(SECRET)}`,
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(d.error_description || "Amadeus auth failed");
  tokenCache = { token: d.access_token, exp: Date.now() + (d.expires_in || 1799) * 1000 };
  return tokenCache.token;
}

/* ── كاش نتائج 15 دقيقة ── */
const cache = new Map();
const cached = (key) => {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < 15 * 60_000) return hit.v;
  return null;
};
const store = (key, v) => {
  if (cache.size > 300) cache.clear();
  cache.set(key, { t: Date.now(), v });
};

async function amadeus(path, params) {
  const token = await getToken();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${HOST}${path}?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

/* ── GET /api/travel/flights?origin=RUH&dest=SSH&date=2026-08-01&adults=2 ── */
const searchFlights = async (req, res) => {
  try {
    if (!enabled()) return res.json({ success: true, enabled: false, offers: [] });
    const { origin, dest, date, adults } = req.query;
    if (!origin || !dest || !date) return res.status(400).json({ success: false, message: "origin, dest, date مطلوبة" });

    const key = `f:${origin}:${dest}:${date}:${adults || 2}`;
    const hit = cached(key);
    if (hit) return res.json(hit);

    const d = await amadeus("/v2/shopping/flight-offers", {
      originLocationCode: String(origin).toUpperCase(),
      destinationLocationCode: String(dest).toUpperCase(),
      departureDate: date,
      adults: String(Number(adults) || 2),
      max: "8",
      currencyCode: "SAR",
    });

    const carriers = (d.dictionaries && d.dictionaries.carriers) || {};
    const offers = (d.data || []).map((o) => {
      const it = o.itineraries?.[0] || {};
      const segs = it.segments || [];
      const first = segs[0] || {};
      const last = segs[segs.length - 1] || {};
      const code = first.carrierCode || "";
      return {
        id: o.id,
        price: o.price?.grandTotal || o.price?.total || "",
        currency: o.price?.currency || "SAR",
        carrier: carriers[code] || code,
        carrierCode: code,
        departure: first.departure?.at || "",
        arrival: last.arrival?.at || "",
        duration: (it.duration || "").replace("PT", "").toLowerCase(),
        stops: Math.max(0, segs.length - 1),
        bookableSeats: o.numberOfBookableSeats || null,
      };
    });

    const out = { success: true, enabled: true, env: process.env.AMADEUS_ENV || "test", offers };
    store(key, out);
    res.json(out);
  } catch (e) { res.json({ success: false, enabled: true, message: e.message, offers: [] }); }
};

/* ── GET /api/travel/hotels?city=SSH&checkin=2026-08-01&checkout=2026-08-05&adults=2 ── */
const searchHotels = async (req, res) => {
  try {
    if (!enabled()) return res.json({ success: true, enabled: false, hotels: [] });
    const { city, checkin, checkout, adults } = req.query;
    if (!city || !checkin) return res.status(400).json({ success: false, message: "city, checkin مطلوبة" });

    const key = `h:${city}:${checkin}:${checkout}:${adults || 2}`;
    const hit = cached(key);
    if (hit) return res.json(hit);

    // 1) فنادق المدينة (بكود المطار/المدينة IATA)
    const list = await amadeus("/v1/reference-data/locations/hotels/by-city", {
      cityCode: String(city).toUpperCase(),
      radius: "40", radiusUnit: "KM", hotelSource: "ALL",
    });
    const hotelIds = (list.data || []).slice(0, 25).map((h) => h.hotelId).join(",");
    if (!hotelIds) { const empty = { success: true, enabled: true, hotels: [] }; store(key, empty); return res.json(empty); }

    // 2) العروض المتاحة فعليًا بالتواريخ
    const offers = await amadeus("/v3/shopping/hotel-offers", {
      hotelIds,
      checkInDate: checkin,
      ...(checkout ? { checkOutDate: checkout } : {}),
      adults: String(Number(adults) || 2),
      roomQuantity: "1",
      currency: "SAR",
      bestRateOnly: "true",
    });

    const hotels = (offers.data || [])
      .filter((h) => h.available !== false && h.offers?.length)
      .slice(0, 10)
      .map((h) => ({
        id: h.hotel?.hotelId,
        name: h.hotel?.name || "",
        rating: h.hotel?.rating || null,
        price: h.offers[0]?.price?.total || "",
        currency: h.offers[0]?.price?.currency || "SAR",
        checkin: h.offers[0]?.checkInDate,
        checkout: h.offers[0]?.checkOutDate,
        room: h.offers[0]?.room?.typeEstimated?.category || "",
      }));

    const out = { success: true, enabled: true, env: process.env.AMADEUS_ENV || "test", hotels };
    store(key, out);
    res.json(out);
  } catch (e) { res.json({ success: false, enabled: true, message: e.message, hotels: [] }); }
};

module.exports = { searchFlights, searchHotels };
