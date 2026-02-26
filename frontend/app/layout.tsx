import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

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
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-50 antialiased`}>
        {/* Noise texture overlay for premium feel */}
        <div className="noise-overlay" />

        {/* Aurora background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="aurora-orb w-[500px] h-[500px] bg-yellow-500/[0.02] -top-48 -right-48" />
          <div className="aurora-orb w-[400px] h-[400px] bg-blue-500/[0.015] bottom-0 -left-48" style={{ animationDelay: '-5s' }} />
          <div className="aurora-orb w-[300px] h-[300px] bg-purple-500/[0.01] top-1/2 right-1/4" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Fixed Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col ml-[260px] transition-all duration-500">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-grid p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
