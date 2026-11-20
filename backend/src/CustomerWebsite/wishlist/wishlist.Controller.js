const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

const getWishlist = asyncHandler(async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user.id },
    include: { food: { include: { category: true } } },
    orderBy: { id: "asc" },
  });
  res.json(items);
});

const addSchema = z.object({
  foodId: z.string().min(1, "foodId is required"),
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { foodId } = addSchema.parse(req.body);

  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const item = await prisma.wishlistItem.upsert({
    where: { userId_foodId: { userId: req.user.id, foodId } },
    update: {},
    create: { userId: req.user.id, foodId },
    include: { food: { include: { category: true } } },
  });

  res.status(201).json(item);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_foodId: { userId: req.user.id, foodId: req.params.foodId } },
  });
  if (!item) {
    throw new ApiError(404, "Wishlist item not found.");
  }
  await prisma.wishlistItem.delete({ where: { id: item.id } });
  res.json({ removed: true, foodId: req.params.foodId });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
