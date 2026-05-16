"use client";

import { useEffect } from "react";

export default function ViewportMetaFix() {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      return;
    }

    const content = viewportMeta.getAttribute("content") || "";
    if (content.includes("viewport-fit=cover")) {
      return;
    }

    const normalized = content
      ? `${content}, viewport-fit=cover`
      : "width=device-width, initial-scale=1, viewport-fit=cover";

    viewportMeta.setAttribute("content", normalized);
  }, []);

  return null;
}

