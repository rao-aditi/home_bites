const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./banner.Service");
const { bannerSchema, activeSchema } = require("./banner.validator");

const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));

const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(bannerSchema.parse(req.body)));
});

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(req.params.id, bannerSchema.parse(req.body)));
});

const setActive = asyncHandler(async (req, res) => {
  const { isActive } = activeSchema.parse(req.body);
  res.json(await service.setActive(req.params.id, isActive));
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Banner deleted." });
});

// Customer-facing: GET /api/banners
const listPublic = asyncHandler(async (req, res) => res.json(await service.listPublic(req.query)));

module.exports = { list, getById, create, update, setActive, remove, listPublic };
