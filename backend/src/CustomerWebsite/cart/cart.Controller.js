const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

const getCart = asyncHandler(async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { food: { include: { category: true } } },
    orderBy: { id: "asc" },
  });
  res.json(items);
});

const addSchema = z.object({
  foodId: z.string().min(1, "foodId is required"),
  quantity: z.coerce.number().int().positive().default(1),
});

// Upsert-increment: adding an already-in-cart food increases its quantity instead
// of creating a duplicate row (matches the @@unique([userId, foodId]) constraint).
const addToCart = asyncHandler(async (req, res) => {
  const { foodId, quantity } = addSchema.parse(req.body);

  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  if (!food.isActive) {
    throw new ApiError(404, "Food not found.");
  }
  if (!food.isAvailable) {
    throw new ApiError(400, "This item is currently sold out.");
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_foodId: { userId: req.user.id, foodId } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { food: { include: { category: true } } },
      })
    : await prisma.cartItem.create({
        data: { userId: req.user.id, foodId, quantity },
        include: { food: { include: { category: true } } },
      });

  res.status(201).json(item);
});

const updateSchema = z.object({
  action: z.enum(["inc", "dec"]),
});

// PATCH /cart/:id { action: "inc" | "dec" } — decrementing to 0 removes the item.
const updateCartItem = asyncHandler(async (req, res) => {
  const { action } = updateSchema.parse(req.body);

  const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.userId !== req.user.id) {
    throw new ApiError(404, "Cart item not found.");
  }

  const nextQuantity = action === "inc" ? item.quantity + 1 : item.quantity - 1;

  if (nextQuantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return res.json({ removed: true, id: item.id });
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: nextQuantity },
    include: { food: { include: { category: true } } },
  });
  res.json(updated);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const item = await prisma.cartItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.userId !== req.user.id) {
    throw new ApiError(404, "Cart item not found.");
  }
  await prisma.cartItem.delete({ where: { id: item.id } });
  res.json({ removed: true, id: item.id });
});

// DELETE /cart — clears the whole cart. Not in the original contract table but needed
// for a "clear cart" action and used internally after a successful checkout.
const clearCart = asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ cleared: true });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
