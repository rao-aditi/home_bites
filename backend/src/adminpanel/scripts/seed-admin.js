// Idempotent bootstrap for the admin panel. Safe to re-run: it never deletes data.
//   npm run admin:seed
// Override the credentials with ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in backend/.env.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@homebites.app").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "HomeBites Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Never silently overwrite a customer's password; just make sure the role is right.
    await prisma.user.update({ where: { email }, data: { role: "admin", isActive: true } });
    console.log(`Admin role ensured for existing user ${email} (password unchanged).`);
  } else {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 10), role: "admin" },
    });
    console.log(`Created admin -> email: ${email}  password: ${password}`);
  }

  if ((await prisma.homepageSection.count()) === 0) {
    await prisma.homepageSection.createMany({
      data: [
        { type: "categories", title: "What's on your mind?", itemLimit: 12, sortOrder: 0 },
        { type: "offers", title: "Top offers for you", itemLimit: 3, sortOrder: 1 },
        { type: "bestsellers", title: "Best sellers this week", itemLimit: 4, sortOrder: 2 },
        { type: "featured", title: "Chef's featured picks", itemLimit: 4, sortOrder: 3 },
        { type: "popular", title: "Popular right now", itemLimit: 8, sortOrder: 4 },
        { type: "trending", title: "Trending this month", itemLimit: 4, sortOrder: 5, isVisible: false },
      ],
    });
    console.log("Created default homepage sections.");
  }

  if ((await prisma.banner.count()) === 0) {
    const business = await prisma.business.findFirst();
    if (business?.banner) {
      await prisma.banner.create({
        data: {
          type: "hero",
          title: business.tagline || "Home-style meals, delivered fast",
          subtitle: business.description,
          image: business.banner,
          linkUrl: "/menu",
        },
      });
      console.log("Created default hero banner.");
    }
  }

  // First-run content flags so the new Featured/Popular sections are not empty.
  if ((await prisma.food.count({ where: { isPopular: true } })) === 0) {
    await prisma.food.updateMany({ where: { isBestseller: true }, data: { isPopular: true } });
  }
  if ((await prisma.food.count({ where: { isFeatured: true } })) === 0) {
    const top = await prisma.food.findMany({ orderBy: { rating: "desc" }, take: 6, select: { id: true } });
    await prisma.food.updateMany({ where: { id: { in: top.map((f) => f.id) } }, data: { isFeatured: true } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
