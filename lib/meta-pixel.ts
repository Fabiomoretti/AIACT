"use client";

const DEFAULT_META_PIXEL_ID = "4665704080374942";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID;

type MetaPayload = Record<string, unknown>;
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

function sendWhenReady(callback: (fbq: MetaFbq) => void, attempt = 0) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    callback(window.fbq);
    return;
  }

  if (attempt >= 6) return;

  window.setTimeout(() => sendWhenReady(callback, attempt + 1), 350);
}

export function isMetaPixelConfigured() {
  return configured(META_PIXEL_ID);
}

export function trackMetaPageView() {
  if (!isMetaPixelConfigured()) return;
  sendWhenReady((fbq) => fbq("track", "PageView"));
}

export function trackTestCompleted(payload?: MetaPayload) {
  if (!isMetaPixelConfigured()) return;

  const eventPayload = {
    content_name: "AI Act Readiness Check",
    lead_value: scoreValue(payload?.score),
    ...cleanPayload(payload)
  };

  sendWhenReady((fbq) => {
    fbq("track", "CompleteRegistration", eventPayload);
    fbq("trackCustom", "AIActTestCompleted", eventPayload);
  });
}

export function trackReportLead(payload?: MetaPayload) {
  if (!isMetaPixelConfigured()) return;

  const eventPayload = {
    content_name: "AI Act Readiness Report",
    lead_value: scoreValue(payload?.score),
    ...cleanPayload(payload)
  };

  sendWhenReady((fbq) => {
    fbq("track", "Lead", eventPayload);
    fbq("trackCustom", "AIActReportRequested", eventPayload);
  });
}
