const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");

// Lightweight typed error controllers can throw to get a specific status code
// out of the centralized handler below, e.g. `throw new ApiError(404, "Food not found")`.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
}

// Must be registered last, with 4 args, for Express to treat it as an error handler.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join(".") || "value"}: ${i.message}`).join("; ");
    return res.status(400).json({ message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : err.meta?.target;
      return res.status(409).json({ message: `A record with this ${target || "value"} already exists.` });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Record not found." });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Related record not found." });
    }
    return res.status(400).json({ message: "Database request error." });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  console.error(err);
  const status = err.statusCode || 500;
  const message = status === 500 ? "Internal server error." : err.message;
  return res.status(status).json({ message });
}

module.exports = { errorHandler, notFoundHandler, ApiError };
