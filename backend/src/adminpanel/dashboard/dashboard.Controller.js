const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./dashboard.Service");

const overview = asyncHandler(async (req, res) => res.json(await service.overview()));

module.exports = { overview };
