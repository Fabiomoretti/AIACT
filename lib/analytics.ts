export type AnalyticsEvent =
  | "assessment_started"
  | "assessment_step_completed"
  | "lead_form_viewed"
  | "lead_submitted"
  | "report_viewed"
  | "cta_kit_clicked"
  | "cta_consultation_clicked";

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

  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${event}`, payload ?? {});
  }
}
