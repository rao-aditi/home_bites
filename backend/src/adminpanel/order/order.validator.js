const { z } = require("zod");

// Stored values are the ones the customer app already understands. The admin UI
// labels them: placed=Pending, accepted=Confirmed, out=Out for Delivery.
const STATUSES = ["placed", "accepted", "preparing", "ready", "assigned", "out", "delivered", "cancelled"];
const TERMINAL = ["delivered", "cancelled"];

const statusSchema = z.object({ status: z.enum(STATUSES) });

module.exports = { STATUSES, TERMINAL, statusSchema };
