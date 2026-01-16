// backend/src/api/products/products.routes.ts
import { Router } from "express";
import * as ProductController from "../../features/products/product-controller.js";

const router = Router();

// L'URL finale sarà: http://localhost:3008/api/products/
router.get("/", ProductController.getAllProducts);
router.post("/", ProductController.createProduct);

// L'URL finale sarà: http://localhost:3008/api/products/:id
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;