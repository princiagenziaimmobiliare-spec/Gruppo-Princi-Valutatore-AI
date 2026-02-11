# Valutazione Gratuita – Gruppo PRINCI

Applicazione Next.js per generare valutazioni immobiliari automatiche nella provincia di Gorizia (GO), con invio lead email, area admin e gestione parametri.

## Stack
- Next.js App Router + TypeScript + Tailwind
- Prisma ORM
- SQLite in sviluppo (`DATABASE_URL=file:./dev.db`)
- SMTP via Nodemailer

## Avvio locale
1. Copia `.env.example` in `.env` e configura variabili.
2. Installa dipendenze: `npm install`
3. Genera client Prisma: `npm run prisma:generate`
4. Migra DB: `npm run prisma:migrate -- --name init`
5. Seed iniziale: `npm run prisma:seed`
6. Avvia: `npm run dev`

## Funzionalità principali
- Wizard `/valutazione` a 3 step con consensi obbligatori e honeypot anti-bot.
- Endpoint `/api/valuation` con validazione Zod, rate limit e salvataggio richieste.
- Calcolo automatico con coefficienti e fallback prezzo provincia.
- Email utente + email agenzia con riepilogo lead.
- Admin:
  - `/admin/localita`: CRUD località/zone e prezzi €/mq
  - `/admin/parametri`: range, fallback, contatti, coefficienti editabili
  - `/admin/richieste`: filtri e export CSV

## Deploy
- Deploy consigliato su Vercel o Node server.
- Configura DB gestito in produzione (PostgreSQL) aggiornando `DATABASE_URL` e il provider Prisma.
- Imposta variabili SMTP e credenziali admin.

## Note compliance
- Salvataggio consensi con timestamp nel DB.
- Placeholder disponibili: `/privacy` e `/cookies`.
- Disclaimer valutazione presente in pagina grazie ed email.
