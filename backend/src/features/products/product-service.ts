import prisma from "../../lib/prisma.ts";
import { Prisma } from "@prisma/client";

export const findAllProducts = async (page: number, limit: number, search: string) => {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count()
  ]);
  return { products, total };
};

export const findProductById = (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};

export const createNewProduct = (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({ data });
};

export const updateExistingProduct = (id: number, data: Prisma.ProductUpdateInput) => {
  return prisma.product.update({ where: { id }, data });
};

export const removeProduct = (id: number) => {
  return prisma.product.delete({ where: { id } });
};

export const bulkCreateProducts = (data: any[]) => {
  return prisma.product.createMany({ 
    data, 
    skipDuplicates: true 
  });
};