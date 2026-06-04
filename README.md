# AI Act Readiness Check

Web app lead generation in italiano per aziende, PMI, studi professionali e liberi professionisti che vogliono valutare il proprio livello di preparazione rispetto all'AI Act.

## Funzionalita

- Landing page del test con CTA e disclaimer.
- Questionario multi-step mobile-first con barra di progresso.
- Mini-esito immediato visibile senza email.
- Lead capture obbligatoria prima del report completo.
- Report web completo con punteggio, criticita, azioni, documenti mancanti e CTA.
- API interna per validare, salvare lead e assessment, inviare email al lead e notifica interna.
- Scoring 0-100 con flag rischio, incertezza, privacy, trasparenza e usi ad alto rischio.
- Schema SQL Supabase compatibile.
- Rate limiting in-memory, honeypot e controllo invio troppo rapido.
- Eventi analytics client-side.

## Installazione

```bash
npm install
npm run dev
```

Apri `http://localhost:3000`.

## Variabili ambiente

Copia `.env.example` in `.env.local` e compila i valori necessari.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=AI Act Readiness <noreply@example.com>
ADMIN_EMAIL=
KIT_BASE_URL=
CONSULTATION_URL=
COMPLIANCE_URL=
```

Senza `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, l'API restituisce un id locale e non persiste sul database. Senza `RESEND_API_KEY`, l'API completa il flusso ma segnala che l'email non e stata inviata.

## Database

Esegui lo schema in `supabase/schema.sql` dal SQL editor di Supabase. Le tabelle create sono:

- `leads`
- `assessments`

Il backend usa la service role key lato server. Non esporre mai `SUPABASE_SERVICE_ROLE_KEY` nel client.

## Flusso

1. L'utente entra dalla landing.
2. Compila le 5 sezioni del questionario.
3. Vede un mini-esito con punteggio, fascia, 2 criticita e 2 azioni.
4. Inserisce i dati e accetta il consenso privacy.
5. L'API ricalcola lo scoring lato server, salva lead e assessment, invia email.
6. L'utente vede il report completo.

## Email

Oggetto lead: `Il tuo report AI Act Readiness e pronto`.

Contiene saluto personalizzato, punteggio, categoria, sintesi, aree critiche, azioni consigliate, link Kit Base e link consulenza, piu disclaimer.

La notifica admin include dati lead, punteggio, categoria, flag rischio, servizio consigliato e risposte complete.

## Analytics

Gli eventi sono dispatchati come `CustomEvent` sul browser:

- `assessment_started`
- `assessment_step_completed`
- `lead_form_viewed`
- `lead_submitted`
- `report_viewed`
- `cta_kit_clicked`
- `cta_consultation_clicked`

Puoi intercettarli con GTM, Plausible, PostHog o altro provider.

## Deploy su Vercel

1. Importa il repository su Vercel.
2. Imposta le variabili ambiente in Project Settings.
3. Esegui lo schema SQL su Supabase.
4. Configura il dominio mittente su Resend.
5. Deploy.

## Esempio test

Trovi un set di risposte in `seed/example-assessment.json`. Puoi usarlo per provare rapidamente il flusso dal questionario.

## Nota compliance

Il test ha finalita informative e non costituisce consulenza legale. Non richiede dati sensibili e salva solo dati necessari a generare il report e gestire il lead.
