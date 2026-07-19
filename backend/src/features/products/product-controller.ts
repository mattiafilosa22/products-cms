import { Request, Response } from "express";
import * as productService from "./product-service.ts";
import { createProductSchema, updateProductSchema } from "./product.schema.ts";
import fs from "fs";
import { parseProductsFromCsv } from "../../shared/utils/csv-parser.ts";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const { products, total } = await productService.findAllProducts(
      page,
      limit,
      search,
    );

    return res.status(200).json({
      success: true,
      data: products,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Errore interno del server" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ success: false, error: "ID non valido" });

    const validation = updateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, errors: validation.error.format() });
    }

    const product = await productService.updateExistingProduct(
      id,
      validation.data,
    );
    return res.status(200).json({ success: true, data: product });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: backend replaced by Route Handlers (Piece 5)
  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, error: "Prodotto non trovato" });
    }
    return res
      .status(500)
      .json({ success: false, error: "Errore durante l'aggiornamento" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ success: false, error: "ID non valido" });

    const product = await productService.findProductById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, error: "Prodotto non trovato" });

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Errore interno" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validation = createProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, errors: validation.error.format() });
    }

    const product = await productService.createNewProduct(validation.data);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Errore durante la creazione" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ success: false, error: "ID non valido" });

    await productService.removeProduct(id);
    return res
      .status(200)
      .json({ success: true, message: "Eliminato correttamente" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: backend replaced by Route Handlers (Piece 5)
  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, error: "Prodotto non trovato" });
    }
    return res
      .status(500)
      .json({ success: false, error: "Errore durante l'eliminazione" });
  }
};

export const importProductsFromCsv = async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: "File mancante" });
  const filePath = req.file.path;

  try {
    const data = await parseProductsFromCsv(filePath);
    if (!data)
      return res.status(400).json({ success: false, error: "File non valido" });

    const result = await productService.bulkCreateProducts(data);
    return res.status(201).json({ success: true, count: result.count });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: backend replaced by Route Handlers (Piece 5)
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};
