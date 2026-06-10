import nodemailer from "nodemailer";
import type { LeadPayload } from "@/lib/types";

const defaultLinks = {
  kit: process.env.KIT_BASE_URL ?? "https://example.com/kit-base-ai-act",
  consultation: process.env.CONSULTATION_URL ?? "https://example.com/check-up-ai-act",
  compliance: process.env.COMPLIANCE_URL ?? "https://example.com/compliance-ai-act",
  guide:
    process.env.AI_ACT_GUIDE_URL ??
    "https://drive.google.com/file/d/1NhdOz1VRX8yDaMCdRxvgnRTVdm2d7Uwq/view?usp=sharing"
};

const EMAIL_FROM = "AI Act Readiness <info@fabiomoretti.com>";
const OWNER_REPORT_EMAIL = "morettifabio70@gmail.com";
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
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso privacy</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.privacyConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso marketing</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.marketingConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Richiesta ricontatto</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.contactRequested)}</td></tr>
        </tbody>
      </table>
      <h2 style="font-size:18px;margin-top:24px">Flag rischio</h2>
      <ul>${list(result.riskFlags.length ? result.riskFlags : ["Nessun flag di rischio specifico rilevato"])}</ul>
      <h2 style="font-size:18px;margin-top:24px">Criticita rilevate</h2>
      <ul>${list(result.criticalIssues.length ? result.criticalIssues : ["Nessuna criticita specifica rilevata"])}</ul>
      <h2 style="font-size:18px;margin-top:24px">Documenti mancanti consigliati</h2>
      <ul>${list(result.missingDocuments.length ? result.missingDocuments : ["Nessun documento specifico rilevato"])}</ul>
      <h2 style="font-size:18px;margin-top:24px">Azioni consigliate</h2>
      <ul>${list(result.recommendedActions.length ? result.recommendedActions : ["Nessuna azione specifica rilevata"])}</ul>
      <div style="margin:28px 0;padding:20px;border:1px solid #f04461;border-radius:10px;background:#fff5f7;text-align:center">
        <p style="margin:0 0 14px;font-size:15px"><strong>La tua Guida Pratica gratuita e pronta.</strong></p>
        <a href="${defaultLinks.guide}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#e91e50;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">&rarr; SCARICA LA GUIDA AI ACT 2026</a>
      </div>
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

  return {
    sent: false,
    reason: detail ?? "Invio non riuscito"
  };
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function reportBcc(email: string) {
  const normalized = normalizeEmail(email);

  return normalized === OWNER_REPORT_EMAIL ? undefined : OWNER_REPORT_EMAIL;
}

export function buildReportEmailMessage(payload: LeadPayload) {
  const to = normalizeEmail(payload.email);
  const bcc = reportBcc(to);

  return {
    from: configured(process.env.SENDER_EMAIL_FROM) ? process.env.SENDER_EMAIL_FROM : EMAIL_FROM,
    to,
    ...(bcc ? { bcc } : {}),
    replyTo: EMAIL_REPLY_TO,
    subject: REPORT_SUBJECT,
    html: buildLeadReportEmail(payload)
  };
}

async function sendViaSender(payload: LeadPayload) {
  const transporter = nodemailer.createTransport({
    host: process.env.SENDER_SMTP_HOST ?? "smtp.sender.net",
    port: Number(process.env.SENDER_SMTP_PORT ?? 587),
    secure: process.env.SENDER_SMTP_SECURE === "true",
    requireTLS: true,
    tls: {
      minVersion: "TLSv1.2"
    },
    auth: {
      user: process.env.SENDER_SMTP_USER,
      pass: process.env.SENDER_SMTP_PASSWORD
    }
  });

  return transporter
    .sendMail(buildReportEmailMessage(payload))
    .then(() => deliveryResult(true))
    .catch((error) => deliveryResult(false, errorMessage(error, "Errore invio report via Sender SMTP")));
}

export async function sendReportEmails(payload: LeadPayload) {
  if (!configured(process.env.SENDER_SMTP_USER) || !configured(process.env.SENDER_SMTP_PASSWORD)) {
    const lead = deliveryResult(false, "Credenziali SENDER_SMTP_USER e SENDER_SMTP_PASSWORD non configurate");

    return {
      sent: false,
      provider: "sender-smtp",
      lead,
      ownerCopy: { sent: false, method: "bcc", reason: lead.reason },
      attempts: [{ provider: "sender-smtp", lead }]
    };
  }

  const result = await sendViaSender(payload);
  const bcc = reportBcc(payload.email);

  return {
    sent: result.sent,
    provider: "sender-smtp",
    lead: result,
    ownerCopy: bcc
      ? { sent: result.sent, method: "bcc", to: OWNER_REPORT_EMAIL }
      : { sent: result.sent, method: "same-recipient" },
    attempts: [{ provider: "sender-smtp", lead: result }]
  };
}
