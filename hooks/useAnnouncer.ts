"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAnnouncer() {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("aria-live", "assertive");
    div.setAttribute("aria-atomic", "true");
    div.setAttribute("role", "status");
    div.className = "sr-only";
    document.body.appendChild(div);
    regionRef.current = div;
    return () => { document.body.removeChild(div); };
  }, []);

  const announce = useCallback((message: string) => {
    if (!regionRef.current) return;
    regionRef.current.textContent = "";
    // Tiny delay so screen readers re-announce even identical messages
    requestAnimationFrame(() => {
      if (regionRef.current) regionRef.current.textContent = message;
    });
  }, []);

  return announce;
}
