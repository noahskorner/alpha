import { PrismaClient } from 'database';

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
