const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./wishlist.Service");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const stats = asyncHandler(async (req, res) => res.json(await service.stats()));

module.exports = { list, stats };
