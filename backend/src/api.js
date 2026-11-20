const express = require("express");

const customerRouter = require("./CustomerWebsite");
const { adminRouter, publicRouter } = require("./adminpanel");

// Single API entry point, mounted at /api by app.js.
const router = express.Router();

// Customer Website
router.use(customerRouter);

// Admin Panel
router.use("/admin", adminRouter);
// Admin-managed content served to the customer site (banners, sections, reviews)
router.use("/", publicRouter);

module.exports = router;
