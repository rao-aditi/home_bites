const prisma = require("../../config/db");
const { liveFoodWhere } = require("../../utils/visibility");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

// GET /foods?category=&search=&bestseller=
// `category` matches either a Category id or its name (case-insensitive) so the
// frontend can link in with either value.
const listFoods = asyncHandler(async (req, res) => {
  const { category, search, bestseller } = req.query;

  const where = { ...liveFoodWhere() };

  if (category) {
    where.category = { is: { isActive: true, OR: [{ id: category }, { name: { equals: category } }] } };
  }

  if (search) {
    where.name = { contains: search };
  }

  if (bestseller === "true") {
    where.isBestseller = true;
  } else if (bestseller === "false") {
    where.isBestseller = false;
  }

  const foods = await prisma.food.findMany({
    where,
    include: { category: true },
    orderBy: { name: "asc" },
  });

  res.json(foods);
});

const getFoodById = asyncHandler(async (req, res) => {
  const food = await prisma.food.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!food || !food.isActive || !food.category.isActive) {
    throw new ApiError(404, "Food not found.");
  }
  res.json(food);
});

module.exports = { listFoods, getFoodById };
