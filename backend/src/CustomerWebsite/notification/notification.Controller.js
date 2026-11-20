const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(notifications);
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notification || notification.userId !== req.user.id) {
    throw new ApiError(404, "Notification not found.");
  }

  const updated = await prisma.notification.update({
    where: { id: notification.id },
    data: { unread: false },
  });
  res.json(updated);
});

module.exports = { listNotifications, markRead };
