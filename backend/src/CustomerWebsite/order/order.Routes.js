const express = require("express");
const { createOrder, listOrders, getOrderById, updateOrderStatus } = require("./order.Controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
