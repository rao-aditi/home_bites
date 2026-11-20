const prisma = require("../../config/db");
const { liveOfferWhere } = require("../../utils/visibility");

const DAYS = 14;
const dayKey = (d) => d.toISOString().slice(0, 10);
const round2 = (n) => Math.round(n * 100) / 100;

async function overview() {
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - (DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const notCancelled = { status: { not: "cancelled" } };

  const [
    totalOrders,
    revenue,
    totalCustomers,
    totalFoods,
    totalCategories,
    activeOffers,
    pendingOrders,
    recentOrders,
    recentCustomers,
    salesOrders,
    popular,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: notCancelled, _sum: { total: true } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.food.count(),
    prisma.category.count(),
    prisma.offer.count({ where: liveOfferWhere(now) }),
    prisma.order.count({ where: { status: "placed" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { id: true, name: true, email: true } }, items: { select: { id: true } } },
    }),
    prisma.user.findMany({
      where: { role: "customer" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, createdAt: true, isActive: true },
    }),
    prisma.order.findMany({
      where: { ...notCancelled, createdAt: { gte: since } },
      select: { total: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["foodId"],
      where: { order: { is: notCancelled } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  // Zero-filled daily series so the chart has no gaps.
  const series = new Map();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    series.set(dayKey(d), { date: dayKey(d), orders: 0, revenue: 0 });
  }
  for (const o of salesOrders) {
    const row = series.get(dayKey(o.createdAt));
    if (row) {
      row.orders += 1;
      row.revenue = round2(row.revenue + o.total);
    }
  }

  const foods = await prisma.food.findMany({
    where: { id: { in: popular.map((p) => p.foodId) } },
    select: { id: true, name: true, image: true, price: true },
  });

  return {
    stats: {
      totalOrders,
      totalRevenue: round2(revenue._sum.total || 0),
      totalCustomers,
      totalFoods,
      totalCategories,
      activeOffers,
      pendingOrders,
    },
    recentOrders,
    recentCustomers,
    salesOverview: [...series.values()],
    popularFoods: popular.map((p) => ({ ...foods.find((f) => f.id === p.foodId), sold: p._sum.quantity || 0 })),
  };
}

module.exports = { overview };
