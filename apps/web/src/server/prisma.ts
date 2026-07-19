import { PrismaClient } from "@prisma/client";

// Next's dev server hot-reloads modules: without this globalThis guard every
// reload would create a new PrismaClient and exhaust the connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
