import { Prisma } from "@prisma/client";
import prisma from "../../../core/config/prisma.ts";

export const bulkCreateProducts = async (products: Prisma.ProductCreateManyInput[]) => {
  if (!products || products.length === 0) {
    throw new Error("No products provided");
  }

  try {
    const result = await prisma.product.createMany({ 
      data: products,
      skipDuplicates: true 
    });
    return result;
  } catch (error) {
    console.error("❌ Errore nel bulkCreate:", error);
    throw error;
  }
}