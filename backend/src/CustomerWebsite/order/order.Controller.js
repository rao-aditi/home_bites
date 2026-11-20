const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");
const { computeOrderTotals } = require("../../utils/orderCalc");
const { offerProblem } = require("../../utils/visibility");

const ORDER_STATUS_LIFECYCLE = ["placed", "accepted", "preparing", "ready", "assigned", "out", "delivered"];

const createOrderSchema = z.object({
  addressId: z.string().min(1, "addressId is required"),
  paymentMethod: z.string().trim().min(1, "paymentMethod is required"),
  tip: z.coerce.number().nonnegative().default(0),
  couponCode: z.string().trim().optional(),
});

const orderInclude = { items: true };

// POST /orders — recomputes the total server-side from the user's LIVE cart and the
// CURRENT DB food prices. The client-submitted total (if any) is ignored entirely;
// this is the fix for the old cart/checkout/payment pages independently computing
// (and disagreeing on) the order total.
const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod, tip, couponCode } = createOrderSchema.parse(req.body);

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== req.user.id) {
    throw new ApiError(404, "Address not found.");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { food: true },
  });
  if (cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty.");
  }

  const business = await prisma.business.findFirst();
  if (business?.maintenanceMode) {
    throw new ApiError(503, "We are currently under maintenance. Please try again shortly.");
  }

  const categories = await prisma.category.findMany({
    where: { id: { in: cartItems.map((ci) => ci.food.categoryId) } },
    select: { id: true, isActive: true },
  });
  const inactiveCategory = new Set(categories.filter((c) => !c.isActive).map((c) => c.id));
  const unavailable = cartItems.filter(
    (ci) => !ci.food.isAvailable || !ci.food.isActive || inactiveCategory.has(ci.food.categoryId)
  );
  if (unavailable.length > 0) {
    throw new ApiError(
      400,
      `Some items in your cart are no longer available: ${unavailable.map((ci) => ci.food.name).join(", ")}`
    );
  }

  let offer = null;
  if (couponCode) {
    offer = await prisma.offer.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!offer) {
      throw new ApiError(400, "Invalid coupon code.");
    }
    const cartSubtotal = cartItems.reduce((sum, ci) => sum + ci.food.price * ci.quantity, 0);
    const problem = offerProblem(offer, cartSubtotal);
    if (problem) {
      throw new ApiError(400, problem);
    }
  }

  const baseDeliveryFee = business?.deliveryFee ?? 0;

  const orderSubtotal = cartItems.reduce((sum, ci) => sum + ci.food.price * ci.quantity, 0);
  if (business && orderSubtotal < business.minOrderValue) {
    throw new ApiError(400, `Minimum order amount is $${business.minOrderValue.toFixed(2)}.`);
  }

  const priced = cartItems.map((ci) => ({ price: ci.food.price, quantity: ci.quantity }));
  const totals = computeOrderTotals({ items: priced, baseDeliveryFee, tip, offer });

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: req.user.id,
        status: "placed",
        subtotal: totals.subtotal,
        gst: totals.gst,
        deliveryFee: totals.deliveryFee,
        platformFee: totals.platformFee,
        packagingFee: totals.packagingFee,
        tip: totals.tip,
        discount: totals.discount,
        couponCode: offer ? offer.code : null,
        total: totals.total,
        addressLabel: address.label,
        addressLine1: address.line1,
        addressCity: address.city,
        addressPhone: address.phone,
        paymentMethod,
        items: {
          create: cartItems.map((ci) => ({
            foodId: ci.food.id,
            name: ci.food.name,
            price: ci.food.price,
            quantity: ci.quantity,
            image: ci.food.image,
          })),
        },
      },
      include: orderInclude,
    });

    await tx.cartItem.deleteMany({ where: { userId: req.user.id } });

    return created;
  });

  res.status(201).json(order);
});

const listOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: orderInclude });
  if (!order || order.userId !== req.user.id) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

const statusSchema = z.object({
  status: z.enum(ORDER_STATUS_LIFECYCLE),
});

// PATCH /orders/:id/status — forward-only against the fixed 7-step lifecycle.
// Rejects backward writes and skip-ahead writes (must advance exactly one step
// at a time); scoped strictly to the requesting user's own orders (403 otherwise).
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status: nextStatus } = statusSchema.parse(req.body);

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  if (order.userId !== req.user.id) {
    throw new ApiError(403, "You do not have access to this order.");
  }

  const currentIndex = ORDER_STATUS_LIFECYCLE.indexOf(order.status);
  const nextIndex = ORDER_STATUS_LIFECYCLE.indexOf(nextStatus);

  if (nextIndex !== currentIndex + 1) {
    throw new ApiError(
      400,
      `Cannot move order from "${order.status}" to "${nextStatus}". Status must advance one step at a time (${ORDER_STATUS_LIFECYCLE.join(" -> ")}).`
    );
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus },
    include: orderInclude,
  });
  res.json(updated);
});

module.exports = { createOrder, listOrders, getOrderById, updateOrderStatus, ORDER_STATUS_LIFECYCLE };
