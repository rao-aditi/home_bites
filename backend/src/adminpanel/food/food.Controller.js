const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./food.Service");
const { foodSchema, flagsSchema } = require("./food.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(foodSchema.parse(req.body)));
});

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(req.params.id, foodSchema.parse(req.body)));
});

// Quick toggles from the table: enable/disable, availability, featured, popular.
const setFlags = asyncHandler(async (req, res) => {
  res.json(await service.setFlags(req.params.id, flagsSchema.parse(req.body)));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Food deleted." });
});

module.exports = { list, getById, create, update, setFlags, remove };
