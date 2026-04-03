import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://trade-the-news-ows.vercel.app";

export const metadata: Metadata = {
  title: "Trade the News — Quotient x OWS",
  description:
    "Prediction market intelligence via x402 micropayments. No API keys. No accounts. Just an OWS wallet and USDC.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Trade the News — Quotient x OWS",
    description:
      "AI-powered prediction market intelligence. Pay per call with an OWS wallet.",
    url: "/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400..700&family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
