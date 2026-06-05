import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { LeadPayload } from "@/lib/types";

const defaultLinks = {
  kit: process.env.KIT_BASE_URL ?? "https://example.com/kit-base-ai-act",
  consultation: process.env.CONSULTATION_URL ?? "https://example.com/check-up-ai-act",
  compliance: process.env.COMPLIANCE_URL ?? "https://example.com/compliance-ai-act"
};

const EMAIL_FROM = "AI Act Readiness <info@fabiomoretti.com>";
const REPORT_BCC_EMAIL = "morettifabio70@gmail.com";
const EMAIL_REPLY_TO = "info@fabiomoretti.com";
const REPORT_SUBJECT = "Il tuo report AI Act Readiness e pronto";

function configured(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim();

  return normalized.length > 0 && !normalized.startsWith("INSERISCI_QUI");
}

function list(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function yesNo(value: boolean) {
  return value ? "Si" : "No";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildLeadReportEmail(payload: LeadPayload) {
  const { result } = payload;
  const leadEmail = normalizeEmail(payload.email);

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033;max-width:680px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;margin:0 0 12px">${REPORT_SUBJECT}</h1>
      <p>Ciao ${escapeHtml(payload.firstName)},</p>
      <p>ecco la sintesi del tuo AI Act Readiness Check. Il report ha finalita informative e non costituisce consulenza legale.</p>
      <div style="border:1px solid #d8e1ee;border-radius:10px;padding:18px;margin:20px 0;background:#f7fbff">
        <p style="margin:0 0 8px"><strong>Punteggio:</strong> ${result.score}/100</p>
        <p style="margin:0 0 8px"><strong>Categoria:</strong> ${escapeHtml(result.category)}</p>
        <p style="margin:0"><strong>Livello:</strong> ${escapeHtml(result.riskLevel)}</p>
      </div>
      <p>${escapeHtml(result.summary)}</p>
      <h2 style="font-size:18px;margin-top:24px">Dati del compilatore</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tbody>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Nome</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.firstName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Cognome</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.lastName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(leadEmail)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Azienda / studio</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.company)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Ruolo</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.role)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Telefono</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.phone || "Non indicato")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso privacy</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.privacyConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso marketing</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.marketingConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Richiesta ricontatto</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.contactRequested)}</td></tr>
        </tbody>
      </table>
      <h2 style="font-size:18px;margin-top:24px">Aree critiche</h2>
      <ul>${list(result.criticalIssues.slice(0, 3))}</ul>
      <h2 style="font-size:18px;margin-top:24px">Azioni consigliate</h2>
      <ul>${list(result.recommendedActions.slice(0, 5))}</ul>
      <p style="margin-top:24px">
        <a href="${defaultLinks.kit}" style="color:#2457c5;font-weight:bold">Scarica il Kit Base AI Act</a><br>
        <a href="${defaultLinks.consultation}" style="color:#2457c5;font-weight:bold">Prenota un Check-up AI Act</a><br>
        <a href="${defaultLinks.compliance}" style="color:#2457c5;font-weight:bold">Richiedi assistenza completa</a>
      </p>
      <p style="font-size:12px;color:#667085;margin-top:28px">Il report ha finalita informative e non costituisce consulenza legale.</p>
    </div>
  `;
}

function deliveryResult(sent: boolean, detail?: string) {
  if (sent) return { sent: true };

  const reason = detail ?? "Invio non riuscito";

  return {
    sent: false,
    reason,
    providerLimit: /MS42225|unique recipients|trial account/i.test(reason)
  };
}

function reportBcc(email: string) {
  return normalizeEmail(email) === REPORT_BCC_EMAIL.toLowerCase()
    ? undefined
    : REPORT_BCC_EMAIL;
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

type ReportMessageOptions = {
  includeBcc?: boolean;
  replyTo?: string;
  subject?: string;
  to?: string;
};

export function buildReportEmailMessage(payload: LeadPayload, options: ReportMessageOptions = {}) {
  const to = normalizeEmail(options.to ?? payload.email);
  const bcc = options.includeBcc === false ? undefined : reportBcc(to);

  return {
    from: EMAIL_FROM,
    to,
    ...(bcc ? { bcc } : {}),
    replyTo: options.replyTo ?? EMAIL_REPLY_TO,
    subject: options.subject ?? REPORT_SUBJECT,
    html: buildLeadReportEmail({ ...payload, email: to })
  };
}

function smtpProviderName() {
  return process.env.SMTP_HOST?.includes("mailersend") ? "mailersend-smtp" : "smtp";
}

async function sendViaSmtp(payload: LeadPayload, options?: ReportMessageOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: true,
    tls: {
      minVersion: "TLSv1.2"
    },
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  return transporter
    .sendMail(buildReportEmailMessage(payload, options))
    .then(() => deliveryResult(true))
    .catch((error) => deliveryResult(false, errorMessage(error, "Errore invio report lead via SMTP")));
}

async function sendViaResend(payload: LeadPayload, options?: ReportMessageOptions) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails
    .send(buildReportEmailMessage(payload, options))
    .then(() => deliveryResult(true))
    .catch((error) => deliveryResult(false, errorMessage(error, "Errore invio report lead via Resend")));
}

async function sendThroughAvailableProviders(payload: LeadPayload, options?: ReportMessageOptions) {
  const attempts = [];

  if (configured(process.env.SMTP_HOST) && configured(process.env.SMTP_USER) && configured(process.env.SMTP_PASSWORD)) {
    const smtpResult = await sendViaSmtp(payload, options);
    attempts.push({ provider: smtpProviderName(), lead: smtpResult });

    if (smtpResult.sent || !configured(process.env.RESEND_API_KEY)) {
      return {
        sent: smtpResult.sent,
        provider: smtpProviderName(),
        lead: smtpResult,
        attempts
      };
    }

    const resendResult = await sendViaResend(payload, options);
    attempts.push({ provider: "resend", lead: resendResult });

    return {
      sent: resendResult.sent,
      provider: resendResult.sent ? "resend" : smtpProviderName(),
      lead: resendResult,
      attempts
    };
  }

  if (!configured(process.env.RESEND_API_KEY)) {
    const lead = deliveryResult(false, "SMTP e RESEND_API_KEY non configurati");

    return {
      sent: false,
      provider: "none",
      lead,
      attempts: [{ provider: "none", lead }]
    };
  }

  const leadEmail = await sendViaResend(payload, options);
  attempts.push({ provider: "resend", lead: leadEmail });

  return { sent: leadEmail.sent, provider: "resend", lead: leadEmail, attempts };
}

async function sendOwnerCopy(payload: LeadPayload, reason: "bcc-failed" | "bcc-skipped") {
  return sendThroughAvailableProviders(payload, {
    includeBcc: false,
    replyTo: normalizeEmail(payload.email),
    subject: `Copia report AI Act Readiness: ${payload.company}`,
    to: REPORT_BCC_EMAIL
  }).then((result) => ({ ...result, reason }));
}

export async function sendReportEmails(payload: LeadPayload) {
  const bcc = reportBcc(payload.email);
  const withBcc = await sendThroughAvailableProviders(payload, { includeBcc: true });

  if (withBcc.sent) {
    return {
      sent: true,
      provider: withBcc.provider,
      lead: withBcc.lead,
      ownerCopy: bcc ? { sent: true, method: "bcc" } : { sent: true, method: "same-recipient" },
      attempts: {
        withBcc: withBcc.attempts
      }
    };
  }

  const withoutBcc = bcc
    ? await sendThroughAvailableProviders(payload, { includeBcc: false })
    : withBcc;

  const ownerCopy = bcc
    ? await sendOwnerCopy(payload, withoutBcc.sent ? "bcc-skipped" : "bcc-failed")
    : { sent: false, reason: "Il destinatario del report coincide con l'indirizzo interno" };

  return {
    sent: withoutBcc.sent,
    provider: withoutBcc.provider,
    lead: withoutBcc.lead,
    ownerCopy,
    attempts: {
      withBcc: withBcc.attempts,
      withoutBcc: bcc ? withoutBcc.attempts : undefined
    }
  };
}
