const { z } = require("zod");

const optional = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null);

const bannerSchema = z.object({
  type: z.enum(["hero", "promo"]).default("hero"),
  title: z.string().trim().min(1, "Title is required"),
  subtitle: optional,
  image: z.string().trim().min(1, "Banner image is required"),
  linkUrl: optional,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

const activeSchema = z.object({ isActive: z.boolean() });

module.exports = { bannerSchema, activeSchema };
