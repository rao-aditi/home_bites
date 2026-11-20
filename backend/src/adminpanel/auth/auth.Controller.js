const asyncHandler = require("../../middleware/asyncHandler");
const service = require("./auth.Service");
const { loginSchema } = require("./auth.validator");

const login = asyncHandler(async (req, res) => {
  res.json(await service.login(loginSchema.parse(req.body)));
});

const me = asyncHandler(async (req, res) => res.json({ user: req.user }));

module.exports = { login, me };
