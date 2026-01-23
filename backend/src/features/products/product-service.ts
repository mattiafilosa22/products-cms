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
    prisma.product.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
    })
  ]);
  return { products, total };
};

export const findProductById = async (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};

export const createNewProduct = async (data: any) => {
  return prisma.product.create({ data });
};

export const updateExistingProduct = async (id: number, data: any) => {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    throw error;
  }
};

export const removeProduct = async (id: number) => {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    throw error;
  }
};

export const bulkCreateProducts = async (data: any[]) => {
  return prisma.product.createMany({
    data,
    skipDuplicates: true
  });
};