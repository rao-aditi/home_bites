const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains, parseBool } = require("../utils/query");

const include = { category: true };

// `image` (the single cover image used across the customer site) is always derived
// from the first gallery image so the two can never drift apart.
const withCover = (d) => ({ ...d, image: d.images[0] });

async function list(query) {
  const pg = parsePagination(query);
  const where = {};
  if (query.search) where.name = contains(query.search);
  if (query.categoryId) where.categoryId = query.categoryId;
  for (const key of ["isActive", "isAvailable", "isVeg", "isFeatured", "isPopular"]) {
    const v = parseBool(query[key]);
    if (v !== undefined) where[key] = v;
  }

  const [items, total] = await Promise.all([
    prisma.food.findMany({
      where,
      include,
      orderBy: parseSort(query, ["name", "price", "rating", "createdAt"]),
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.food.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function getById(id) {
  const item = await prisma.food.findUnique({ where: { id }, include });
  if (!item) throw new ApiError(404, "Food not found.");
  return item;
}

const create = (data) => prisma.food.create({ data: withCover(data), include });

const update = (id, data) => prisma.food.update({ where: { id }, data: withCover(data), include });

const setFlags = (id, flags) => prisma.food.update({ where: { id }, data: flags, include });

async function remove(id) {
  const orders = await prisma.orderItem.count({ where: { foodId: id } });
  if (orders > 0) {
    throw new ApiError(409, "This food appears in past orders, so it cannot be deleted. Disable it instead.");
  }
  await prisma.food.delete({ where: { id } });
}

module.exports = { list, getById, create, update, setFlags, remove };
