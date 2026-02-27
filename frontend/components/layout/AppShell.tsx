"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import KuberGuide from "@/components/ui/KuberGuide";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <>
        {/* Aurora background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="aurora-orb w-[500px] h-[500px] bg-yellow-500/[0.02] -top-48 -right-48" />
          <div className="aurora-orb w-[400px] h-[400px] bg-blue-500/[0.015] bottom-0 -left-48" style={{ animationDelay: "-5s" }} />
          <div className="aurora-orb w-[300px] h-[300px] bg-purple-500/[0.01] top-1/2 right-1/4" style={{ animationDelay: "-10s" }} />
        </div>

        <div className="relative z-10">
          {children}
        </div>

        <KuberGuide />
      </>
    );
  }

  return (
    <>
      {/* Aurora background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="aurora-orb w-[500px] h-[500px] bg-yellow-500/[0.02] -top-48 -right-48" />
        <div className="aurora-orb w-[400px] h-[400px] bg-blue-500/[0.015] bottom-0 -left-48" style={{ animationDelay: "-5s" }} />
        <div className="aurora-orb w-[300px] h-[300px] bg-purple-500/[0.01] top-1/2 right-1/4" style={{ animationDelay: "-10s" }} />
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

      <KuberGuide />
    </>
  );
}
