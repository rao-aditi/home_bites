const express = require("express");
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require("./cart.Controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/", clearCart);
router.patch("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

module.exports = router;
