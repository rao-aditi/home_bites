const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./section.Service");
const { sectionSchema, visibleSchema } = require("./section.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list()));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(sectionSchema.parse(req.body)));
});

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(req.params.id, sectionSchema.parse(req.body)));
});

const setVisible = asyncHandler(async (req, res) => {
  const { isVisible } = visibleSchema.parse(req.body);
  res.json(await service.setVisible(req.params.id, isVisible));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Section deleted." });
});

// Customer-facing: GET /api/homepage-sections
const listPublic = asyncHandler(async (req, res) => res.json(await service.listPublic()));

module.exports = { list, getById, create, update, setVisible, remove, listPublic };
