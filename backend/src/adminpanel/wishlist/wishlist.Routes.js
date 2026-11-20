const express = require("express");
const c = require("./wishlist.Controller");

const router = express.Router();

router.get("/stats", c.stats);
router.get("/", c.list);

module.exports = router;
