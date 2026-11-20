const { z } = require("zod");

const foodSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    description: z.string().trim().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    // `originalPrice` is the pre-discount price the customer site shows struck through,
    // so the admin's "discounted price" maps to price < originalPrice.
    originalPrice: z.coerce.number().positive().optional().nullable(),
    images: z.array(z.string().min(1)).min(1, "Upload at least one image").max(8),
    isVeg: z.boolean().default(false),
    ingredients: z.array(z.string().trim().min(1)).default([]),
    isAvailable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isPopular: z.boolean().default(false),
    isBestseller: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .refine((d) => d.originalPrice == null || d.originalPrice > d.price, {
    message: "Original price must be higher than the selling price",
    path: ["originalPrice"],
  });

const flagsSchema = z
  .object({
    isActive: z.boolean(),
    isAvailable: z.boolean(),
    isFeatured: z.boolean(),
    isPopular: z.boolean(),
  })
  .partial()
  .refine((d) => Object.keys(d).length > 0, "No flag provided");

module.exports = { foodSchema, flagsSchema };
