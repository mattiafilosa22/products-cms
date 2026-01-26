// backend/src/api/products/products.routes.ts
import { Router } from "express";
import * as ProductController from "./product-controller.ts";
import { authMiddleware } from "../../api/middlewares/auth.ts";
import multer from "multer";

const router = Router();

// where to save the uploaded file
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('FORMATO_FILE_NON_VALIDO'));
    }
  }
});

// routes without middleware
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// routes with middleware
router.post("/", authMiddleware, ProductController.createProduct);
router.put("/:id", authMiddleware, ProductController.updateProduct);
router.delete("/:id", authMiddleware, ProductController.deleteProduct);

router.post("/import", authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.message === 'FORMATO_FILE_NON_VALIDO') {
        return res.status(400).json({ success: false, error: "Il file deve essere in formato CSV (.csv)" });
      }
      return res.status(500).json({ success: false, error: "Errore durante il caricamento del file" });
    }
    next();
  });
}, ProductController.importProductsFromCsv);

export default router;