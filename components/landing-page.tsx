"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ClipboardList, FileSearch, GraduationCap, ShieldCheck } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";

const benefits = [
  "Capisci se stai usando AI in modo conforme",
  "Individui i documenti mancanti",
  "Scopri se servono policy, formazione, registro AI o informative",
  "Ricevi un piano d'azione personalizzato"
];

const audiences = [
  "Liberi professionisti",
  "Micro-imprese e PMI",
  "Studi professionali",
  "Agenzie marketing",
  "Software house",
  "Consulenti e aziende strutturate"
];

export function LandingPage() {
  return (
    <main>
      <section className="brand-hero relative overflow-hidden border-b border-night text-cream">
        <div className="mx-auto grid min-h-[610px] max-w-6xl gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <header className="col-span-full flex items-center justify-between">
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
            <Link href="/privacy" target="_blank" rel="noreferrer" className="text-sm font-semibold text-cream opacity-75 hover:opacity-100">
              Privacy
            </Link>
          </header>

          <div className="flex flex-col justify-center">
            <Badge tone="brand">Test gratuito, nessun login</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-cream sm:text-5xl">
              Scopri in 3 minuti quanto la tua azienda e pronta per{" "}
              <span className="brand-highlight px-2">l&apos;AI Act</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-cream opacity-80">
              Rispondi a poche domande e ricevi un report gratuito con il tuo livello di rischio, le aree da sistemare e i prossimi passi consigliati.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild onClick={() => trackEvent("assessment_started")}>
                <Link href="/assessment">
                  Inizia il test gratuito
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </Button>
              <p className="max-w-xs text-sm leading-6 text-cream opacity-70">
                Mini-esito subito visibile. Report completo dopo consenso privacy.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-lg border border-cream/15 bg-night/70 p-4 shadow-brand sm:p-5">
              <div className="flex items-center justify-between border-b border-cream/15 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-cream opacity-60">Anteprima report</p>
                  <p className="mt-1 text-lg font-bold text-cream">AI Act Readiness Check</p>
                </div>
                <Badge tone="warning">Medio</Badge>
              </div>
              <div className="py-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-cream">62</span>
                  <span className="pb-2 text-sm font-semibold text-cream opacity-60">/100</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-cream/15">
                  <div className="brand-gradient h-2 w-[62%] rounded-full" />
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  ["Registro AI", "Da completare"],
                  ["Policy interna", "Parziale"],
                  ["Formazione", "Prioritaria"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-cream/15 bg-cream/5 px-3 py-2">
                    <span className="text-sm font-medium text-cream">{label}</span>
                    <span className="text-sm text-cream opacity-70">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-extrabold">Cosa ottieni dal test</h2>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              Hai gia fatto il primo passo: una fotografia iniziale della tua situazione, senza trasformare il tema AI Act in un blocco operativo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-lg border border-line bg-panel p-4 shadow-panel">
                <span className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                  <CheckCircle2 className="text-cream" size={17} aria-hidden />
                </span>
                <p className="text-sm font-medium leading-6">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-night bg-night text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold">Per chi e</h2>
            <p className="mt-3 leading-7 text-cream opacity-70">
              Pensato per chi usa o sta introducendo AI generativa, chatbot, automazioni, CRM AI, strumenti HR, analisi dati o contenuti generati con AI.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <Badge key={audience}>{audience}</Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {[
              [ClipboardList, "Inventario e classificazione", "Capisci se hai gia mappato strumenti, fornitori e usi rilevanti."],
              [GraduationCap, "AI literacy", "Verifica se formazione e regole interne sono abbastanza presidiate."],
              [FileSearch, "Privacy e trasparenza", "Individua dove servono informative, controlli e documenti aggiornati."],
              [ShieldCheck, "Priorita operative", "Ricevi azioni consigliate in base a score e flag di rischio."]
            ].map(([Icon, title, text]) => {
              const LucideIcon = Icon as typeof ClipboardList;
              return (
                <div key={title as string} className="flex gap-3 rounded-lg border border-cream/10 bg-cream/10 p-4">
                  <LucideIcon className="mt-1 shrink-0 text-flame" size={20} aria-hidden />
                  <div>
                    <h3 className="font-semibold text-cream">{title as string}</h3>
                    <p className="mt-1 text-sm leading-6 text-cream opacity-70">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="brand-gradient rounded-lg p-6 text-cream shadow-brand sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-2xl font-extrabold">Il test ha finalita informative</h2>
            <p className="mt-2 max-w-2xl leading-7 text-cream opacity-80">
              Non costituisce consulenza legale. Ti aiuta a individuare il livello di rischio e le prime azioni da fare.
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-5 border-cream/70 bg-cream text-night hover:bg-cream/90 sm:mt-0" onClick={() => trackEvent("assessment_started")}>
            <Link href="/assessment">
              Inizia il test gratuito
              <ArrowRight size={18} aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
