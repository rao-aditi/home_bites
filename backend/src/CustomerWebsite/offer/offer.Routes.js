const express = require("express");
const { listOffers, validateOffer } = require("./offer.Controller");

const router = express.Router();

router.get("/", listOffers);
router.post("/validate", validateOffer);

module.exports = router;
