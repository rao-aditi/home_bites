// What counts as "live" on the customer site. Shared so the customer-facing
// controllers and the homepage sections can never disagree.

// A food is visible when it AND its category are enabled.
const liveFoodWhere = () => ({ isActive: true, category: { is: { isActive: true } } });

// An offer is live when enabled and inside its optional start/expiry window.
const liveOfferWhere = (now = new Date()) => ({
  isActive: true,
  AND: [
    { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
    { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
  ],
});

// Why an offer cannot be used for this subtotal, or null if it can.
function offerProblem(offer, subtotal, now = new Date()) {
  if (!offer.isActive) return "This coupon is no longer active.";
  if (offer.startsAt && offer.startsAt > now) return "This coupon is not active yet.";
  if (offer.expiresAt && offer.expiresAt < now) return "This coupon has expired.";
  if (subtotal < offer.minOrderAmount) {
    return `Add items worth $${offer.minOrderAmount.toFixed(2)} or more to use this coupon.`;
  }
  return null;
}

module.exports = { liveFoodWhere, liveOfferWhere, offerProblem };
