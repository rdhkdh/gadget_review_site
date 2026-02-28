import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Phones' }, create: { name: 'Phones' }, update: {} }),
    prisma.category.upsert({ where: { name: 'Laptops' }, create: { name: 'Laptops' }, update: {} }),
    prisma.category.upsert({ where: { name: 'Headphones' }, create: { name: 'Headphones' }, update: {} }),
  ]);

  const brands = await Promise.all([
    prisma.brand.upsert({ where: { name: 'Apple' }, create: { name: 'Apple' }, update: {} }),
    prisma.brand.upsert({ where: { name: 'Samsung' }, create: { name: 'Samsung' }, update: {} }),
    prisma.brand.upsert({ where: { name: 'Google' }, create: { name: 'Google' }, update: {} }),
    prisma.brand.upsert({ where: { name: 'Dell' }, create: { name: 'Dell' }, update: {} }),
    prisma.brand.upsert({ where: { name: 'Sony' }, create: { name: 'Sony' }, update: {} }),
    prisma.brand.upsert({ where: { name: 'Bose' }, create: { name: 'Bose' }, update: {} }),
  ]);

  const phoneCat = categories.find((c) => c.name === 'Phones')!;
  const laptopCat = categories.find((c) => c.name === 'Laptops')!;
  const headphoneCat = categories.find((c) => c.name === 'Headphones')!;
  const apple = brands.find((b) => b.name === 'Apple')!;
  const samsung = brands.find((b) => b.name === 'Samsung')!;
  const google = brands.find((b) => b.name === 'Google')!;
  const dell = brands.find((b) => b.name === 'Dell')!;
  const sony = brands.find((b) => b.name === 'Sony')!;
  const bose = brands.find((b) => b.name === 'Bose')!;

  const gadgets = [
    {
      name: 'iPhone 15 Pro',
      brandId: apple.id,
      categoryId: phoneCat.id,
      model: 'A3108',
      price: 999,
      description: 'Titanium design, A17 Pro chip, Pro camera system.',
      performanceSpecs: { display: '6.1" Super Retina XDR', storage: '128GB-1TB', battery: 'Up to 23h video' },
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      averageRating: 4.7,
      reviewCount: 42,
    },
    {
      name: 'Samsung Galaxy S24',
      brandId: samsung.id,
      categoryId: phoneCat.id,
      model: 'SM-S921B',
      price: 849,
      description: 'AI-powered Galaxy with stunning display.',
      performanceSpecs: { display: '6.2" Dynamic AMOLED', storage: '128GB-256GB', battery: '4000mAh' },
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      averageRating: 4.5,
      reviewCount: 28,
    },
    {
      name: 'Google Pixel 8',
      brandId: google.id,
      categoryId: phoneCat.id,
      model: 'G9BQD',
      price: 699,
      description: 'Best-in-class camera and Tensor G3.',
      performanceSpecs: { display: '6.2" OLED', storage: '128GB-256GB', battery: '4575mAh' },
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      averageRating: 4.4,
      reviewCount: 19,
    },
    {
      name: 'MacBook Pro 14"',
      brandId: apple.id,
      categoryId: laptopCat.id,
      model: 'M3 Pro',
      price: 1999,
      description: 'M3 Pro chip, Liquid Retina XDR display.',
      performanceSpecs: { cpu: 'M3 Pro', ram: '18GB', storage: '512GB SSD', display: '14.2"' },
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      averageRating: 4.8,
      reviewCount: 56,
    },
    {
      name: 'Dell XPS 15',
      brandId: dell.id,
      categoryId: laptopCat.id,
      model: 'XPS 9530',
      price: 1499,
      description: 'Premium Windows laptop with OLED option.',
      performanceSpecs: { cpu: 'Intel i7-13700H', ram: '16GB', storage: '512GB NVMe', display: '15.6"' },
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      averageRating: 4.5,
      reviewCount: 34,
    },
    {
      name: 'Sony WH-1000XM5',
      brandId: sony.id,
      categoryId: headphoneCat.id,
      model: 'WH-1000XM5',
      price: 349,
      description: 'Industry-leading noise cancellation.',
      performanceSpecs: { driver: '30mm', anc: 'Yes', battery: '30h', wireless: 'Bluetooth 5.2' },
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-4f9eb7eebff7?w=400',
      averageRating: 4.7,
      reviewCount: 89,
    },
    {
      name: 'Bose QuietComfort Ultra',
      brandId: bose.id,
      categoryId: headphoneCat.id,
      model: 'QC Ultra',
      price: 429,
      description: 'Premium comfort and immersive audio.',
      performanceSpecs: { driver: 'Custom', anc: 'Yes', battery: '24h', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      averageRating: 4.6,
      reviewCount: 45,
    },
  ];

  const existingCount = await prisma.gadget.count();
  if (existingCount === 0) {
    await prisma.gadget.createMany({
      data: gadgets.map((g) => ({
        name: g.name,
        brandId: g.brandId,
        categoryId: g.categoryId,
        model: g.model,
        price: g.price,
        description: g.description,
        performanceSpecs: g.performanceSpecs,
        imageUrl: g.imageUrl,
        averageRating: g.averageRating,
        reviewCount: g.reviewCount,
      })),
    });
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gadgetreview.com' },
    create: { name: 'Demo User', email: 'demo@gadgetreview.com', passwordHash },
    update: {},
  });

  const g1 = await prisma.gadget.findFirst();
  if (g1 && (await prisma.review.count()) === 0) {
    await prisma.review.create({
      data: {
        gadgetId: g1.id,
        userId: demoUser.id,
        rating: 5,
        comment: 'Excellent product! Highly recommend.',
      },
    });
    const agg = await prisma.review.aggregate({
      where: { gadgetId: g1.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.gadget.update({
      where: { id: g1.id },
      data: {
        averageRating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
