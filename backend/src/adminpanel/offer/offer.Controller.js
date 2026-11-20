const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./offer.Service");
const { offerSchema, activeSchema } = require("./offer.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(offerSchema.parse(req.body)));
});

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(req.params.id, offerSchema.parse(req.body)));
});

const setActive = asyncHandler(async (req, res) => {
  const { isActive } = activeSchema.parse(req.body);
  res.json(await service.setActive(req.params.id, isActive));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Offer deleted." });
});

module.exports = { list, getById, create, update, setActive, remove };
