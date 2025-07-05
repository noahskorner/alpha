import { PrismaClient } from 'database';

export const PRISMA = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
