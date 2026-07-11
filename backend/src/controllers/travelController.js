/*
  محرك بيانات السفر — مزودان (تحديث يوليو 2026):

  1) الطيران: Travelpayouts (Aviasales Data API) — بعمولة marker مدمجة في رابط الحجز.
     التوكن: https://www.travelpayouts.com/programs/100/tools/api
     backend/.env:
       TP_TOKEN=xxxx
       TP_MARKER=548822

  2) الفنادق: LiteAPI (Nuitée) — إتاحة وأسعار حية لملايين الفنادق.
     التسجيل الذاتي المجاني: https://www.liteapi.travel (مفتاح sandbox فوري، ثم production)
     backend/.env:
       LITEAPI_KEY=xxxx
     ملاحظة: مفتاح sandbox يعطي بيانات تجريبية — بدّله بمفتاح production للأسعار الحقيقية.

  ⚠️ Amadeus Self-Service أُزيل — البوابة أُغلقت رسميًا في 17 يوليو 2026.

  بدون مفاتيح: النقاط ترجع enabled:false والواجهة تعرض روابط بحث معبأة (Drive يحوّلها لعمولات).
*/

const fetch = require("node-fetch");

/* ═══ Travelpayouts (طيران) ═══ */
const TP_TOKEN = process.env.TP_TOKEN || "";
const TP_MARKER = process.env.TP_MARKER || "548822";
const tpEnabled = () => Boolean(TP_TOKEN);

// رابط حجز Aviasales بعمولة الـmarker — صيغة: ORIG + DDMM + DEST + adults
const aviasalesLink = (origin, dest, dateISO, adults) => {
  const dd = dateISO ? dateISO.slice(8, 10) : "";
  const mm = dateISO ? dateISO.slice(5, 7) : "";
  return `https://www.aviasales.com/search/${origin}${dd}${mm}${dest}${adults || 1}?marker=${TP_MARKER}`;
};

/* ═══ LiteAPI (فنادق) ═══ */
const LITE_KEY = process.env.LITEAPI_KEY || "";
const liteEnabled = () => Boolean(LITE_KEY);
const LITE_HOST = "https://api.liteapi.travel/v3.0";

async function liteGet(path, params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${LITE_HOST}${path}?${qs}`, { headers: { "X-API-Key": LITE_KEY, accept: "application/json" } });
  return res.json();
}
async function litePost(path, body) {
  const res = await fetch(`${LITE_HOST}${path}`, {
    method: "POST",
    headers: { "X-API-Key": LITE_KEY, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

/* ═══ كاش نتائج 15 دقيقة ═══ */
const cache = new Map();
const cached = (k) => { const h = cache.get(k); return h && Date.now() - h.t < 15 * 60_000 ? h.v : null; };
const store = (k, v) => { if (cache.size > 400) cache.clear(); cache.set(k, { t: Date.now(), v }); };

/* ─── GET /api/travel/flights?origin=RUH&dest=HRG&date=YYYY-MM-DD&adults=2 ─── */
const searchFlights = async (req, res) => {
  try {
    if (!tpEnabled()) return res.json({ success: true, enabled: false, offers: [] });
    const { origin, dest, date, adults } = req.query;
    if (!origin || !dest || !date) return res.status(400).json({ success: false, message: "origin, dest, date مطلوبة" });
    const key = `f:${origin}:${dest}:${date}:${adults || 2}`;
    const hit = cached(key); if (hit) return res.json(hit);

    const qs = new URLSearchParams({
      origin: String(origin).toUpperCase(), destination: String(dest).toUpperCase(),
      depart_date: date, currency: "sar", token: TP_TOKEN,
    });
    const r = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?${qs}`);
    const d = await r.json();
    const destData = (d.data && d.data[String(dest).toUpperCase()]) || {};
    const offers = Object.values(destData).slice(0, 8).map((o, i) => ({
      id: `tp-${i}`,
      price: String(o.price || ""),
      currency: "SAR",
      carrier: o.airline || "",
      departure: o.departure_at || "",
      arrival: o.return_at || "",
      duration: "",
      stops: null,
      bookUrl: aviasalesLink(String(origin).toUpperCase(), String(dest).toUpperCase(), date, Number(adults) || 1),
    }));

    const out = { success: true, enabled: true, provider: "travelpayouts", offers };
    store(key, out); res.json(out);
  } catch (e) { res.json({ success: false, enabled: true, message: e.message, offers: [] }); }
};

