# Products CMS

Questo progetto è interamente containerizzato con Docker. Seguire i passaggi indicati per l'avvio.

## Requisiti Preliminari
Prima di avviare i container, è necessario configurare le variabili d'ambiente:
1. Entrare nella cartella `/backend` e rinominare `.env.example` in `.env`
2. Fare lo stesso nella cartella `/frontend`

## Come avviare l'applicazione
Dalla root del progetto, eseguire il comando:

```bash
docker compose up --build
```

## Dati di Test (Seeding)
Anche se la traccia prevede l'inserimento prodotti esclusivamente tramite CSV, ho incluso uno script di **seeding** per facilitare una valutazione immediata della tabella e della UI senza dover caricare file manualmente.

Per popolare il database con dati di test:
1. Assicurarsi che i container siano attivi.
2. Eseguire nel terminale:
   ```bash
   docker compose exec backend npx prisma db seed


##  Testing con Postman

Nella cartella `/postman` sono presenti la Collection e l'Environment per testare le API.
1. Importa i file su Postman.
2. Seleziona l'environment `Products_Dev`.
3. Le richieste includono già l'header `x-api-key` configurato tramite variabile.

> **Nota**: Assicurati che i container siano attivi (`docker compose up`) prima di inviare le richieste.

##  Testing Importazione CSV

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
Dalla root del progetto, eseguire il comando:

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

### Frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev