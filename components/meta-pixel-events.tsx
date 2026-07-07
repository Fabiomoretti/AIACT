"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isMetaPixelConfigured, trackMetaPageView } from "@/lib/meta-pixel";

export function MetaPixelEvents() {
  const pathname = usePathname();
  const firstPageViewHandled = useRef(false);

  useEffect(() => {
    if (!isMetaPixelConfigured()) return;

    if (!firstPageViewHandled.current) {
      firstPageViewHandled.current = true;
      return;
    }

    trackMetaPageView();
  }, [pathname]);

  return null;
}
