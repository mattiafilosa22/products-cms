// src/api/routes.ts
import { Router } from "express";
import productRoutes from "../features/products/products-routes.ts";

const router = Router();
router.use("/products", productRoutes);

export default router;