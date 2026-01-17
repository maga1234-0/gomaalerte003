"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff } from "lucide-react";

export function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-destructive text-destructive-foreground p-2 text-center text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>You are currently offline. Connection errors in the console are expected. Reports will be saved and sent when you reconnect.</span>
    </div>
  );
}
