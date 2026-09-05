"use client";
import { useEffect, useState } from "react";

// Polls /api/notifications every 8s. Works for whichever session (admin or
// client) is active in the current browser — the endpoint figures out which
// one from the request's cookies.
export function useNotifications() {
  const [data, setData] = useState<{ total: number; [key: string]: number | string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      fetch("/api/notifications")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => !cancelled && d && setData(d))
        .catch(() => {});
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
}
