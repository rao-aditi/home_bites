const { z } = require("zod");

const SECTION_TYPES = ["featured", "popular", "trending", "bestsellers", "offers", "categories"];

const sectionSchema = z.object({
  type: z.enum(SECTION_TYPES),
  title: z.string().trim().min(1, "Heading is required"),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => v || null),
  itemLimit: z.coerce.number().int().min(1).max(24).default(8),
  sortOrder: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true),
});

const visibleSchema = z.object({ isVisible: z.boolean() });

module.exports = { SECTION_TYPES, sectionSchema, visibleSchema };
