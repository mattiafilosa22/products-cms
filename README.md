# Products CMS

Monorepo npm workspaces: un'unica applicazione full-stack Next.js (frontend + API REST
come Route Handlers) con PostgreSQL in Docker.

## Struttura del repo

```text
products-cms/
├─ apps/
│  └─ web/            # app Next.js full-stack (UI + Route Handlers in src/app/api)
│     ├─ prisma/      # schema, seed
│     └─ src/server/  # codice solo-server: prisma, auth, service prodotti, csv
├─ packages/
│  └─ mama/           # UI library condivisa (build tsup)
├─ postman/           # collection e environment per testare le API
└─ docker-compose.yml # solo PostgreSQL
```

## Requisiti Preliminari

Prima di avviare, configurare le variabili d'ambiente: entrare nella cartella
`/apps/web` e rinominare `.env.example` in `.env`.

## Come avviare l'applicazione (sviluppo)

Dalla root del progetto:

```bash
docker compose up -d   # avvia PostgreSQL
npm install            # installa i workspace
npm run db:push        # allinea lo schema del database
npm run dev:web        # avvia l'app su http://localhost:3000 (API su /api)
```

## Comandi di qualità

Dalla root del progetto:

```bash
npm run typecheck             # type check su tutti i workspace
npm run lint                  # eslint sull'intero monorepo
npm run format:check          # prettier --check
npm run test                  # vitest (package mama e app web)
npm run build --workspace mama  # build della UI library
npm run build --workspace web    # build dell'app Next.js
```

## Dati di Test (Seeding)

Anche se la traccia prevede l'inserimento prodotti esclusivamente tramite CSV, ho incluso uno script di **seeding** per facilitare una valutazione immediata della tabella e della UI senza dover caricare file manualmente.

Per popolare il database con dati di test, con il database attivo:

```bash
npm run seed
```

## Testing con Postman

Nella cartella `/postman` sono presenti la Collection e l'Environment per testare le API.

1. Importa i file su Postman.
2. Seleziona l'environment `ProductCMS` e imposta `BASE_URL` a `http://localhost:3000/api`.

> **Nota**: l'app deve essere attiva (`npm run dev:web`) prima di inviare le richieste.

## Testing Importazione CSV

Nella cartella `/test-file` sono presenti dei file csv per testare l'importazione.
Provare da interfaccia web a caricare il file e vedere se vengono creati i prodotti.

- 1 file contiene dati validi
- 1 file contiene righe con dati obbligatori vuoti
- 1 file contiene righe con errori dovuti a valori non validi

## Formato CSV per l'importazione

Il file CSV deve contenere le seguenti colonne:

- `name`: Nome del prodotto (obbligatorio, max 20 caratteri)
- `description`: Descrizione del prodotto (opzionale, max 200 caratteri)
- `price`: Prezzo originale (obbligatorio, numero positivo)
- `discountPrice`: Prezzo scontato (opzionale, numero positivo, deve essere inferiore a `price`)

Esempio:

```csv
name,description,price,discountPrice
Laptop,Potente laptop professionale,1200,999
Mouse,Mouse wireless ergonomico,25,
```

## Note di Design

- **Creazione Manuale**: Sebbene il requisito principale sia l'importazione CSV, ho implementato anche la creazione manuale per offrire una gestione completa delle risorse (CRUD)

## Come fermare l'applicazione

Fermare il dev server con `Ctrl+C`, poi dalla root del progetto:

```bash
docker compose down
```

Se non si dispone di Docker: assicurarsi di avere un'istanza PostgreSQL attiva e
aggiornare `DATABASE_URL` in `apps/web/.env`, poi seguire gli stessi comandi npm.
