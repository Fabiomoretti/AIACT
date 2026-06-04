import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button, Panel } from "@/components/ui";

export default function ThankYouPage() {
  return (
    <main className="brand-hero flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
      <Panel className="mx-auto max-w-2xl p-8">
        <CheckCircle2 className="text-success" size={40} aria-hidden />
        <h1 className="mt-4 text-3xl font-bold">Grazie, il report e in arrivo</h1>
        <p className="mt-3 leading-7 text-muted">
          Controlla la tua casella email. Se hai richiesto un ricontatto, useremo i dati indicati per proporti il percorso piu adatto.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Torna alla landing</Link>
        </Button>
      </Panel>
    </main>
  );
}
