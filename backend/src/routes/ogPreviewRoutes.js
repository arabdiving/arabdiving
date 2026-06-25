const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// Simple OG scraper — no external library needed
async function scrapeOG(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ArabDivingBot/1.0; +https://arabdiving.com)",
      Accept: "text/html",
    },
    timeout: 8000,
    redirect: "follow",
  });
  if (!res.ok) throw new Error("fetch failed");
  const html = await res.text();

  const get = (prop) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']+)["']`,
      "i"
    );
    const m = html.match(re) ||
      html.match(
        new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${prop}["']`,
          "i"
        )
      );
    return m ? m[1].trim() : "";
  };

  const title =
    get("og:title") ||
    get("twitter:title") ||
    (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] ||
    "";

  const description =
    get("og:description") ||
    get("twitter:description") ||
    get("description") ||
    "";

  let image = get("og:image") || get("twitter:image") || "";
  // Make relative URLs absolute
  if (image && image.startsWith("/")) {
    const base = new URL(url);
    image = `${base.protocol}//${base.host}${image}`;
  }

  const siteName =
    get("og:site_name") || new URL(url).hostname.replace(/^www\./, "");

  return { url, title, description, image, siteName };
}

// GET /api/og-preview?url=https://...
router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ success: false, message: "رابط غير صالح" });
  }
  try {
    const data = await scrapeOG(url);
    res.json({ success: true, preview: data });
  } catch (err) {
    res.status(422).json({ success: false, message: "تعذّر جلب معاينة الرابط", error: err.message });
  }
});

module.exports = router;
