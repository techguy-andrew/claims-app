"use client";

import { CustomSidebarTrigger, useCustomSidebar } from "@/components/custom-sidebar";

export function AppHeaderBar() {
  const { isMobile, state } = useCustomSidebar();

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {(isMobile || state === "collapsed") && <CustomSidebarTrigger />}
      <h1 className="font-semibold">Claims App</h1>
    </div>
  );
} 