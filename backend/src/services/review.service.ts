import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function getReviewsByUser(userId: number) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      gadget: {
        select: { id: true, name: true, model: true, brand: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getReviewsByGadget(gadgetId: number) {
  return prisma.review.findMany({
    where: { gadgetId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createReview(gadgetId: number, userId: number, rating: number, comment?: string) {
  if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
  const review = await prisma.review.create({
    data: { gadgetId, userId, rating, comment },
    include: { user: { select: { id: true, name: true } } },
  });
  await recalcGadgetRating(gadgetId);
  return review;
}

export async function updateReview(reviewId: number, userId: number, rating?: number, comment?: string) {
  const existing = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!existing) throw new Error('Review not found or unauthorized');
  if (rating != null && (rating < 1 || rating > 5)) throw new Error('Rating must be between 1 and 5');
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { rating, comment },
    include: { user: { select: { id: true, name: true } } },
  });
  await recalcGadgetRating(existing.gadgetId);
  return review;
}

export async function deleteReview(reviewId: number, userId: number) {
  const existing = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!existing) throw new Error('Review not found or unauthorized');
  await prisma.review.delete({ where: { id: reviewId } });
  await recalcGadgetRating(existing.gadgetId);
}

async function recalcGadgetRating(gadgetId: number) {
  const agg = await prisma.review.aggregate({
    where: { gadgetId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.gadget.update({
    where: { id: gadgetId },
    data: {
      averageRating: agg._avg.rating ? new Prisma.Decimal(agg._avg.rating) : new Prisma.Decimal(0),
      reviewCount: agg._count,
    },
  });
}
