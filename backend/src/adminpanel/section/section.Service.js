const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { liveFoodWhere, liveOfferWhere } = require("../../utils/visibility");

const list = () => prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });

async function getById(id) {
  const item = await prisma.homepageSection.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Section not found.");
  return item;
}

const create = (data) => prisma.homepageSection.create({ data });
const update = (id, data) => prisma.homepageSection.update({ where: { id }, data });
const setVisible = (id, isVisible) => prisma.homepageSection.update({ where: { id }, data: { isVisible } });
const remove = (id) => prisma.homepageSection.delete({ where: { id } });

// ---- customer site: resolve each visible section into the real items to render ----
async function resolveItems(section) {
  const take = section.itemLimit;
  const foodArgs = { include: { category: true }, take };

  switch (section.type) {
    case "featured":
      return prisma.food.findMany({ ...foodArgs, where: { ...liveFoodWhere(), isFeatured: true } });
    case "popular":
      return prisma.food.findMany({ ...foodArgs, where: { ...liveFoodWhere(), isPopular: true } });
    case "bestsellers":
      return prisma.food.findMany({ ...foodArgs, where: { ...liveFoodWhere(), isBestseller: true } });
    case "trending": {
      // Most ordered in the last 30 days.
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const top = await prisma.orderItem.groupBy({
        by: ["foodId"],
        where: { order: { is: { createdAt: { gte: since }, status: { not: "cancelled" } } } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: take * 2,
      });
      const foods = await prisma.food.findMany({
        where: { ...liveFoodWhere(), id: { in: top.map((t) => t.foodId) } },
        include: { category: true },
      });
      const rank = new Map(top.map((t, i) => [t.foodId, i]));
      return foods.sort((a, b) => rank.get(a.id) - rank.get(b.id)).slice(0, take);
    }
    case "offers":
      return prisma.offer.findMany({ where: liveOfferWhere(), take });
    case "categories":
      return prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take });
    default:
      return [];
  }
}

async function listPublic() {
  const sections = await prisma.homepageSection.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
  return Promise.all(sections.map(async (s) => ({ ...s, items: await resolveItems(s) })));
}

module.exports = { list, getById, create, update, setVisible, remove, listPublic };
