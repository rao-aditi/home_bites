const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => v || null),
  image: z.string().trim().min(1, "Image is required"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

const activeSchema = z.object({ isActive: z.boolean() });

module.exports = { categorySchema, activeSchema };
