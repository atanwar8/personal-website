import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});

const instrumentSerif = localFont({
  // Only the italic is used: one accent word per heading.
  src: [{ path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});

const description =
  "Aryan Tanwar: MSIS candidate at Indiana University's Kelley School of Business. Strategy & operations, analytics and AI product work.";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: `${PROFILE.name}: Information Systems & Business Analytics`,
  description,
  openGraph: {
    title: PROFILE.name,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${PROFILE.name}, portfolio` }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PROFILE.name, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#f1ecdf",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
