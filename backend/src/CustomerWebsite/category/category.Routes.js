const express = require("express");
const { listCategories } = require("./category.Controller");

const router = express.Router();

router.get("/", listCategories);

module.exports = router;
