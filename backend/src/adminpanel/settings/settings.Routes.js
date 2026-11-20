const express = require("express");
const c = require("./settings.Controller");

const router = express.Router();

router.get("/", c.get);
router.put("/", c.update);

module.exports = router;
