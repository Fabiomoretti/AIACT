import { NextResponse } from "next/server";
import { calculateAssessment } from "@/lib/scoring";
import { sendReportEmails } from "@/lib/email";
import { syncMailerLiteSubscriber } from "@/lib/mailerlite";
import { getSupabaseAdmin } from "@/lib/supabase";
import { leadPayloadSchema } from "@/lib/validation";
import type { LeadPayload } from "@/lib/types";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);

  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > LIMIT;
}

async function persistLead(payload: LeadPayload) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { leadId: `local_${Date.now()}`, persisted: false };
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      company: payload.company,
      role: payload.role,
      privacy_consent: payload.privacyConsent,
      marketing_consent: payload.marketingConsent,
      contact_requested: payload.contactRequested,
      score: payload.result.score,
      category: payload.result.category,
      recommended_offer: payload.result.recommendedOffer,
      risk_flags: payload.result.riskFlags
    })
    .select("id")
    .single();

  if (leadError) {
    throw new Error(leadError.message);
  }

  const { error: assessmentError } = await supabase.from("assessments").insert({
    lead_id: lead.id,
    answers: payload.answers,
    score: payload.result.score,
    category: payload.result.category,
    risk_flags: payload.result.riskFlags,
    missing_documents: payload.result.missingDocuments,
    recommended_actions: payload.result.recommendedActions
  });

  if (assessmentError) {
    throw new Error(assessmentError.message);
  }

  return { leadId: lead.id as string, persisted: true };
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Troppe richieste. Riprova tra qualche minuto." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = leadPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dati non validi", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  if (Date.now() - parsed.data.startedAt < 20_000) {
    return NextResponse.json({ error: "Invio troppo rapido. Completa il test prima di richiedere il report." }, { status: 400 });
  }

  const serverResult = calculateAssessment(parsed.data.answers);
  const payload: LeadPayload = {
    ...parsed.data,
    result: serverResult
  };

  try {
    const persistence = await persistLead(payload).catch((persistenceError) => {
      console.error("Lead persistence failed", persistenceError);

      return {
        leadId: `local_${Date.now()}`,
        persisted: false,
        reason: persistenceError instanceof Error ? persistenceError.message : "Errore salvataggio lead"
      };
    });

    const [email, mailerlite] = await Promise.all([
      sendReportEmails(payload).catch((emailError) => {
        console.error("Email delivery failed", emailError);

        return {
          sent: false,
          reason: emailError instanceof Error ? emailError.message : "Errore invio email"
        };
      }),
      syncMailerLiteSubscriber(payload).catch((mailerliteError) => {
        console.error("MailerLite sync failed", mailerliteError);

        return {
          synced: false,
          reason: mailerliteError instanceof Error ? mailerliteError.message : "Errore sincronizzazione MailerLite"
        };
      })
    ]);

    if (!email.sent) {
      console.error("Lead report email was not sent", email);
    }

    if ("ownerCopy" in email && email.ownerCopy && !email.ownerCopy.sent) {
      console.error("Sender BCC copy was not sent", email.ownerCopy);
    }

    if (!mailerlite.synced) {
      console.error("Lead was not synced to MailerLite", mailerlite);
    }

    return NextResponse.json({
      ok: true,
      leadId: persistence.leadId,
      persisted: persistence.persisted,
      email,
      mailerlite,
      result: serverResult
    });
  } catch (error) {
    console.error("Lead persistence failed", error);

    return NextResponse.json(
      {
        error: "Non siamo riusciti a salvare il lead. Riprova tra poco.",
        message: error instanceof Error ? error.message : "Errore sconosciuto"
      },
      { status: 500 }
    );
  }
}
