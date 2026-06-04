import Link from "next/link";
import { Button, Panel } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <main>
      <section className="brand-hero border-b border-night px-4 py-10 text-cream sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm font-semibold text-cream opacity-75 hover:opacity-100">
            Torna alla landing
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold">Privacy e consenso</h1>
          <p className="mt-3 leading-7 text-cream opacity-75">
            Questa pagina e un modello operativo da adattare alla tua informativa privacy ufficiale. Il test non richiede dati sensibili e raccoglie solo le informazioni necessarie a generare e inviare il report AI Act Readiness.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Panel className="p-5">
          <h2 className="text-xl font-bold">Dati raccolti</h2>
          <p className="mt-2 leading-7 text-muted">
            Nome, cognome, email aziendale, azienda o studio, ruolo, telefono opzionale, consensi e risposte al questionario.
          </p>
        </Panel>

        <Panel className="mt-5 p-5">
          <h2 className="text-xl font-bold">Finalita</h2>
          <p className="mt-2 leading-7 text-muted">
            Generazione del report, invio email, ricontatto se richiesto, aggiornamenti marketing solo con consenso opzionale.
          </p>
        </Panel>

        <Panel className="mt-5 p-5">
          <h2 className="text-xl font-bold">Disclaimer</h2>
          <p className="mt-2 leading-7 text-muted">
            Il test ha finalita informative e non costituisce consulenza legale. Per valutazioni su casi specifici, usi ad alto rischio o obblighi regolatori, e opportuno richiedere un approfondimento specialistico.
          </p>
        </Panel>

        <Button asChild className="mt-8">
          <Link href="/assessment">Inizia il test gratuito</Link>
        </Button>
      </section>
    </main>
  );
}
