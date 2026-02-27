import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Arthashastra — Financial Intelligence Platform",
  description:
    "Institutional-grade, Web3-enabled financial intelligence. Academy, War Room, Market Intel, and Treasury — all in one command center.",
  keywords: [
    "finance",
    "Web3",
    "stock prediction",
    "portfolio",
    "market intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} font-sans bg-slate-950 text-slate-50 antialiased`}>
          {/* Noise texture overlay for premium feel */}
          <div className="noise-overlay" />

          <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
