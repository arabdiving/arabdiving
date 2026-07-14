import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import VoiceAccessibilityIntro from "./components/VoiceAccessibilityIntro";
import { API_BASE } from "./lib/api";
import ChatWidget from "./components/ChatWidget";
import PwaRegister from "./components/PwaRegister";
import PwaInstallBanner from "./components/PwaInstallBanner";
import AccessibilityWidget from "./components/AccessibilityWidget";
import ThemeStyle from "./components/ThemeStyle";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const gaScript = GA_ID
  ? "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" + GA_ID + "');"
  : "";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arabdiving.com";
const DESC =
  "أول مجتمع عربي متخصّص في الغوص بالبحر الأحمر — مواقع الغوص، الرحلات، والدليل الكامل للغوّاص العربي.";

// الميتاداتا تُبنى من إعدادات العلامة التجارية (White-Label) مع قيم افتراضية آمنة
async function getBranding() {
  const fallback = { siteName: "ArabDiving", tagline: "مجتمع الغوص العربي", description: DESC };
  try {
    const res = await fetch(`${API_BASE}/api/settings`, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;
    const d = await res.json();
    const b = d.settings?.branding || {};
    return {
      siteName: b.siteName || fallback.siteName,
      tagline: b.tagline || fallback.tagline,
      description: b.description || fallback.description,
    };
  } catch { return fallback; }
}

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBranding();
  const fullTitle = `${b.siteName} — ${b.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: fullTitle, template: `%s | ${b.siteName}` },
    description: b.description,
    icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
    appleWebApp: { capable: true, statusBarStyle: "default", title: b.siteName },
    openGraph: {
      type: "website",
      siteName: b.siteName,
      locale: "ar_AR",
      url: SITE_URL,
      title: fullTitle,
      description: b.description,
      images: [{ url: SITE_URL + "/og-default.png", secureUrl: SITE_URL + "/og-default.png", width: 1200, height: 630, type: "image/png", alt: b.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: b.description,
      images: [SITE_URL + "/og-default.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B2C59",
  width: "device-width",
  initialScale: 1,
  // explicitly allow zoom for accessibility
  userScalable: true,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable + " " + cairo.className}>
        {/* Travelpayouts Drive — التحقق من الملكية + تحويل روابط السفر لعمولات تلقائيًا.
            beforeInteractive = يُحقن في <head> قبل كل السكربتات (شرط التحقق عندهم). */}
        <Script
          id="tp-drive"
          src="https://emrldtp.cc/NTQ4ODIy.js?t=548822"
          strategy="beforeInteractive"
        />

        {GA_ID && (
          <>
            <Script src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{gaScript}</Script>
          </>
        )}

        <ThemeStyle />
        <Navbar />

        {children}

        <Footer />

        <ChatWidget />
        <AccessibilityWidget />
        <VoiceAccessibilityIntro />
        <PwaInstallBanner />
        <PwaRegister />
      </body>
    </html>
  );
}
