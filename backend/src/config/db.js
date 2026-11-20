const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app (and across nodemon reloads
// in dev) instead of opening a new connection pool per import.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
