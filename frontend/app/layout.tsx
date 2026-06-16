import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
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
  openGraph: {
    type: "website",
    siteName: "ArabDiving",
    locale: "ar_AR",
    url: SITE_URL,
    title: "ArabDiving — مجتمع الغوص العربي",
    description: DESC,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ArabDiving" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArabDiving — مجتمع الغوص العربي",
    description: DESC,
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
