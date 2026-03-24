"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function WorkQueueTabs({
  byTrade,
  bySub,
}: {
  byTrade: React.ReactNode;
  bySub: React.ReactNode;
}) {
  const [tab, setTab] = useState<"trade" | "sub">("trade");

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setTab("trade")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "trade"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          By Trade
        </button>
        <button
          onClick={() => setTab("sub")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "sub"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          By Subcontractor
        </button>
      </div>
      {tab === "trade" ? byTrade : bySub}
    </div>
  );
}
