import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface GadgetFilters {
  categoryId?: number;
  brandId?: number;
  minRating?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';
}

export async function getGadgets(filters: GadgetFilters) {
  const where: Prisma.GadgetWhereInput = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.minRating != null) where.averageRating = { gte: filters.minRating };
  if (filters.search?.trim()) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { model: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.GadgetOrderByWithRelationInput[] = [];
  if (filters.sortBy === 'price_asc') orderBy.push({ price: 'asc' });
  else if (filters.sortBy === 'price_desc') orderBy.push({ price: 'desc' });
  else if (filters.sortBy === 'rating_asc') orderBy.push({ averageRating: 'asc' });
  else if (filters.sortBy === 'rating_desc') orderBy.push({ averageRating: 'desc' });

  const gadgets = await prisma.gadget.findMany({
    where,
    orderBy: orderBy.length ? orderBy : undefined,
    include: { brand: true, category: true },
  });
  return gadgets;
}

export async function getGadgetById(id: number) {
  const gadget = await prisma.gadget.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      reviews: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
  return gadget;
}

export async function createGadget(data: {
  name: string;
  brandId: number;
  categoryId: number;
  model: string;
  price: number;
  description?: string;
  performanceSpecs?: Record<string, unknown>;
  imageUrl?: string;
}) {
  return prisma.gadget.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
      averageRating: new Prisma.Decimal(0),
    },
    include: { brand: true, category: true },
  });
}

export async function updateGadget(id: number, data: Partial<{
  name: string;
  brandId: number;
  categoryId: number;
  model: string;
  price: number;
  description: string;
  performanceSpecs: Record<string, unknown>;
  imageUrl: string;
}>) {
  const updateData: Prisma.GadgetUpdateInput = { ...data };
  if (data.price != null) updateData.price = new Prisma.Decimal(data.price);
  return prisma.gadget.update({
    where: { id },
    data: updateData,
    include: { brand: true, category: true },
  });
}

export async function deleteGadget(id: number) {
  return prisma.gadget.delete({ where: { id } });
}
