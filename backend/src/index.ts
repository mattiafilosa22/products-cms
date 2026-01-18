import express from "express";
import prisma from "./core/config/prisma.js";
import productsRoutes from "./api/products/products-routes.ts";
import cors from 'cors';

const app = express();
const PORT = 3008;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json());

async function bootstrap() {
  try {
    console.log("⏳ Connessione al database in corso...");
    await prisma.$connect();
    console.log("✅ Database connesso correttamente!");

    app.use("/api/products", productsRoutes);

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server pronto su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Errore durante l'avvio:");
    console.error(error);
    process.exit(1);
  }
}

bootstrap();