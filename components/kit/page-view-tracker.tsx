"use client";

import { useEffect } from "react";

export default function PageViewTracker({ userId }: { userId: string }) {
  useEffect(() => {
    try {
      navigator.sendBeacon(`/api/page-view/${userId}`);
    } catch {
      fetch(`/api/page-view/${userId}`, { method: "POST", keepalive: true });
    }
  }, [userId]);

  return null;
}
