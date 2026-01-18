// backend/src/api/products/products.routes.ts
import { Router } from "express";
import * as ProductController from "../../features/products/product-controller.js";
import { authMiddleware } from "../middlewares/auth.ts";
import multer from "multer";

const router = Router();

// where to save the uploaded file
const upload = multer({ dest: 'uploads/' });

// routes without middleware
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// routes with middleware
router.post("/", authMiddleware, ProductController.createProduct);
router.put("/:id", authMiddleware, ProductController.updateProduct);
router.delete("/:id", authMiddleware, ProductController.deleteProduct);
router.post("/import", authMiddleware, upload.single('file'), ProductController.importProductsFromCsv);

export default router;