const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");

const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  res.json(categories);
});

module.exports = { listCategories };
