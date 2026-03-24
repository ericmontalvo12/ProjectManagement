"use client";

import { Nav, SidebarProvider, useSidebar } from "@/components/nav";

function AppContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen">
      <Nav />
      <main
        className={`min-h-screen pt-14 transition-[margin] duration-200 md:pt-0 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppContent>{children}</AppContent>
    </SidebarProvider>
  );
}
