import { Request, Response } from "express";
import prisma from "../../core/config/prisma.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";

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
      data: validation.data
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
      where: { id },
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

    const product = await prisma.product.delete({
      where: { id }
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