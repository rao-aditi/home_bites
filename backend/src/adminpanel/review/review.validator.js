const { z } = require("zod");

const hiddenSchema = z.object({ isHidden: z.boolean() });

// Customer-submitted review.
const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

module.exports = { hiddenSchema, reviewSchema };
