const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });
  res.json(addresses);
});

const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  line1: z.string().trim().min(1, "Address line is required"),
  city: z.string().trim().min(1, "City is required"),
  phone: z.string().trim().min(1, "Phone is required"),
});

// Business rule: a newly-added address always becomes the default. Unset every
// other address for the user, then create the new one as default, atomically.
const addAddress = asyncHandler(async (req, res) => {
  const data = addressSchema.parse(req.body);

  const address = await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    return tx.address.create({ data: { ...data, userId: req.user.id, isDefault: true } });
  });

  res.status(201).json(address);
});

const updateSchema = addressSchema.partial();

const updateAddress = asyncHandler(async (req, res) => {
  const data = updateSchema.parse(req.body);

  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address || address.userId !== req.user.id) {
    throw new ApiError(404, "Address not found.");
  }

  const updated = await prisma.address.update({ where: { id: address.id }, data });
  res.json(updated);
});

// Deleting the default address auto-promotes another remaining address to default.
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address || address.userId !== req.user.id) {
    throw new ApiError(404, "Address not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: address.id } });

    if (address.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId: req.user.id },
        orderBy: { id: "asc" },
      });
      if (next) {
        await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }
  });

  res.json({ removed: true, id: address.id });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address || address.userId !== req.user.id) {
    throw new ApiError(404, "Address not found.");
  }

  const [, updated] = await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: address.id }, data: { isDefault: true } }),
  ]);

  res.json(updated);
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
