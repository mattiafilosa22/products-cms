# Products CMS

Monorepo npm workspaces: l'app Next.js gira in locale, mentre database PostgreSQL e
backend Express girano in Docker.

## Struttura del repo

```text
products-cms/
├─ apps/
│  └─ web/            # app Next.js (frontend)
├─ packages/
│  └─ mama/           # UI library condivisa (build tsup)
├─ backend/           # API Express + Prisma (migra dentro apps/web col Pezzo 5)
├─ postman/           # collection e environment per testare le API
└─ docker-compose.yml # PostgreSQL + backend
```

## Requisiti Preliminari

Prima di avviare, configurare le variabili d'ambiente:

1. Entrare nella cartella `/backend` e rinominare `.env.example` in `.env`
2. Fare lo stesso nella cartella `/apps/web`

## Come avviare l'applicazione (sviluppo)

Dalla root del progetto:

```bash
docker compose up -d   # avvia database e backend (porta 3008)
npm install            # installa i workspace
npm run dev:web        # avvia l'app Next.js su http://localhost:3000
```

## Comandi di qualità

Dalla root del progetto:

```bash
npm run typecheck             # type check su tutti i workspace
npm run lint                  # eslint sull'intero monorepo
npm run format:check          # prettier --check
npm run build --workspace mama  # build della UI library
```

## Dati di Test (Seeding)

Anche se la traccia prevede l'inserimento prodotti esclusivamente tramite CSV, ho incluso uno script di **seeding** per facilitare una valutazione immediata della tabella e della UI senza dover caricare file manualmente.

Per popolare il database con dati di test:

1. Assicurarsi che i container siano attivi.
2. Eseguire nel terminale:
   ```bash
   docker compose exec backend npx prisma db seed

   ```

## Testing con Postman

Nella cartella `/postman` sono presenti la Collection e l'Environment per testare le API.

1. Importa i file su Postman.
2. Seleziona l'environment `ProductCMS`.
3. Le richieste includono già l'header `x-api-key` configurato tramite variabile.

> **Nota**: Assicurati che i container siano attivi (`docker compose up -d`) prima di inviare le richieste.

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

Se non si dispone di Docker, seguire questi passaggi:

### Database: Assicurarsi di avere un'istanza PostgreSQL attiva.

### Backend

```bash
cd backend
```

```bash
npm install
```

```bash
npx prisma generate
```

```bash
npm run dev
```

### App web

Dalla root del progetto:

```bash
npm install
```

```bash
npm run dev:web
```
