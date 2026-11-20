const express = require("express");
const { listNotifications, markRead } = require("./notification.Controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", listNotifications);
router.patch("/:id/read", markRead);

module.exports = router;
