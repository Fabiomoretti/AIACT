import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { LeadPayload } from "@/lib/types";

const defaultLinks = {
  kit: process.env.KIT_BASE_URL ?? "https://example.com/kit-base-ai-act",
  consultation: process.env.CONSULTATION_URL ?? "https://example.com/check-up-ai-act",
  compliance: process.env.COMPLIANCE_URL ?? "https://example.com/compliance-ai-act"
};

const EMAIL_FROM = "AI Act Readiness <info@fabiomoretti.com>";
const ADMIN_NOTIFICATION_EMAIL = "info@fabiomoretti.com";

function configured(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim();

  return normalized.length > 0 && !normalized.startsWith("INSERISCI_QUI");
}

function list(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
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

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#172033;max-width:680px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;margin:0 0 12px">Il tuo report AI Act Readiness e pronto</h1>
      <p>Ciao ${escapeHtml(payload.firstName)},</p>
      <p>ecco la sintesi del tuo AI Act Readiness Check. Il report ha finalita informative e non costituisce consulenza legale.</p>
      <div style="border:1px solid #d8e1ee;border-radius:10px;padding:18px;margin:20px 0;background:#f7fbff">
        <p style="margin:0 0 8px"><strong>Punteggio:</strong> ${result.score}/100</p>
        <p style="margin:0 0 8px"><strong>Categoria:</strong> ${escapeHtml(result.category)}</p>
        <p style="margin:0"><strong>Livello:</strong> ${escapeHtml(result.riskLevel)}</p>
      </div>
      <p>${escapeHtml(result.summary)}</p>
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

export function buildAdminNotificationEmail(payload: LeadPayload) {
  const { result } = payload;

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#172033;max-width:760px;margin:0 auto;padding:24px">
      <h1 style="font-size:22px;margin:0 0 12px">Nuovo modulo AI Act compilato</h1>
      <p>Un utente ha completato l'AI Act Readiness Check. Di seguito trovi tutti i dati raccolti e il risultato generato.</p>

      <h2 style="font-size:18px;margin-top:24px">Dati contatto</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tbody>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Nome</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.firstName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Cognome</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.lastName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Azienda / studio</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.company)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Ruolo</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.role)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Telefono</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(payload.phone || "Non indicato")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso privacy</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.privacyConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Consenso marketing</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.marketingConsent)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Richiesta ricontatto</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${yesNo(payload.contactRequested)}</td></tr>
        </tbody>
      </table>

      <h2 style="font-size:18px;margin-top:24px">Risultato assessment</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tbody>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Punteggio</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${result.score}/100</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Categoria</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(result.category)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Livello rischio</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(result.riskLevel)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #d8e1ee"><strong>Servizio consigliato</strong></td><td style="padding:8px;border:1px solid #d8e1ee">${escapeHtml(result.recommendedOffer)}</td></tr>
        </tbody>
      </table>

      <h2 style="font-size:18px;margin-top:24px">Flag rischio</h2>
      <ul>${list(result.riskFlags.length ? result.riskFlags : ["Nessuno"])}</ul>

      <h2 style="font-size:18px;margin-top:24px">Criticita rilevate</h2>
      <ul>${list(result.criticalIssues)}</ul>

      <h2 style="font-size:18px;margin-top:24px">Documenti mancanti consigliati</h2>
      <ul>${list(result.missingDocuments.length ? result.missingDocuments : ["Nessun documento specifico rilevato"])}</ul>

      <h2 style="font-size:18px;margin-top:24px">Azioni consigliate</h2>
      <ul>${list(result.recommendedActions)}</ul>

      <h2 style="font-size:18px;margin-top:24px">Risposte complete</h2>
      <pre style="white-space:pre-wrap;background:#f5f7fb;border:1px solid #d8e1ee;border-radius:8px;padding:14px">${escapeHtml(JSON.stringify(payload.answers, null, 2))}</pre>
    </div>
  `;
}

function deliveryResult(sent: boolean, detail?: string) {
  return sent ? { sent: true } : { sent: false, reason: detail ?? "Invio non riuscito" };
}

export async function sendReportEmails(payload: LeadPayload) {
  const from = EMAIL_FROM;
  const leadHtml = buildLeadReportEmail(payload);
  const adminHtml = buildAdminNotificationEmail(payload);

  if (configured(process.env.SMTP_HOST) && configured(process.env.SMTP_USER) && configured(process.env.SMTP_PASSWORD)) {
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

    const leadEmail = await transporter
      .sendMail({
        from,
        to: payload.email,
        subject: "Il tuo report AI Act Readiness e pronto",
        html: leadHtml
      })
      .then(() => deliveryResult(true))
      .catch((error) => deliveryResult(false, error instanceof Error ? error.message : "Errore invio report lead"));

    const adminEmail = await transporter
      .sendMail({
        from,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `Nuovo modulo AI Act compilato: ${payload.company}`,
        html: adminHtml,
        replyTo: payload.email
      })
      .then(() => deliveryResult(true))
      .catch((error) => deliveryResult(false, error instanceof Error ? error.message : "Errore invio notifica admin"));

    return {
      sent: leadEmail.sent || adminEmail.sent,
      provider: process.env.SMTP_HOST?.includes("mailersend") ? "mailersend-smtp" : "smtp",
      lead: leadEmail,
      admin: adminEmail
    };
  }

  if (!configured(process.env.RESEND_API_KEY)) {
    return { sent: false, reason: "SMTP e RESEND_API_KEY non configurati" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const leadEmail = await resend.emails
    .send({
      from,
      to: payload.email,
      subject: "Il tuo report AI Act Readiness e pronto",
      html: leadHtml
    })
    .then(() => deliveryResult(true))
    .catch((error) => deliveryResult(false, error instanceof Error ? error.message : "Errore invio report lead"));

  const adminEmail = await resend.emails
    .send({
      from,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `Nuovo modulo AI Act compilato: ${payload.company}`,
      html: adminHtml
    })
    .then(() => deliveryResult(true))
    .catch((error) => deliveryResult(false, error instanceof Error ? error.message : "Errore invio notifica admin"));

  return { sent: leadEmail.sent || adminEmail.sent, provider: "resend", lead: leadEmail, admin: adminEmail };
}
