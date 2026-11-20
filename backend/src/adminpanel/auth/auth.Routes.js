const express = require("express");
const c = require("./auth.Controller");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", c.login); // the only unauthenticated admin route
router.get("/me", requireAdmin, c.me);

module.exports = router;
