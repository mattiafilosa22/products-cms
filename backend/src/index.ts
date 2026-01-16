import express from "express";
import prisma from "./core/config/prisma";

const app = express();
const PORT = 3008;

async function bootstrap() {
  try {
    console.log("⏳ Connessione al database in corso...");
    // Togliamo il commento, ma con un timeout di Prisma
    await prisma.$connect();
    console.log("✅ Database connesso correttamente!");

    app.get("/", (req, res) => {
      res.json({
        status: "success",
        message: "Ecommerce Backend API is running",
        database: "connected"
      });
    });

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server pronto su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Errore durante l'avvio:");
    console.error(error); // Questo ci dirà l'errore esatto (es. password sbagliata)
    process.exit(1);
  }
}

bootstrap();