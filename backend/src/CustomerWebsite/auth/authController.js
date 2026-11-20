const { z } = require("zod");
const prisma = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const { ApiError } = require("../../middleware/errorHandler");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signToken } = require("../../utils/jwt");

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

function toSafeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone },
  });

  const token = signToken({ userId: user.id });
  res.status(201).json({ user: toSafeUser(user), token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated. Please contact support.");
  }

  const token = signToken({ userId: user.id });
  res.json({ user: toSafeUser(user), token });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, login, me };
