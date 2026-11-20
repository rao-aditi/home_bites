const { z } = require("zod");

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null);

const offerSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(30)
      .transform((v) => v.toUpperCase()),
    title: z.string().trim().min(1, "Title is required"),
    subtitle: z.string().trim().min(1, "Short subtitle is required"),
    description: optionalText,
    bannerImage: optionalText,
    color: z.string().trim().min(1).default("from-orange-500 to-pink-500"),
    discountType: z.enum(["percent", "flat", "free_delivery"]),
    value: z.coerce.number().nonnegative().default(0),
    minOrderAmount: z.coerce.number().nonnegative().default(0),
    maxDiscount: z.coerce.number().positive().optional().nullable(),
    startsAt: z.coerce.date().optional().nullable(),
    expiresAt: z.coerce.date().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine((d) => d.discountType === "free_delivery" || d.value > 0, {
    message: "Discount value must be greater than 0",
    path: ["value"],
  })
  .refine((d) => d.discountType !== "percent" || d.value <= 100, {
    message: "Percentage cannot exceed 100",
    path: ["value"],
  })
  .refine((d) => !d.startsAt || !d.expiresAt || d.expiresAt > d.startsAt, {
    message: "Expiry must be after the start date",
    path: ["expiresAt"],
  });

const activeSchema = z.object({ isActive: z.boolean() });

module.exports = { offerSchema, activeSchema };
