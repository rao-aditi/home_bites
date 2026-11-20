const { verifyToken } = require("../utils/jwt");
const { ApiError } = require("./errorHandler");
const prisma = require("../config/db");
const asyncHandler = require("./asyncHandler");

// Requires a valid `Authorization: Bearer <token>` header. Attaches the authenticated
// user (minus passwordHash) to req.user for downstream controllers.
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication required.");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated. Please contact support.");
  }

  const { passwordHash, ...safeUser } = user;
  req.user = safeUser;
  next();
});

module.exports = { requireAuth };
