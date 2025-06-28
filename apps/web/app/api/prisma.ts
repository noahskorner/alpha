import { PrismaClient } from 'database';

export const prismaClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
