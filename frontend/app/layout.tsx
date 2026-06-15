import type { Metadata } from "next";
import { Cairo } from "next/font/google";

import "./globals.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "ArabDiving",
  description: "مجتمع الغوص العربي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}