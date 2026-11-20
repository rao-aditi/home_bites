const express = require("express");
const { getBusiness } = require("./business.Controller");

const router = express.Router();

router.get("/", getBusiness);

module.exports = router;
