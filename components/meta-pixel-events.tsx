"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMetaPixel, isMetaPixelConfigured, trackMetaPageView, trackReportLead, trackTestCompleted } from "@/lib/meta-pixel";

type AnalyticsDetail = {
  event?: string;
  payload?: Record<string, string | number | boolean | undefined>;
};

export function MetaPixelEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMetaPixelConfigured()) return;

    initMetaPixel();
    trackMetaPageView();
  }, [pathname]);

  useEffect(() => {
    if (!isMetaPixelConfigured()) return;

    function handleAnalytics(event: Event) {
      const detail = (event as CustomEvent<AnalyticsDetail>).detail;

      if (detail?.event === "lead_form_viewed") {
        trackTestCompleted(detail.payload);
      }

      if (detail?.event === "report_email_sent") {
        trackReportLead(detail.payload);
      }
    }

    window.addEventListener("ai-act-analytics", handleAnalytics);

    return () => window.removeEventListener("ai-act-analytics", handleAnalytics);
  }, []);

  return null;
}
