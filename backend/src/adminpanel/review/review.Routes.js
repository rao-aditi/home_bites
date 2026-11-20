const express = require("express");
const c = require("./review.Controller");

const router = express.Router();

router.get("/", c.list);
router.get("/:id", c.getById);
router.patch("/:id/hidden", c.setHidden);
router.delete("/:id", c.remove);

module.exports = router;
