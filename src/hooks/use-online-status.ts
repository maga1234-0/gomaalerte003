"use client";

import { useState, useEffect } from "react";

export function useOnlineStatus() {
  // Initialize state to true to avoid SSR/hydration issues.
  // The effect will correct this on the client.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial status from navigator.
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
