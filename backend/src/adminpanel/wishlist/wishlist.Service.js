// Read-only monitoring of customers' wishlists — admins never edit these.
const prisma = require("../../config/db");
const { parsePagination, paginated, contains } = require("../utils/query");

async function list(query) {
  const pg = parsePagination(query);
  const where = {};
  if (query.userId) where.userId = query.userId;
  if (query.foodId) where.foodId = query.foodId;
  if (query.search) {
    where.OR = [
      { user: { is: { name: contains(query.search) } } },
      { user: { is: { email: contains(query.search) } } },
      { food: { is: { name: contains(query.search) } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.wishlistItem.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        food: { select: { id: true, name: true, image: true, price: true } },
      },
      orderBy: { id: "desc" },
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.wishlistItem.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function stats() {
  const [total, byFood, byUser] = await Promise.all([
    prisma.wishlistItem.count(),
    prisma.wishlistItem.groupBy({
      by: ["foodId"],
      _count: { foodId: true },
      orderBy: { _count: { foodId: "desc" } },
    }),
    prisma.wishlistItem.groupBy({ by: ["userId"], _count: { userId: true } }),
  ]);

  const top = byFood.slice(0, 8);
  const foods = await prisma.food.findMany({
    where: { id: { in: top.map((t) => t.foodId) } },
    select: { id: true, name: true, image: true },
  });

  return {
    totalEntries: total,
    customersWithWishlist: byUser.length,
    uniqueFoods: byFood.length,
    mostWishlisted: top.map((t) => ({ ...foods.find((f) => f.id === t.foodId), count: t._count.foodId })),
  };
}

module.exports = { list, stats };
