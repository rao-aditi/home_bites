const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./customer.Service");
const { activeSchema } = require("./customer.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const setActive = asyncHandler(async (req, res) => {
  const { isActive } = activeSchema.parse(req.body);
  res.json(await service.setActive(req.params.id, isActive));
});

module.exports = { list, getById, setActive };
