const { requireAuth } = require("../../middleware/auth");
const { ApiError } = require("../../middleware/errorHandler");

// requireAuth loads the user fresh from the database, so `req.user.role` is the
// stored role — never anything supplied by the client.
function assertAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required."));
  }
  next();
}

const requireAdmin = [requireAuth, assertAdmin];

module.exports = { requireAdmin };
