import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { LeadPayload } from "@/lib/types";

const defaultLinks = {
  kit: process.env.KIT_BASE_URL ?? "https://example.com/kit-base-ai-act",
  consultation: process.env.CONSULTATION_URL ?? "https://example.com/check-up-ai-act",
  compliance: process.env.COMPLIANCE_URL ?? "https://example.com/compliance-ai-act"
};

function list(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
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
      <h1 style="font-size:22px;margin:0 0 12px">Nuovo lead AI Act Readiness</h1>
      <p><strong>Lead:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)} (${escapeHtml(payload.email)})</p>
      <p><strong>Azienda:</strong> ${escapeHtml(payload.company)} | <strong>Ruolo:</strong> ${escapeHtml(payload.role)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(payload.phone || "Non indicato")}</p>
      <p><strong>Punteggio:</strong> ${result.score}/100 | <strong>Categoria:</strong> ${escapeHtml(result.category)}</p>
      <p><strong>Servizio consigliato:</strong> ${escapeHtml(result.recommendedOffer)}</p>
      <p><strong>Flag rischio:</strong> ${escapeHtml(result.riskFlags.join(", ") || "Nessuno")}</p>
      <pre style="white-space:pre-wrap;background:#f5f7fb;border:1px solid #d8e1ee;border-radius:8px;padding:14px">${escapeHtml(JSON.stringify(payload.answers, null, 2))}</pre>
    </div>
  `;
}

export async function sendReportEmails(payload: LeadPayload) {
  const from = process.env.EMAIL_FROM ?? "AI Act Readiness <noreply@example.com>";
  const adminEmail = process.env.ADMIN_EMAIL;
  const leadHtml = buildLeadReportEmail(payload);
  const adminHtml = buildAdminNotificationEmail(payload);

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from,
      to: payload.email,
      subject: "Il tuo report AI Act Readiness e pronto",
      html: leadHtml
    });

    if (adminEmail) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: `Nuovo lead AI Act: ${payload.company}`,
        html: adminHtml
      });
    }

    return { sent: true, provider: "smtp" };
  }

  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "SMTP e RESEND_API_KEY non configurati" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from,
    to: payload.email,
    subject: "Il tuo report AI Act Readiness e pronto",
    html: leadHtml
  });

  if (adminEmail) {
    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `Nuovo lead AI Act: ${payload.company}`,
      html: adminHtml
    });
  }

  return { sent: true, provider: "resend" };
}
