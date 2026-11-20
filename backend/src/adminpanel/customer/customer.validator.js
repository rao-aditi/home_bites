const { z } = require("zod");

const activeSchema = z.object({ isActive: z.boolean() });

module.exports = { activeSchema };
