const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains, parseBool } = require("../utils/query");

// Never expose passwordHash.
const select = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  isActive: true,
  createdAt: true,
  _count: { select: { orders: true, wishlistItems: true, reviews: true } },
};

async function list(query) {
  const pg = parsePagination(query);
  const where = { role: "customer" };
  if (query.search) {
    where.OR = [
      { name: contains(query.search) },
      { email: contains(query.search) },
      { phone: contains(query.search) },
    ];
  }
  const isActive = parseBool(query.isActive);
  if (isActive !== undefined) where.isActive = isActive;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select,
      orderBy: parseSort(query, ["name", "email", "createdAt"]),
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.user.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function getById(id) {
  const customer = await prisma.user.findFirst({
    where: { id, role: "customer" },
    select: {
      ...select,
      addresses: true,
      orders: { orderBy: { createdAt: "desc" }, take: 50, include: { items: true } },
    },
  });
  if (!customer) throw new ApiError(404, "Customer not found.");

  const spent = await prisma.order.aggregate({
    where: { userId: customer.id, status: { not: "cancelled" } },
    _sum: { total: true },
  });
  return { ...customer, totalSpent: spent._sum.total || 0 };
}

async function setActive(id, isActive) {
  const target = await prisma.user.findFirst({ where: { id, role: "customer" } });
  if (!target) throw new ApiError(404, "Customer not found.");
  return prisma.user.update({ where: { id }, data: { isActive }, select });
}

module.exports = { list, getById, setActive };
