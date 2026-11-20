const express = require("express");

const authRoutes = require("./auth/authRoutes");
const businessRoutes = require("./business/business.Routes");
const categoryRoutes = require("./category/category.Routes");
const foodRoutes = require("./food/food.Routes");
const offerRoutes = require("./offer/offer.Routes");
const cartRoutes = require("./cart/cart.Routes");
const wishlistRoutes = require("./wishlist/wishlist.Routes");
const addressRoutes = require("./address/address.Routes");
const orderRoutes = require("./order/order.Routes");
const notificationRoutes = require("./notification/notification.Routes");

// Customer Website API. Mounted at /api by src/api.js.
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/business", businessRoutes);
router.use("/categories", categoryRoutes);
router.use("/foods", foodRoutes);
router.use("/offers", offerRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/addresses", addressRoutes);
router.use("/orders", orderRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
