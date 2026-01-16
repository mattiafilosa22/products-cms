import express from "express";
import prisma from "./core/config/prisma.js";
import productsRoutes from "./api/products/products-routes.js";

const app = express();
const PORT = 3008;

async function bootstrap() {
  try {
    console.log("⏳ Connessione al database in corso...");
    await prisma.$connect();
    console.log("✅ Database connesso correttamente!");

    app.get("/", (req, res) => {
      res.json({
        status: "success",
        message: "Ecommerce Backend API is running",
        database: "connected"
      });
    });

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