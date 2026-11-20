const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains } = require("../utils/query");
const { STATUSES, TERMINAL } = require("./order.validator");

const include = {
  items: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
};

async function list(query) {
  const pg = parsePagination(query);
  const { status, search, from, to } = query;
  const where = {};

  if (status) {
    if (!STATUSES.includes(status)) throw new ApiError(400, "Invalid status filter.");
    where.status = status;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (search) {
    where.OR = [
      { id: contains(search) },
      { user: { is: { name: contains(search) } } },
      { user: { is: { email: contains(search) } } },
      { addressPhone: contains(search) },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include,
      orderBy: parseSort(query, ["createdAt", "total", "status"]),
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.order.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function getById(id) {
  const item = await prisma.order.findUnique({ where: { id }, include });
  if (!item) throw new ApiError(404, "Order not found.");
  return item;
}

// Admins can move an order to any state, except out of a finished one.
async function updateStatus(id, status) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new ApiError(404, "Order not found.");
  if (TERMINAL.includes(order.status)) {
    throw new ApiError(400, `This order is already ${order.status} and can no longer be changed.`);
  }

  const updated = await prisma.order.update({ where: { id }, data: { status }, include });

  // Keep the customer informed through the existing notification feed.
  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: "order",
      title: "Order update",
      message: `Your order #${order.id.slice(-6).toUpperCase()} is now ${status === "out" ? "out for delivery" : status}.`,
    },
  });

  return updated;
}

module.exports = { list, getById, updateStatus };
