const express = require("express");
const { listFoods, getFoodById } = require("./food.Controller");

const router = express.Router();

router.get("/", listFoods);
router.get("/:id", getFoodById);

module.exports = router;
