const prisma = require("../../config/db");

// The single Business row doubles as the website settings record.
const get = () => prisma.business.findFirst();

async function update(data) {
  const current = await prisma.business.findFirst();
  return current
    ? prisma.business.update({ where: { id: current.id }, data })
    : prisma.business.create({ data });
}

module.exports = { get, update };
