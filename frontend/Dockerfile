FROM node:22-alpine

WORKDIR /app

# Installiamo le dipendenze prima per sfruttare la cache di Docker
COPY package*.json ./
RUN npm install

# Copiamo il resto del codice
COPY . .

# Next.js usa la porta 3000 di default
EXPOSE 3000

CMD ["npm", "run", "dev"]