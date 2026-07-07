"use client";

const DEFAULT_META_PIXEL_ID = "4665704080374942";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID;

type MetaPayload = Record<string, string | number | boolean | undefined>;
type MetaFbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: MetaFbq;
    _fbq?: Window["fbq"];
  }
}

function configured(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim();

  return normalized.length > 0 && !normalized.startsWith("INSERISCI_QUI");
}

function cleanPayload(payload?: MetaPayload) {
  if (!payload) return undefined;

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
  );
}

function scoreValue(score: unknown) {
  if (typeof score !== "number") return undefined;
  if (score >= 70) return "Alto";
  if (score >= 40) return "Medio";
  return "Basso";
}

export function isMetaPixelConfigured() {
  return configured(META_PIXEL_ID);
}

export function initMetaPixel() {
  if (typeof window === "undefined" || !isMetaPixelConfigured() || window.fbq?.loaded) return;

  const fbq: MetaFbq = (...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  };

  window.fbq = fbq;
  window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", META_PIXEL_ID);
}

export function trackMetaPageView() {
  if (!isMetaPixelConfigured()) return;
  window.fbq?.("track", "PageView");
}

export function trackTestCompleted(payload?: MetaPayload) {
  if (!isMetaPixelConfigured()) return;

  window.fbq?.("trackCustom", "AIActTestCompleted", {
    content_name: "AI Act Readiness Check",
    lead_value: scoreValue(payload?.score),
    ...cleanPayload(payload)
  });
}

export function trackReportLead(payload?: MetaPayload) {
  if (!isMetaPixelConfigured()) return;

  window.fbq?.("track", "Lead", {
    content_name: "AI Act Readiness Report",
    lead_value: scoreValue(payload?.score),
    ...cleanPayload(payload)
  });
}
