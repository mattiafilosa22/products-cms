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

## Come fermare l'applicazione
Dalla root del progetto, eseguire il comando:

```bash
docker compose down
```

Se non si dispone di Docker, seguire questi passaggi:

### Database: Assicurarsi di avere un'istanza PostgreSQL attiva.

### Backend:

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

### Frontend:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev