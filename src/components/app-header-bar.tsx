"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function AppHeaderBar() {
  const { isMobile, state } = useSidebar();

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {(isMobile || state === "collapsed") && <SidebarTrigger />}
      <h1 className="font-semibold">Claims App</h1>
    </div>
  );
} 