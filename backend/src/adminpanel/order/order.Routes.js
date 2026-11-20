const express = require("express");
const c = require("./order.Controller");

const router = express.Router();

router.get("/", c.list);
router.get("/:id", c.getById);
router.patch("/:id/status", c.updateStatus);

module.exports = router;
