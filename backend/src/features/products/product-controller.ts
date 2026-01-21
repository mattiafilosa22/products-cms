import { Request, Response } from "express";
import prisma from "../../core/config/prisma.js";
import fs from "fs";
import { createProductSchema, updateProductSchema } from "./product.schema.js";
import { parseProductsFromCsv } from "./services/csv-service.ts";
import { bulkCreateProducts } from "./services/product-service.ts";
import { Prisma } from "@prisma/client";

export const getProductById = async (req: Request, res: Response) => {
  try {
    // get product id
    const { id } = req.params;

    // check if id is not null
    if (!id) {
      return res.status(400).json({ success: false, error: "Missing product id" });
    }

    // get product from database
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    // return product
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Cannot find product with id" });
    }
    console.error("Error during product retrieval:");
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// TODO: add ZOD validation for page and limit
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // extract page and limit from request
    const { page = 1, limit = 10 } = req.query as { page: string, limit: string };

    // get all products from database
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count()
    ]);

    // return all products
    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total
      }
    });
  } catch (error) {
    console.error("Error during product retrieval:");
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    // get data from request body
    const validation = createProductSchema.safeParse(req.body);

    // if fail return error
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.format()
      });
    }

    // create product in db
    const product = await prisma.product.create({
      data: validation.data as Prisma.ProductCreateInput
    });

    // return product
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error during product creation:");
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    // get product id
    const { id } = req.params;

    const validation = updateProductSchema.safeParse(req.body);

    // if fail return error
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.format()
      });
    }
    // update product in db
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: validation.data
    });

    // return product
    return res.status(200).json({ success: true, data: product });
  } catch (error: any) {

    // check error code P2025 for product not found
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Cannot update: product not found" });
    }
    console.error("Error during product update:");
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // check if id is not null
    if (!id) {
      return res.status(400).json({ success: false, error: "Missing product id" });
    }

    const product = await prisma.product.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    // check error code P2025 for product not found
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Cannot delete: product not found" });
    }
    console.error("Error during product deletion:");
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const importProductsFromCsv = async (req: Request, res: Response) => {
  // check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, error: "Nessun file CSV caricato" });
  }
  // get file path
  const filePath = req.file.path;

  try {
    // parse data
    const data = await parseProductsFromCsv(filePath);

    // create products in db
    const result = await bulkCreateProducts(data);

    // return result
    return res.status(201).json({
      success: true,
      message: "Importato!",
      count: result.count
    });
  } catch (error: any) {

    return res.status(500).json({
      success: false,
      error: error.message || "Errore senza messaggio",
      stack: error.stack 
    });
  } finally {
    // delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}