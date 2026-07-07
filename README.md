# AI Act Readiness Check

Web app lead generation in italiano per aziende, PMI, studi professionali e liberi professionisti che vogliono valutare il proprio livello di preparazione rispetto all'AI Act.

## Funzionalita

- Landing page del test con CTA e disclaimer.
- Questionario multi-step mobile-first con barra di progresso.
- Mini-esito immediato visibile senza email.
- Lead capture obbligatoria prima del report completo.
- Report web completo con punteggio, criticita, azioni, documenti mancanti e CTA.
- API interna per validare, salvare lead e assessment, inviare email report al lead con copia nascosta interna.
- Sincronizzazione di tutti i lead nel gruppo MailerLite `Report`.
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
NEXT_PUBLIC_META_PIXEL_ID=4665704080374942
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SENDER_SMTP_HOST=smtp.sender.net
SENDER_SMTP_PORT=587
SENDER_SMTP_SECURE=false
SENDER_SMTP_USER=
SENDER_SMTP_PASSWORD=
SENDER_EMAIL_FROM=AI Act Readiness <info@fabiomoretti.com>
MAILERLITE_API_TOKEN=
MAILERLITE_REPORT_GROUP_NAME=Report
MAILERLITE_REPORT_GROUP_ID=
KIT_BASE_URL=
CONSULTATION_URL=
COMPLIANCE_URL=
AI_ACT_GUIDE_URL=https://drive.google.com/file/d/1NhdOz1VRX8yDaMCdRxvgnRTVdm2d7Uwq/view?usp=sharing
```

Senza `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, l'API restituisce un id locale e non persiste sul database. I valori placeholder come `INSERISCI_QUI...` vengono ignorati e non bloccano la visualizzazione del report.

### Sender SMTP

Sender gestisce tutto l'invio email:

- `SENDER_SMTP_HOST=smtp.sender.net`
- `SENDER_SMTP_PORT=587`
- `SENDER_SMTP_SECURE=false`, per usare TLS sulla porta 587
- `SENDER_SMTP_USER` e `SENDER_SMTP_PASSWORD` generati nell'account Sender
- `SENDER_EMAIL_FROM=AI Act Readiness <info@fabiomoretti.com>`

Il report viene inviato all'indirizzo inserito nel form e la stessa email mette `morettifabio70@gmail.com` in copia nascosta. Se il compilatore usa gia la stessa Gmail, la copia nascosta viene omessa per evitare duplicati.

### MailerLite

Imposta `MAILERLITE_API_TOKEN` con un token API server-side. A ogni richiesta di report, il backend crea o aggiorna il contatto e lo inserisce nel gruppo `Report`, creato automaticamente se non esiste. `MAILERLITE_REPORT_GROUP_ID` e opzionale, ma evita una richiesta di ricerca del gruppo a ogni avvio serverless.

MailerLite riceve solo nome, cognome, email, azienda/studio, ruolo, punteggio, valore AI Act, consenso marketing, richiesta di ricontatto e data del test. Tutti i contatti vengono sincronizzati; usa il campo `Consenso marketing AI Act` per escludere dalle campagne chi non ha prestato il consenso.

Il campo `Valore AI Act` viene impostato automaticamente su `Alto` per punteggi da 70 a 100, `Medio` per punteggi da 40 a 69 e `Basso` per punteggi inferiori a 40.

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
5. L'API ricalcola lo scoring lato server, salva lead e assessment, sincronizza MailerLite e invia email.
6. L'utente vede il report completo.

## Email

Oggetto lead: `Il tuo report AI Act Readiness e pronto`.

Contiene saluto personalizzato, dati completi del compilatore, punteggio, categoria, sintesi, flag rischio, criticita complete, documenti mancanti, tutte le azioni consigliate, link alla Guida Pratica gratuita "AI Act 2026: cosa fare adesso", link Kit Base e link consulenza, piu disclaimer. Sender invia il report direttamente all'indirizzo inserito nel form e aggiunge `morettifabio70@gmail.com` in BCC.

## Analytics

Gli eventi sono dispatchati come `CustomEvent` sul browser:

- `assessment_started`
- `assessment_step_completed`
- `lead_form_viewed`
- `lead_submitted`
- `report_email_sent`
- `report_viewed`
- `cta_kit_clicked`
- `cta_consultation_clicked`

Puoi intercettarli con GTM, Plausible, PostHog o altro provider.

### Meta Ads

Il Pixel Meta predefinito e `4665704080374942`. Puoi sovrascriverlo impostando `NEXT_PUBLIC_META_PIXEL_ID`. L'app carica lo snippet ufficiale Meta Pixel, invia `PageView` e registra anche il fallback `noscript`.

- `AIActTestCompleted`, evento custom, quando l'utente termina il questionario e vede il mini-esito.
- `Lead`, evento standard Meta, solo dopo che l'API conferma l'invio del report via email.

Gli eventi Meta includono solo dati non personali come punteggio, categoria e valore AI Act. Non vengono inviati nome, email, azienda o ruolo.

## Deploy su Vercel

1. Importa il repository su Vercel.
2. Imposta le variabili ambiente in Project Settings.
3. Esegui lo schema SQL su Supabase.
4. Configura il dominio mittente su Sender.
5. Deploy.

## Esempio test

Trovi un set di risposte in `seed/example-assessment.json`. Puoi usarlo per provare rapidamente il flusso dal questionario.

## Nota compliance

Il test ha finalita informative e non costituisce consulenza legale. Non richiede dati sensibili e salva solo dati necessari a generare il report e gestire il lead.
