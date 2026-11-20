const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parseBool } = require("../utils/query");

function list(query) {
  const where = {};
  if (query.type) where.type = query.type;
  const isActive = parseBool(query.isActive);
  if (isActive !== undefined) where.isActive = isActive;
  return prisma.banner.findMany({ where, orderBy: [{ type: "asc" }, { sortOrder: "asc" }] });
}

async function getById(id) {
  const item = await prisma.banner.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Banner not found.");
  return item;
}

const create = (data) => prisma.banner.create({ data });
const update = (id, data) => prisma.banner.update({ where: { id }, data });
const setActive = (id, isActive) => prisma.banner.update({ where: { id }, data: { isActive } });
const remove = (id) => prisma.banner.delete({ where: { id } });

// Customer site: only enabled banners, optionally of one type.
function listPublic(query) {
  const where = { isActive: true };
  if (query.type) where.type = query.type;
  return prisma.banner.findMany({ where, orderBy: { sortOrder: "asc" } });
}

module.exports = { list, getById, create, update, setActive, remove, listPublic };
