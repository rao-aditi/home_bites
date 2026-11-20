const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains, parseBool } = require("../utils/query");

const withCount = { _count: { select: { foods: true } } };

async function list(query) {
  const pg = parsePagination(query);
  const where = {};
  if (query.search) where.name = contains(query.search);
  const isActive = parseBool(query.isActive);
  if (isActive !== undefined) where.isActive = isActive;

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: parseSort(query, ["name", "sortOrder", "createdAt"], { sortOrder: "asc" }),
      skip: pg.skip,
      take: pg.take,
      include: withCount,
    }),
    prisma.category.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function getById(id) {
  const item = await prisma.category.findUnique({ where: { id }, include: withCount });
  if (!item) throw new ApiError(404, "Category not found.");
  return item;
}

const create = (data) => prisma.category.create({ data });

const update = (id, data) => prisma.category.update({ where: { id }, data });

const setActive = (id, isActive) => prisma.category.update({ where: { id }, data: { isActive } });

async function remove(id) {
  const foods = await prisma.food.count({ where: { categoryId: id } });
  if (foods > 0) {
    throw new ApiError(
      409,
      `This category has ${foods} food item(s). Move or delete them first, or disable the category instead.`
    );
  }
  await prisma.category.delete({ where: { id } });
}

module.exports = { list, getById, create, update, setActive, remove };
