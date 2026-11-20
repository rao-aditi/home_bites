const express = require("express");
const c = require("./section.Controller");

const router = express.Router();

router.get("/", c.list);
router.post("/", c.create);
router.get("/:id", c.getById);
router.put("/:id", c.update);
router.patch("/:id/visible", c.setVisible);
router.delete("/:id", c.remove);

module.exports = router;
