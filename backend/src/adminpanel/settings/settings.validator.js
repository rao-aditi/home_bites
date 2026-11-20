const { z } = require("zod");

const optional = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => v || null);

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Website name is required"),
  tagline: z.string().trim().default(""),
  description: z.string().trim().default(""),
  logo: z.string().trim().min(1, "Logo is required"),
  banner: z.string().trim().default(""),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z
    .string()
    .trim()
    .email("Valid email is required")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  address: z.string().trim().min(1, "Address is required"),
  openingHours: z.string().trim().default(""),
  avgDeliveryTime: z.coerce.number().int().positive().default(30),
  deliveryFee: z.coerce.number().nonnegative().default(0),
  minOrderValue: z.coerce.number().nonnegative().default(0),
  taxPercent: z.coerce.number().min(0).max(100).default(0),
  serviceChargePercent: z.coerce.number().min(0).max(100).default(0),
  facebookUrl: optional,
  instagramUrl: optional,
  twitterUrl: optional,
  youtubeUrl: optional,
  isOpen: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

module.exports = { settingsSchema };