/* ─── GET /api/travel/calendar?origin=RUH&dest=HRG&month=YYYY-MM ───
   أرخص أيام الشهر (مثل سكاي سكانر) */
const priceCalendar = async (req, res) => {
  try {
    if (!tpEnabled()) return res.json({ success: true, enabled: false, days: [] });
    const { origin, dest, month } = req.query;
    if (!origin || !dest || !month) return res.status(400).json({ success: false, message: "origin, dest, month مطلوبة" });
    const key = `c:${origin}:${dest}:${month}`;
    const hit = cached(key); if (hit) return res.json(hit);

    const qs = new URLSearchParams({
      origin: String(origin).toUpperCase(), destination: String(dest).toUpperCase(),
      depart_date: month, calendar_type: "departure_date", currency: "sar", token: TP_TOKEN,
    });
    const r = await fetch(`https://api.travelpayouts.com/v1/prices/calendar?${qs}`);
    const d = await r.json();
    const days = Object.entries(d.data || {})
      .map(([day, o]) => ({
        date: day, price: o.price || 0, airline: o.airline || "",
        bookUrl: aviasalesLink(String(origin).toUpperCase(), String(dest).toUpperCase(), day, 1),
      }))
      .filter((x) => x.price > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 6);

    const out = { success: true, enabled: true, days };
    store(key, out); res.json(out);
  } catch (e) { res.json({ success: false, enabled: true, message: e.message, days: [] }); }
};

/* ─── GET /api/travel/hotels?city=Hurghada&checkin&checkout&adults ─── (LiteAPI)
   city = اسم المدينة بالإنجليزية (Sharm El Sheikh / Hurghada / Dahab / Marsa Alam...) */
const searchHotels = async (req, res) => {
  try {
    if (!liteEnabled()) return res.json({ success: true, enabled: false, hotels: [] });
    const { city, checkin, checkout, adults } = req.query;
    if (!city || !checkin) return res.status(400).json({ success: false, message: "city, checkin مطلوبة" });
    const key = `h:${city}:${checkin}:${checkout}:${adults || 2}`;
    const hit = cached(key); if (hit) return res.json(hit);

    // 1) فنادق المدينة
    const list = await liteGet("/data/hotels", { countryCode: "EG", cityName: String(city), limit: "30" });
    const hotelsMeta = list.data || [];
    if (!hotelsMeta.length) { const empty = { success: true, enabled: true, hotels: [] }; store(key, empty); return res.json(empty); }
    const byId = new Map(hotelsMeta.map((h) => [h.id, h]));

    // 2) الأسعار والإتاحة الفعلية بالتواريخ
    const rates = await litePost("/hotels/rates", {
      hotelIds: hotelsMeta.slice(0, 30).map((h) => h.id),
      checkin, checkout: checkout || checkin,
      occupancies: [{ adults: Number(adults) || 2 }],
      currency: "SAR",
      guestNationality: "SA",
    });

    const hotels = (rates.data || [])
      .map((h) => {
        // أدنى سعر إجمالي متاح في الفندق
        let min = Infinity;
        (h.roomTypes || []).forEach((rt) => (rt.rates || []).forEach((r0) => {
          const amt = r0?.retailRate?.total?.[0]?.amount;
          if (typeof amt === "number" && amt > 0 && amt < min) min = amt;
        }));
        const meta = byId.get(h.hotelId) || {};
        return min === Infinity ? null : {
          id: h.hotelId,
          name: meta.name || h.hotelId,
          rating: meta.stars || meta.rating || null,
          price: String(Math.round(min)),
          currency: "SAR",
          room: "",
        };
      })
      .filter(Boolean)
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 10);

    const out = { success: true, enabled: true, provider: "liteapi", hotels };
    store(key, out); res.json(out);
  } catch (e) { res.json({ success: false, enabled: true, message: e.message, hotels: [] }); }
};

module.exports = { searchFlights, searchHotels, priceCalendar };
