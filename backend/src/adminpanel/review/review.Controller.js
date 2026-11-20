const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./review.Service");
const { hiddenSchema, reviewSchema } = require("./review.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const setHidden = asyncHandler(async (req, res) => {
  const { isHidden } = hiddenSchema.parse(req.body);
  res.json(await service.setHidden(req.params.id, isHidden));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Review deleted." });
});

// Customer-facing: GET/POST /api/foods/:id/reviews
const listForFood = asyncHandler(async (req, res) => res.json(await service.listForFood(req.params.id)));

const upsertForFood = asyncHandler(async (req, res) => {
  const body = reviewSchema.parse(req.body);
  res.status(201).json(await service.upsertForFood(req.user.id, req.params.id, body));
});

module.exports = { list, getById, setHidden, remove, listForFood, upsertForFood };
