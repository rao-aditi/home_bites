
const express = require("express");

const { requireAdmin } = require("../middleware/requireAdmin");
const { requireAuth } = require("../../middleware/auth");

const authRoutes = require("../auth/auth.Routes");
const dashboardRoutes = require("../dashboard/dashboard.Routes");
const uploadRoutes = require("../upload/upload.Routes");
const categoryRoutes = require("../category/category.Routes");
const foodRoutes = require("../food/food.Routes");
const offerRoutes = require("../offer/offer.Routes");
const bannerRoutes = require("../banner/banner.Routes");
const sectionRoutes = require("../section/section.Routes");
const orderRoutes = require("../order/order.Routes");
const customerRoutes = require("../customer/customer.Routes");
const wishlistRoutes = require("../wishlist/wishlist.Routes");
const reviewRoutes = require("../review/review.Routes");
const settingsRoutes = require("../settings/settings.Routes");

const bannerController = require("../banner/banner.Controller");
const sectionController = require("../section/section.Controller");
const reviewController = require("../review/review.Controller");

// Mounted at /api/admin
const adminRouter = express.Router();
adminRouter.use("/auth", authRoutes); // /auth/login is public; /auth/me guards itself
adminRouter.use(requireAdmin); // everything below requires an admin
adminRouter.use("/dashboard", dashboardRoutes);
adminRouter.use("/upload", uploadRoutes);
adminRouter.use("/categories", categoryRoutes);
adminRouter.use("/foods", foodRoutes);
adminRouter.use("/offers", offerRoutes);
adminRouter.use("/banners", bannerRoutes);
adminRouter.use("/homepage-sections", sectionRoutes);
adminRouter.use("/orders", orderRoutes);
adminRouter.use("/customers", customerRoutes);
adminRouter.use("/wishlist", wishlistRoutes);
adminRouter.use("/reviews", reviewRoutes);
adminRouter.use("/settings", settingsRoutes);

// Mounted at /api — admin-managed content served to the customer site
const publicRouter = express.Router();
publicRouter.get("/banners", bannerController.listPublic);
publicRouter.get("/homepage-sections", sectionController.listPublic);
publicRouter.get("/foods/:id/reviews", reviewController.listForFood);
publicRouter.post("/foods/:id/reviews", requireAuth, reviewController.upsertForFood);

module.exports = { adminRouter, publicRouter };
