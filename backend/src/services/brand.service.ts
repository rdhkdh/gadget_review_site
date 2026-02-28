import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createBrand(name: string) {
  return prisma.brand.create({ data: { name } });
}

export async function getAllBrands(categoryId?: number) {
  if (categoryId) {
    const gadgets = await prisma.gadget.findMany({
      where: { categoryId },
      select: { brandId: true },
      distinct: ['brandId'],
    });
    const brandIds = gadgets.map((g) => g.brandId);
    return prisma.brand.findMany({
      where: { id: { in: brandIds } },
      orderBy: { name: 'asc' },
    });
  }
  return prisma.brand.findMany({ orderBy: { name: 'asc' } });
}
