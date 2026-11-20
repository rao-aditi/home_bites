const express = require("express");
const c = require("./dashboard.Controller");

const router = express.Router();

router.get("/", c.overview);

module.exports = router;
