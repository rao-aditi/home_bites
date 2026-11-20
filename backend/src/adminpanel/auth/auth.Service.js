const prisma = require("../../config/db");
const { ApiError } = require("../../middleware/errorHandler");
const { comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/jwt");

// Same JWT as the customer app, but only issued to users whose stored role is "admin".
// Customers get the same generic error as a wrong password, so the endpoint
// doesn't reveal which emails are admins.
async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await comparePassword(password, user.passwordHash));
  if (!valid || user.role !== "admin") {
    throw new ApiError(401, "Invalid admin credentials.");
  }
  if (!user.isActive) throw new ApiError(403, "This account has been deactivated.");

  const { passwordHash, ...safe } = user;
  return { user: safe, token: signToken({ userId: user.id }) };
}

module.exports = { login };
