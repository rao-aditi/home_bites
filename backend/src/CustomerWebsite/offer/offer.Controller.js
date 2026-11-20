const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");
const { round2 } = require("../../utils/orderCalc");
const { liveOfferWhere, offerProblem } = require("../../utils/visibility");

const listOffers = asyncHandler(async (req, res) => {
  const offers = await prisma.offer.findMany({ where: liveOfferWhere() });
  res.json(offers);
});

const validateSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  subtotal: z.coerce.number().nonnegative(),
});

// POST /offers/validate { code, subtotal } — replaces the hardcoded coupon map
// that used to live in cart.jsx. Returns the offer plus the discount amount it
// yields for the given subtotal so the client can preview it before checkout.
const validateOffer = asyncHandler(async (req, res) => {
  const { code, subtotal } = validateSchema.parse(req.body);

  const offer = await prisma.offer.findUnique({ where: { code: code.toUpperCase() } });
  if (!offer) {
    throw new ApiError(404, "Invalid coupon code.");
  }
  const problem = offerProblem(offer, subtotal);
  if (problem) {
    throw new ApiError(400, problem);
  }

  let discount = 0;
  if (offer.discountType === "percent") {
    discount = round2(subtotal * (offer.value / 100));
  } else if (offer.discountType === "flat") {
    discount = round2(offer.value);
  } else if (offer.discountType === "free_delivery") {
    discount = 0; // actual delivery-fee waiver is applied against the live delivery fee at order time
  }
  if (offer.maxDiscount != null) {
    discount = Math.min(discount, offer.maxDiscount);
  }

  res.json({ offer, discount });
});

module.exports = { listOffers, validateOffer };
