FROM node:22-alpine

# 1. Installiamo le dipendenze necessarie (aggiungiamo anche python e build-base per sicurezza)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 2. Copiamo i file dei pacchetti
COPY package*.json ./

# 3. Installiamo le dipendenze (usiamo ci se hai il lock file, è più pulito)
RUN npm install

# 4. Copiamo la cartella prisma
COPY prisma ./prisma/

# 5. Generiamo il client FORZANDO il percorso e i motori
RUN npx prisma generate

# 6. Copiamo il resto
COPY . .

EXPOSE 3008

CMD ["npm", "run", "dev"]