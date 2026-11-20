const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { parsePagination, parseSort, paginated, contains, parseBool } = require("../utils/query");

const include = {
  user: { select: { id: true, name: true, email: true } },
  food: { select: { id: true, name: true, image: true } },
};

// Keeps Food.rating (shown on every customer food card) equal to the average of the
// visible reviews. With no visible reviews the existing rating is left alone.
async function recalcFoodRating(foodId) {
  const agg = await prisma.review.aggregate({
    where: { foodId, isHidden: false },
    _avg: { rating: true },
    _count: true,
  });
  if (agg._count > 0) {
    await prisma.food.update({
      where: { id: foodId },
      data: { rating: Math.round(agg._avg.rating * 10) / 10 },
    });
  }
}

// ---- admin ----
async function list(query) {
  const pg = parsePagination(query);
  const where = {};
  if (query.foodId) where.foodId = query.foodId;
  if (query.rating) where.rating = parseInt(query.rating, 10) || undefined;
  const isHidden = parseBool(query.isHidden);
  if (isHidden !== undefined) where.isHidden = isHidden;
  if (query.search) {
    where.OR = [{ comment: contains(query.search) }, { user: { is: { name: contains(query.search) } } }];
  }

  const [items, total, agg] = await Promise.all([
    prisma.review.findMany({
      where,
      include,
      orderBy: parseSort(query, ["createdAt", "rating"]),
      skip: pg.skip,
      take: pg.take,
    }),
    prisma.review.count({ where }),
    prisma.review.aggregate({ where: { isHidden: false }, _avg: { rating: true }, _count: true }),
  ]);
  return {
    ...paginated(items, total, pg),
    summary: { averageRating: agg._avg.rating || 0, visibleReviews: agg._count },
  };
}

async function getById(id) {
  const item = await prisma.review.findUnique({ where: { id }, include });
  if (!item) throw new ApiError(404, "Review not found.");
  return item;
}

// Hidden reviews disappear from the customer site and stop counting toward the rating.
async function setHidden(id, isHidden) {
  const updated = await prisma.review.update({ where: { id }, data: { isHidden }, include });
  await recalcFoodRating(updated.foodId);
  return updated;
}

async function remove(id) {
  const review = await prisma.review.delete({ where: { id } });
  await recalcFoodRating(review.foodId);
}

// ---- customer site ----
const listForFood = (foodId) =>
  prisma.review.findMany({
    where: { foodId, isHidden: false },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

// One review per customer per food; posting again updates it.
async function upsertForFood(userId, foodId, { rating, comment }) {
  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) throw new ApiError(404, "Food not found.");

  const review = await prisma.review.upsert({
    where: { userId_foodId: { userId, foodId } },
    create: { userId, foodId, rating, comment: comment || null },
    update: { rating, comment: comment || null, isHidden: false },
  });
  await recalcFoodRating(foodId);
  return review;
}

module.exports = { list, getById, setHidden, remove, listForFood, upsertForFood };
