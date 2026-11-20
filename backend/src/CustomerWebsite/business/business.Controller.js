const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

const getBusiness = asyncHandler(async (req, res) => {
  const business = await prisma.business.findFirst();
  if (!business) {
    throw new ApiError(404, "Business profile not configured.");
  }
  res.json(business);
});

module.exports = { getBusiness };
