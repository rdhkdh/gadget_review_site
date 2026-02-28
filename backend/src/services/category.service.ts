import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}
