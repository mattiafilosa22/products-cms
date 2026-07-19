import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.ts";
import apiRoutes from "./api/routes.ts";

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware globali
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  }),
);
app.use(express.json());

// Punto di ingresso unico per le API
app.use("/api", apiRoutes);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("✅ Database connesso correttamente!");

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server pronto su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Errore durante l'avvio:", error);
    process.exit(1);
  }
}

bootstrap();
