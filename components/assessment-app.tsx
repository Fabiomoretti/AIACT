"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Mail,
  PhoneCall,
  ShieldAlert
} from "lucide-react";
import { Badge, Button, FieldError, Panel } from "@/components/ui";
import { sections, totalQuestionCount } from "@/lib/questions";
import { calculateAssessment } from "@/lib/scoring";
import type { Answers, AssessmentResult, LeadPayload } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

type Stage = "questions" | "mini" | "report";

type LeadForm = Omit<LeadPayload, "answers" | "result" | "startedAt">;

const initialLead: LeadForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  role: "",
  phone: "",
  privacyConsent: false,
  marketingConsent: false,
  contactRequested: false,
  website: ""
};

const offerLinks = {
  kit: process.env.NEXT_PUBLIC_KIT_BASE_URL ?? "https://example.com/kit-base-ai-act",
  consultation: process.env.NEXT_PUBLIC_CONSULTATION_URL ?? "https://example.com/check-up-ai-act",
  compliance: process.env.NEXT_PUBLIC_COMPLIANCE_URL ?? "https://example.com/compliance-ai-act"
};

function riskTone(level: string) {
  if (level === "Basso") return "success";
  if (level === "Medio") return "warning";
  return "danger";
}

function isSectionComplete(sectionIndex: number, answers: Answers) {
  return sections[sectionIndex].questions.every((question) => {
    const value = answers[question.id];
    if (question.type === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  });
}

function validateLead(form: LeadForm) {
  const errors: Partial<Record<keyof LeadForm, string>> = {};

  if (form.firstName.trim().length < 2) errors.firstName = "Inserisci il nome.";
  if (form.lastName.trim().length < 2) errors.lastName = "Inserisci il cognome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Inserisci un'email valida.";
  if (form.company.trim().length < 2) errors.company = "Inserisci azienda o studio.";
  if (form.role.trim().length < 2) errors.role = "Inserisci il ruolo.";
  if (!form.privacyConsent) errors.privacyConsent = "Il consenso privacy e obbligatorio.";

  return errors;
}

export function AssessmentApp() {
  const topRef = useRef<HTMLElement>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("questions");
  const [lead, setLead] = useState<LeadForm>(initialLead);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => (Array.isArray(value) ? value.length > 0 : Boolean(value))).length;
  }, [answers]);

  const currentSection = sections[sectionIndex];
  const progress = Math.round((answeredCount / totalQuestionCount) * 100);
  const sectionComplete = isSectionComplete(sectionIndex, answers);

  useEffect(() => {
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      topRef.current?.focus({ preventScroll: true });
    });
  }, [sectionIndex, stage]);

  function updateSingle(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function updateMulti(id: string, value: string) {
    setAnswers((current) => {
      const currentValues = Array.isArray(current[id]) ? (current[id] as string[]) : [];
      const next = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...current, [id]: next };
    });
  }

  function nextSection() {
    trackEvent("assessment_step_completed", { section: currentSection.id });

    if (sectionIndex < sections.length - 1) {
      setSectionIndex((index) => index + 1);
      return;
    }

    const calculated = calculateAssessment(answers);
    setResult(calculated);
    setStage("mini");
    trackEvent("lead_form_viewed", { score: calculated.score, category: calculated.category });
  }

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result) return;

    const validation = validateLead(lead);
    setErrors(validation);
    setServerError("");

    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    trackEvent("lead_submitted", { category: result.category });

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        firstName: lead.firstName.trim(),
        lastName: lead.lastName.trim(),
        email: lead.email.trim(),
        company: lead.company.trim(),
        role: lead.role.trim(),
        phone: lead.phone?.trim(),
        answers,
        result,
        startedAt
      })
    });

    const data = await response.json().catch(() => null);
    setSubmitting(false);

    if (!response.ok) {
      setServerError(data?.error ?? "Errore durante l'invio. Riprova tra poco.");
      return;
    }

    setResult(data.result);
    setStage("report");
    trackEvent("report_viewed", { score: data.result.score, category: data.result.category });
  }

  return (
    <main ref={topRef} tabIndex={-1} className="min-h-screen focus:outline-none">
      <header className="border-b border-cream/10 bg-night text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="FM Digital Strategy">
            <span className="rounded-md bg-cream/95 px-2.5 py-2 shadow-panel">
              <Image
                src="https://www.fabiomoretti.com/wp-content/uploads/2025/04/Logo-FM-scuro.png"
                alt="FM Digital Strategy"
                width={190}
                height={42}
                className="h-8 w-auto"
              />
            </span>
          </Link>
          <Link href="/privacy" target="_blank" rel="noreferrer" className="text-sm font-semibold text-cream opacity-70 hover:opacity-100">
            Privacy
          </Link>
        </div>
      </header>

      {stage === "questions" && (
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="lg:pt-2">
            <div className="rounded-lg border border-line bg-panel p-4 shadow-panel">
              <p className="text-xs font-semibold uppercase text-muted">Progresso</p>
              <div className="mt-3 h-2 rounded-full bg-brandSoft">
                <div className="brand-gradient h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted">{progress}% completato</p>
              <div className="mt-5 space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`rounded-md px-3 py-2 text-sm ${
                      index === sectionIndex ? "brand-gradient font-semibold text-cream" : "text-muted"
                    }`}
                  >
                    {index + 1}. {section.title}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <p className="text-sm font-semibold text-rose">
              Sezione {sectionIndex + 1} di {sections.length}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{currentSection.title}</h1>
            <p className="mt-2 max-w-2xl leading-7 text-muted">{currentSection.description}</p>

            <div className="mt-8 space-y-6">
              {currentSection.questions.map((question) => (
                <Panel key={question.id} className="p-5">
                  <h2 className="text-base font-bold">{question.text}</h2>
                  {question.description && (
                    <div className="mt-2 space-y-2 text-xs leading-5 text-muted">
                      {question.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const selected =
                        question.type === "multi"
                          ? Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(option.value)
                          : answers[question.id] === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 text-sm font-medium transition ${
                            selected
                              ? "border-rose bg-brandSoft text-rose"
                              : "border-line bg-paper hover:border-rose/40"
                          }`}
                        >
                          <input
                            className="h-4 w-4 accent-[oklch(var(--rose))]"
                            type={question.type === "multi" ? "checkbox" : "radio"}
                            name={question.id}
                            value={option.value}
                            checked={selected}
                            onChange={() =>
                              question.type === "multi"
                                ? updateMulti(question.id, option.value)
                                : updateSingle(question.id, option.value)
                            }
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </Panel>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setSectionIndex((index) => Math.max(0, index - 1))}
                disabled={sectionIndex === 0}
              >
                <ArrowLeft size={17} aria-hidden />
                Indietro
              </Button>
              <Button type="button" onClick={nextSection} disabled={!sectionComplete}>
                {sectionIndex === sections.length - 1 ? "Vedi primo risultato" : "Continua"}
                <ArrowRight size={17} aria-hidden />
              </Button>
            </div>
          </section>
        </section>
      )}

      {stage === "mini" && result && (
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <Badge tone={riskTone(result.riskLevel) as "success" | "warning" | "danger"}>{result.riskLevel}</Badge>
              <h1 className="mt-4 text-3xl font-bold">Ecco il tuo primo risultato</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">
                La tua organizzazione sembra avere un livello di preparazione: <strong>{result.category}</strong>.
              </p>

              <Panel className="mt-6 p-5">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <p className="text-sm font-semibold text-muted">Punteggio</p>
                    <p className="mt-1 text-5xl font-bold">{result.score}<span className="text-xl text-muted">/100</span></p>
                  </div>
                  <ShieldAlert className="text-rose" size={42} aria-hidden />
                </div>

                {result.riskFlags.length > 0 && (
                  <div className="mt-5 flex gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
                    <p className="text-sm leading-6">
                      Alcuni utilizzi indicati potrebbero richiedere una valutazione specialistica prima di procedere.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h2 className="font-bold">Prime criticita rilevate</h2>
                    <ol className="mt-3 space-y-2">
                      {result.miniIssues.map((issue) => (
                        <li key={issue} className="text-sm leading-6 text-muted">{issue}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h2 className="font-bold">Prime azioni consigliate</h2>
                    <ol className="mt-3 space-y-2">
                      {result.miniActions.map((action) => (
                        <li key={action} className="text-sm leading-6 text-muted">{action}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Panel>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-muted">
                Hai gia fatto il primo passo: ora hai una fotografia iniziale della tua situazione. Ricevi il report completo per capire quali documenti preparare e da dove iniziare.
              </p>
            </div>

            <Panel className="p-5">
              <Mail className="text-rose" size={28} aria-hidden />
              <h2 className="mt-3 text-2xl font-bold">Vuoi ricevere il report completo via email?</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Il report completo include il dettaglio delle tue risposte, i documenti mancanti, le priorita operative e il servizio piu adatto alla tua situazione.
              </p>

              <form className="mt-5 space-y-4" onSubmit={submitLead}>
                <input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  value={lead.website}
                  onChange={(event) => setLead((current) => ({ ...current, website: event.target.value }))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="firstName">Nome</label>
                    <input id="firstName" className="form-field mt-1" value={lead.firstName} onChange={(event) => setLead({ ...lead, firstName: event.target.value })} />
                    <FieldError>{errors.firstName}</FieldError>
                  </div>
                  <div>
                    <label className="label" htmlFor="lastName">Cognome</label>
                    <input id="lastName" className="form-field mt-1" value={lead.lastName} onChange={(event) => setLead({ ...lead, lastName: event.target.value })} />
                    <FieldError>{errors.lastName}</FieldError>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="email">Email aziendale</label>
                  <input id="email" type="email" className="form-field mt-1" value={lead.email} onChange={(event) => setLead({ ...lead, email: event.target.value })} />
                  <FieldError>{errors.email}</FieldError>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="company">Azienda / studio</label>
                    <input id="company" className="form-field mt-1" value={lead.company} onChange={(event) => setLead({ ...lead, company: event.target.value })} />
                    <FieldError>{errors.company}</FieldError>
                  </div>
                  <div>
                    <label className="label" htmlFor="role">Ruolo</label>
                    <input id="role" className="form-field mt-1" value={lead.role} onChange={(event) => setLead({ ...lead, role: event.target.value })} />
                    <FieldError>{errors.role}</FieldError>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="phone">Telefono opzionale</label>
                  <input id="phone" className="form-field mt-1" value={lead.phone} onChange={(event) => setLead({ ...lead, phone: event.target.value })} />
                </div>
                <label className="flex gap-3 text-sm leading-6">
                  <input
                    id="privacyConsent"
                    name="privacyConsent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[oklch(var(--rose))]"
                    checked={lead.privacyConsent}
                    onChange={(event) => setLead({ ...lead, privacyConsent: event.target.checked })}
                  />
                  <span>
                    Accetto l&apos;informativa privacy e autorizzo il trattamento dei dati per ricevere il report.
                    <Link className="ml-1 font-semibold text-rose" href="/privacy" target="_blank" rel="noreferrer">Leggi privacy</Link>
                  </span>
                </label>
                <FieldError>{errors.privacyConsent}</FieldError>
                <label className="flex gap-3 text-sm leading-6">
                  <input
                    id="marketingConsent"
                    name="marketingConsent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[oklch(var(--rose))]"
                    checked={lead.marketingConsent}
                    onChange={(event) => setLead({ ...lead, marketingConsent: event.target.checked })}
                  />
                  <span>Voglio ricevere aggiornamenti e checklist operative sull&apos;AI Act.</span>
                </label>
                <label className="flex gap-3 text-sm leading-6">
                  <input
                    id="contactRequested"
                    name="contactRequested"
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[oklch(var(--rose))]"
                    checked={lead.contactRequested}
                    onChange={(event) => setLead({ ...lead, contactRequested: event.target.checked })}
                  />
                  <span>Vorrei essere ricontattato per una valutazione gratuita.</span>
                </label>

                {serverError && <p className="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{serverError}</p>}

                <Button className="w-full" disabled={submitting}>
                  {submitting ? "Invio in corso..." : "Ricevi il report gratuito"}
                  <ArrowRight size={17} aria-hidden />
                </Button>
              </form>
            </Panel>
          </div>
        </section>
      )}

      {stage === "report" && result && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Badge tone={riskTone(result.riskLevel) as "success" | "warning" | "danger"}>{result.riskLevel}</Badge>
              <h1 className="mt-4 text-3xl font-bold">Il tuo report AI Act e pronto</h1>
              <p className="mt-3 leading-7 text-muted">{result.summary}</p>
              <Panel className="mt-6 p-5">
                <p className="text-sm font-semibold text-muted">Punteggio totale</p>
                <p className="mt-1 text-5xl font-bold">{result.score}<span className="text-xl text-muted">/100</span></p>
                <div className="mt-4 h-2 rounded-full bg-brandSoft">
                  <div className="brand-gradient h-2 rounded-full" style={{ width: `${result.score}%` }} />
                </div>
                <p className="mt-4 text-sm">
                  Servizio consigliato: <strong>{result.recommendedOffer}</strong>
                </p>
              </Panel>
            </div>

            <div className="space-y-5">
              <Panel className="p-5">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle size={20} className="text-warning" aria-hidden />
                  3 principali criticita rilevate
                </h2>
                <ul className="mt-4 space-y-3">
                  {result.criticalIssues.slice(0, 3).map((issue) => (
                    <li key={issue} className="text-sm leading-6 text-muted">{issue}</li>
                  ))}
                </ul>
              </Panel>

              <Panel className="p-5">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <ClipboardCheck size={20} className="text-rose" aria-hidden />
                  5 azioni consigliate
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {result.recommendedActions.slice(0, 5).map((action) => (
                    <li key={action} className="rounded-md border border-line bg-paper p-3 text-sm leading-6">{action}</li>
                  ))}
                </ul>
              </Panel>

              <Panel className="p-5">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <CheckCircle2 size={20} className="text-success" aria-hidden />
                  Documenti mancanti consigliati
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.missingDocuments.map((document) => (
                    <Badge key={document}>{document}</Badge>
                  ))}
                </div>
              </Panel>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  className="focus-ring brand-gradient inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-center text-sm font-semibold text-cream shadow-brand hover:brightness-105"
                  href={offerLinks.kit}
                  onClick={() => trackEvent("cta_kit_clicked")}
                >
                  <Download size={17} aria-hidden />
                  Kit Base
                </a>
                <a
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-panel px-4 py-2 text-center text-sm font-semibold text-ink hover:border-rose/40 hover:bg-brandSoft"
                  href={offerLinks.consultation}
                  onClick={() => trackEvent("cta_consultation_clicked")}
                >
                  <PhoneCall size={17} aria-hidden />
                  Check-up
                </a>
                <a
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-panel px-4 py-2 text-center text-sm font-semibold text-ink hover:border-rose/40 hover:bg-brandSoft"
                  href={offerLinks.compliance}
                >
                  Assistenza completa
                </a>
              </div>

              <p className="text-xs leading-5 text-muted">
                Il report ha finalita informative e non costituisce consulenza legale.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
