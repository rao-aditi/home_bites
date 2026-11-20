const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist } = require("./wishlist.Controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:foodId", removeFromWishlist);

module.exports = router;
