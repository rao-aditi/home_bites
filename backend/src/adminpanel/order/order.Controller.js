const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./order.Service");
const { statusSchema } = require("./order.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  res.json(await service.updateStatus(req.params.id, status));
});

module.exports = { list, getById, updateStatus };
