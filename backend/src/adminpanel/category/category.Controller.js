const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./category.Service");
const { categorySchema, activeSchema } = require("./category.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(categorySchema.parse(req.body)));
});

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(req.params.id, categorySchema.parse(req.body)));
});

const setActive = asyncHandler(async (req, res) => {
  const { isActive } = activeSchema.parse(req.body);
  res.json(await service.setActive(req.params.id, isActive));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Category deleted." });
});

module.exports = { list, getById, create, update, setActive, remove };
