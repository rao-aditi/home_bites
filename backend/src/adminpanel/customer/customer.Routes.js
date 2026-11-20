const express = require("express");
const c = require("./customer.Controller");

const router = express.Router();

router.get("/", c.list);
router.get("/:id", c.getById);
router.patch("/:id/active", c.setActive);

module.exports = router;
