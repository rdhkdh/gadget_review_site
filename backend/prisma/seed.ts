import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Categories ──────────────────────────────────────────────────────────
  const [phoneCat, laptopCat, headphoneCat] = await Promise.all([
    prisma.category.upsert({ where: { name: 'Phones' }, create: { name: 'Phones' }, update: {} }),
    prisma.category.upsert({ where: { name: 'Laptops' }, create: { name: 'Laptops' }, update: {} }),
    prisma.category.upsert({ where: { name: 'Headphones' }, create: { name: 'Headphones' }, update: {} }),
  ]);

  // ── Brands ───────────────────────────────────────────────────────────────
  // Phones: Apple, Samsung, Google, OnePlus, Xiaomi
  // Laptops: Apple, Dell, Lenovo, HP, ASUS
  // Headphones: Sony, Bose, Sennheiser, JBL, Apple
  const brandNames = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Sony', 'Bose', 'Sennheiser', 'JBL'];
  const brandRecords = await Promise.all(
    brandNames.map((name) => prisma.brand.upsert({ where: { name }, create: { name }, update: {} }))
  );
  const brand = Object.fromEntries(brandRecords.map((b) => [b.name, b]));

  // ── Gadgets ──────────────────────────────────────────────────────────────
  const gadgets = [
    // ── Phones (12) ─────────────────────────────────────────────────────────
    {
      name: 'iPhone 15 Pro',
      brandId: brand.Apple.id, categoryId: phoneCat.id,
      model: 'A3108', price: 999,
      description: 'Titanium design, A17 Pro chip, Pro camera system with 5x optical zoom.',
      performanceSpecs: { display: '6.1" Super Retina XDR', storage: '128GB–1TB', battery: 'Up to 23h video', chip: 'A17 Pro' },
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      averageRating: 4.7, reviewCount: 42,
    },
    {
      name: 'iPhone 15',
      brandId: brand.Apple.id, categoryId: phoneCat.id,
      model: 'A3090', price: 799,
      description: 'USB-C, Dynamic Island, and a 48MP main camera at a friendlier price.',
      performanceSpecs: { display: '6.1" Super Retina XDR', storage: '128GB–512GB', battery: 'Up to 20h video', chip: 'A16 Bionic' },
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      averageRating: 4.5, reviewCount: 35,
    },
    {
      name: 'iPhone 14',
      brandId: brand.Apple.id, categoryId: phoneCat.id,
      model: 'A2882', price: 599,
      description: 'Crash Detection, Emergency SOS via satellite, great all-rounder.',
      performanceSpecs: { display: '6.1" Super Retina XDR', storage: '128GB–512GB', battery: 'Up to 20h video', chip: 'A15 Bionic' },
      imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
      averageRating: 4.3, reviewCount: 61,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brandId: brand.Samsung.id, categoryId: phoneCat.id,
      model: 'SM-S928B', price: 1299,
      description: 'Built-in S Pen, 200MP camera, titanium frame, Galaxy AI flagship.',
      performanceSpecs: { display: '6.8" QHD+ Dynamic AMOLED', storage: '256GB–1TB', battery: '5000mAh', chip: 'Snapdragon 8 Gen 3' },
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      averageRating: 4.8, reviewCount: 67,
    },
    {
      name: 'Samsung Galaxy S24',
      brandId: brand.Samsung.id, categoryId: phoneCat.id,
      model: 'SM-S921B', price: 849,
      description: 'AI-powered Galaxy with stunning display and Galaxy AI features.',
      performanceSpecs: { display: '6.2" Dynamic AMOLED', storage: '128GB–256GB', battery: '4000mAh', chip: 'Snapdragon 8 Gen 3' },
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      averageRating: 4.5, reviewCount: 28,
    },
    {
      name: 'Samsung Galaxy A55',
      brandId: brand.Samsung.id, categoryId: phoneCat.id,
      model: 'SM-A556B', price: 449,
      description: 'Stylish mid-ranger with Galaxy AI, IP67 rating, and bright AMOLED.',
      performanceSpecs: { display: '6.6" FHD+ Super AMOLED', storage: '128GB–256GB', battery: '5000mAh', chip: 'Exynos 1480' },
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
      averageRating: 4.2, reviewCount: 22,
    },
    {
      name: 'Google Pixel 8 Pro',
      brandId: brand.Google.id, categoryId: phoneCat.id,
      model: 'G1MNW', price: 999,
      description: 'Pro-level Tensor G3 camera phone with 7 years of OS updates.',
      performanceSpecs: { display: '6.7" LTPO OLED', storage: '128GB–1TB', battery: '5050mAh', chip: 'Tensor G3' },
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      averageRating: 4.6, reviewCount: 31,
    },
    {
      name: 'Google Pixel 8',
      brandId: brand.Google.id, categoryId: phoneCat.id,
      model: 'G9BQD', price: 699,
      description: 'Best-in-class camera and Tensor G3 for everyday AI tasks.',
      performanceSpecs: { display: '6.2" OLED', storage: '128GB–256GB', battery: '4575mAh', chip: 'Tensor G3' },
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      averageRating: 4.4, reviewCount: 19,
    },
    {
      name: 'OnePlus 12',
      brandId: brand.OnePlus.id, categoryId: phoneCat.id,
      model: 'CPH2573', price: 799,
      description: 'Hasselblad-tuned cameras, Snapdragon 8 Gen 3, 100W SUPERVOOC charging.',
      performanceSpecs: { display: '6.82" QHD+ LTPO AMOLED', storage: '256GB–512GB', battery: '5400mAh', chip: 'Snapdragon 8 Gen 3' },
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      averageRating: 4.5, reviewCount: 24,
    },
    {
      name: 'OnePlus Nord CE4',
      brandId: brand.OnePlus.id, categoryId: phoneCat.id,
      model: 'CPH2613', price: 329,
      description: 'Slim mid-range with 100W fast charging and a 50MP Sony sensor.',
      performanceSpecs: { display: '6.7" FHD+ AMOLED', storage: '128GB–256GB', battery: '5500mAh', chip: 'Snapdragon 7s Gen 2' },
      imageUrl: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400',
      averageRating: 4.1, reviewCount: 14,
    },
    {
      name: 'Xiaomi 14',
      brandId: brand.Xiaomi.id, categoryId: phoneCat.id,
      model: '23127PN0CC', price: 899,
      description: 'Leica-engineered camera system, compact flagship with Snapdragon 8 Gen 3.',
      performanceSpecs: { display: '6.36" LTPO AMOLED', storage: '256GB–512GB', battery: '4610mAh', chip: 'Snapdragon 8 Gen 3' },
      imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400',
      averageRating: 4.5, reviewCount: 18,
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro',
      brandId: brand.Xiaomi.id, categoryId: phoneCat.id,
      model: '23090RA98G', price: 299,
      description: '200MP camera, 67W fast charging, IP54 rated — unbeatable mid-range value.',
      performanceSpecs: { display: '6.67" FHD+ AMOLED', storage: '128GB–512GB', battery: '5100mAh', chip: 'Snapdragon 7s Gen 2' },
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400',
      averageRating: 4.2, reviewCount: 33,
    },

    // ── Laptops (11) ─────────────────────────────────────────────────────────
    {
      name: 'MacBook Pro 16"',
      brandId: brand.Apple.id, categoryId: laptopCat.id,
      model: 'M3 Max', price: 3499,
      description: 'M3 Max chip for extreme creative workloads, up to 128GB unified memory.',
      performanceSpecs: { cpu: 'M3 Max', ram: '36GB', storage: '1TB SSD', display: '16.2" Liquid Retina XDR' },
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      averageRating: 4.9, reviewCount: 38,
    },
    {
      name: 'MacBook Pro 14"',
      brandId: brand.Apple.id, categoryId: laptopCat.id,
      model: 'M3 Pro', price: 1999,
      description: 'M3 Pro chip, Liquid Retina XDR display, compact powerhouse.',
      performanceSpecs: { cpu: 'M3 Pro', ram: '18GB', storage: '512GB SSD', display: '14.2" Liquid Retina XDR' },
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      averageRating: 4.8, reviewCount: 56,
    },
    {
      name: 'MacBook Air M3',
      brandId: brand.Apple.id, categoryId: laptopCat.id,
      model: 'M3', price: 1299,
      description: 'Fanless design, all-day battery, M3 chip — the everyday laptop redefined.',
      performanceSpecs: { cpu: 'M3', ram: '8GB–24GB', storage: '256GB–2TB SSD', display: '13.6" Liquid Retina' },
      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
      averageRating: 4.6, reviewCount: 72,
    },
    {
      name: 'Dell XPS 15',
      brandId: brand.Dell.id, categoryId: laptopCat.id,
      model: 'XPS 9530', price: 1499,
      description: 'Premium Windows laptop with optional OLED touch display and RTX graphics.',
      performanceSpecs: { cpu: 'Intel Core i7-13700H', ram: '16GB', storage: '512GB NVMe', display: '15.6" OLED' },
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      averageRating: 4.5, reviewCount: 34,
    },
    {
      name: 'Dell XPS 13',
      brandId: brand.Dell.id, categoryId: laptopCat.id,
      model: 'XPS 9340', price: 1199,
      description: 'Ultra-portable 13" with Intel Core Ultra and a stunning Infinity Edge display.',
      performanceSpecs: { cpu: 'Intel Core Ultra 7', ram: '16GB', storage: '512GB NVMe', display: '13.4" FHD+ OLED' },
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      averageRating: 4.4, reviewCount: 27,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      brandId: brand.Lenovo.id, categoryId: laptopCat.id,
      model: 'Gen 12', price: 1699,
      description: 'Ultra-light business legend — MIL-SPEC durability and the best keyboard in class.',
      performanceSpecs: { cpu: 'Intel Core Ultra 7', ram: '32GB', storage: '1TB SSD', display: '14" IPS' },
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      averageRating: 4.7, reviewCount: 45,
    },
    {
      name: 'Lenovo ThinkPad E14',
      brandId: brand.Lenovo.id, categoryId: laptopCat.id,
      model: 'Gen 5', price: 749,
      description: 'Reliable everyday business laptop with AMD Ryzen and great value.',
      performanceSpecs: { cpu: 'AMD Ryzen 5 7530U', ram: '16GB', storage: '512GB SSD', display: '14" FHD IPS' },
      imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
      averageRating: 4.1, reviewCount: 19,
    },
    {
      name: 'HP Spectre x360 14"',
      brandId: brand.HP.id, categoryId: laptopCat.id,
      model: 'ee1013dx', price: 1549,
      description: 'Elegant 2-in-1 convertible with OLED display and Intel Evo platform.',
      performanceSpecs: { cpu: 'Intel Core Ultra 7', ram: '16GB', storage: '1TB SSD', display: '14" 2.8K OLED Touch' },
      imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
      averageRating: 4.5, reviewCount: 29,
    },
    {
      name: 'HP EliteBook 840 G11',
      brandId: brand.HP.id, categoryId: laptopCat.id,
      model: 'G11', price: 1399,
      description: 'Enterprise-grade AI-enhanced laptop with Sure View privacy screen.',
      performanceSpecs: { cpu: 'Intel Core Ultra 5', ram: '16GB', storage: '512GB SSD', display: '14" WUXGA IPS' },
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      averageRating: 4.3, reviewCount: 16,
    },
    {
      name: 'ASUS ZenBook 14 OLED',
      brandId: brand.ASUS.id, categoryId: laptopCat.id,
      model: 'UX3405MA', price: 1099,
      description: 'Lightweight Copilot+ laptop with a vivid 3K OLED display and Intel Core Ultra.',
      performanceSpecs: { cpu: 'Intel Core Ultra 9', ram: '32GB', storage: '1TB SSD', display: '14" 3K OLED' },
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      averageRating: 4.4, reviewCount: 21,
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      brandId: brand.ASUS.id, categoryId: laptopCat.id,
      model: 'GA403UV', price: 1799,
      description: 'Compact gaming powerhouse with OLED, Ryzen 9, and RTX 4060.',
      performanceSpecs: { cpu: 'AMD Ryzen 9 8945HS', ram: '32GB', storage: '1TB SSD', display: '14" 2.5K 165Hz OLED', gpu: 'RTX 4060' },
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      averageRating: 4.7, reviewCount: 52,
    },

    // ── Headphones (11) ──────────────────────────────────────────────────────
    {
      name: 'Sony WH-1000XM5',
      brandId: brand.Sony.id, categoryId: headphoneCat.id,
      model: 'WH-1000XM5', price: 349,
      description: 'Industry-leading noise cancellation, 30-hour battery, foldable design.',
      performanceSpecs: { driver: '30mm', anc: 'Yes', battery: '30h', wireless: 'Bluetooth 5.2' },
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-4f9eb7eebff7?w=400',
      averageRating: 4.7, reviewCount: 89,
    },
    {
      name: 'Sony WF-1000XM5',
      brandId: brand.Sony.id, categoryId: headphoneCat.id,
      model: 'WF-1000XM5', price: 279,
      description: "World's best noise-cancelling earbuds, compact and powerful.",
      performanceSpecs: { driver: '8.4mm', anc: 'Yes', battery: '8h + 16h case', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      averageRating: 4.6, reviewCount: 54,
    },
    {
      name: 'Sony WH-CH720N',
      brandId: brand.Sony.id, categoryId: headphoneCat.id,
      model: 'WH-CH720N', price: 149,
      description: 'Lightweight ANC headphones with 35-hour battery at an accessible price.',
      performanceSpecs: { driver: '30mm', anc: 'Yes', battery: '35h', wireless: 'Bluetooth 5.2' },
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
      averageRating: 4.2, reviewCount: 37,
    },
    {
      name: 'Bose QuietComfort Ultra',
      brandId: brand.Bose.id, categoryId: headphoneCat.id,
      model: 'QC Ultra', price: 429,
      description: 'Bose Immersive Audio, world-class ANC, and legendary all-day comfort.',
      performanceSpecs: { driver: 'Custom', anc: 'Yes', battery: '24h', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      averageRating: 4.6, reviewCount: 45,
    },
    {
      name: 'Bose QuietComfort 45',
      brandId: brand.Bose.id, categoryId: headphoneCat.id,
      model: 'QC 45', price: 279,
      description: 'Classic Bose comfort formula — great ANC and 24-hour wireless battery.',
      performanceSpecs: { driver: '40mm', anc: 'Yes', battery: '24h', wireless: 'Bluetooth 5.1' },
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      averageRating: 4.4, reviewCount: 78,
    },
    {
      name: 'Sennheiser Momentum 4',
      brandId: brand.Sennheiser.id, categoryId: headphoneCat.id,
      model: 'M4AEBT', price: 349,
      description: 'Exceptional audiophile-grade sound, 60-hour battery, and adaptive ANC.',
      performanceSpecs: { driver: '42mm', anc: 'Yes', battery: '60h', wireless: 'Bluetooth 5.2' },
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      averageRating: 4.6, reviewCount: 41,
    },
    {
      name: 'Sennheiser HD 660S2',
      brandId: brand.Sennheiser.id, categoryId: headphoneCat.id,
      model: 'HD 660S2', price: 499,
      description: 'Open-back audiophile headphones with transparent, natural reference sound.',
      performanceSpecs: { driver: '38mm', anc: 'No (open-back)', battery: 'Wired', type: 'Over-ear open-back' },
      imageUrl: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400',
      averageRating: 4.8, reviewCount: 29,
    },
    {
      name: 'JBL Tour One M2',
      brandId: brand.JBL.id, categoryId: headphoneCat.id,
      model: 'Tour One M2', price: 299,
      description: 'Adaptive ANC with four mics, 30-hour battery, and premium JBL sound.',
      performanceSpecs: { driver: '40mm', anc: 'Yes', battery: '30h', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400',
      averageRating: 4.3, reviewCount: 26,
    },
    {
      name: 'JBL Live 770NC',
      brandId: brand.JBL.id, categoryId: headphoneCat.id,
      model: 'Live 770NC', price: 149,
      description: 'True Adaptive ANC, 65-hour battery, and JBL Signature Sound on a budget.',
      performanceSpecs: { driver: '40mm', anc: 'Yes', battery: '65h', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400',
      averageRating: 4.2, reviewCount: 18,
    },
    {
      name: 'Apple AirPods Pro 2',
      brandId: brand.Apple.id, categoryId: headphoneCat.id,
      model: 'MTJV3LL/A', price: 249,
      description: 'H2 chip, best-in-class ANC, Adaptive Audio, and USB-C charging case.',
      performanceSpecs: { driver: 'Custom Apple', anc: 'Yes', battery: '6h + 24h case', wireless: 'Bluetooth 5.3' },
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      averageRating: 4.7, reviewCount: 112,
    },
    {
      name: 'Apple AirPods Max',
      brandId: brand.Apple.id, categoryId: headphoneCat.id,
      model: 'MQTP3LL/A', price: 549,
      description: 'Over-ear headphones with Apple H1 chips, computational audio, and premium aluminium build.',
      performanceSpecs: { driver: '40mm Apple', anc: 'Yes', battery: '20h', wireless: 'Bluetooth 5.0' },
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-4f9eb7eebff7?w=400',
      averageRating: 4.5, reviewCount: 63,
    },
  ];

  // Upsert each gadget by name — idempotent across re-runs
  for (const g of gadgets) {
    const existing = await prisma.gadget.findFirst({ where: { name: g.name } });
    if (!existing) {
      await prisma.gadget.create({ data: g });
    }
  }

  // ── Demo user ────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gadgetreview.com' },
    create: { name: 'Demo User', email: 'demo@gadgetreview.com', passwordHash },
    update: {},
  });

  // ── Demo review ──────────────────────────────────────────────────────────
  const firstGadget = await prisma.gadget.findFirst({ orderBy: { id: 'asc' } });
  if (firstGadget && (await prisma.review.count()) === 0) {
    await prisma.review.create({
      data: { gadgetId: firstGadget.id, userId: demoUser.id, rating: 5, comment: 'Excellent product! Highly recommend.' },
    });
    const agg = await prisma.review.aggregate({
      where: { gadgetId: firstGadget.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.gadget.update({
      where: { id: firstGadget.id },
      data: { averageRating: agg._avg.rating ?? 0, reviewCount: agg._count },
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
