const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains, parseBool } = require("../utils/query");

async function list(query) {
  const pg = parsePagination(query);
  const where = {};
  if (query.search) {
    where.OR = [{ title: contains(query.search) }, { code: contains(query.search) }];
  }
  const isActive = parseBool(query.isActive);
  if (isActive !== undefined) where.isActive = isActive;

  const [items, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      orderBy: parseSort(query, ["title", "code", "createdAt", "expiresAt"]),
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.offer.count({ where }),
  ]);
  return paginated(items, total, pg);
}

async function getById(id) {
  const item = await prisma.offer.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Offer not found.");
  return item;
}

const create = (data) => prisma.offer.create({ data });
const update = (id, data) => prisma.offer.update({ where: { id }, data });
const setActive = (id, isActive) => prisma.offer.update({ where: { id }, data: { isActive } });
const remove = (id) => prisma.offer.delete({ where: { id } });

module.exports = { list, getById, create, update, setActive, remove };
