import { trackReportLead, trackTestCompleted } from "@/lib/meta-pixel";

export type AnalyticsEvent =
  | "assessment_started"
  | "assessment_step_completed"
  | "lead_form_viewed"
  | "lead_submitted"
  | "report_email_sent"
  | "report_viewed"
  | "cta_kit_clicked"
  | "cta_consultation_clicked";

function trackMetaEvent(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (event === "lead_form_viewed") {
    trackTestCompleted(payload);
  }

  if (event === "report_email_sent") {
    trackReportLead(payload);
  }
}

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("ai-act-analytics", {
      detail: {
        event,
        payload,
        timestamp: new Date().toISOString()
      }
    })
  );

  trackMetaEvent(event, payload);

  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${event}`, payload ?? {});
  }
}
