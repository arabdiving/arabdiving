import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatWidget from "./components/ChatWidget";
import PwaRegister from "./components/PwaRegister";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ArabDiving — مجتمع الغوص العربي",
    template: "%s | ArabDiving",
  },
  description: DESC,
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ArabDiving" },
  openGraph: {
    type: "website",
    siteName: "ArabDiving",
    locale: "ar_AR",
    url: SITE_URL,
    title: "ArabDiving — مجتمع الغوص العربي",
    description: DESC,
    images: [{ url: SITE_URL + "/og-default.png", secureUrl: SITE_URL + "/og-default.png", width: 1200, height: 630, type: "image/png", alt: "ArabDiving" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArabDiving — مجتمع الغوص العربي",
    description: DESC,
    images: [SITE_URL + "/og-default.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2C59",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable + " " + cairo.className}>
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
        <PwaRegister />
      </body>
    </html>
  );
}
