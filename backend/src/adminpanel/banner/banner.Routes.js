const express = require("express");
const c = require("./banner.Controller");

const router = express.Router();

router.get("/", c.list);
router.post("/", c.create);
router.get("/:id", c.getById);
router.put("/:id", c.update);
router.patch("/:id/active", c.setActive);
router.delete("/:id", c.remove);

module.exports = router;
