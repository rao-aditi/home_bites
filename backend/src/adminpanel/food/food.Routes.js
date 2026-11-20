const express = require("express");
const c = require("./food.Controller");

const router = express.Router();

router.get("/", c.list);
router.post("/", c.create);
router.get("/:id", c.getById);
router.put("/:id", c.update);
router.patch("/:id/flags", c.setFlags);
router.delete("/:id", c.remove);

module.exports = router;
