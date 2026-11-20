const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./settings.Service");
const { settingsSchema } = require("./settings.validator");

const get = asyncHandler(async (req, res) => res.json(await service.get()));

const update = asyncHandler(async (req, res) => {
  res.json(await service.update(settingsSchema.parse(req.body)));
});

module.exports = { get, update };
