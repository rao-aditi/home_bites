// Server-authoritative order math. Mirrors the fee formula that used to be duplicated
// (and disagreed) across cart.jsx / checkout.jsx / payment.jsx on the frontend — this is
// now the single source of truth. Never trust a client-submitted total.

const GST_RATE = 0.05;
const PLATFORM_FEE = 0.99;
const PACKAGING_FEE = 1.5;
const FREE_DELIVERY_THRESHOLD = 20;

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * @param {Array<{price:number, quantity:number}>} items
 * @param {number} baseDeliveryFee - the business's configured delivery fee
 * @param {number} tip - client-selected tip (not a "price", trusted as-is)
 * @param {{discountType:string,value:number}|null} offer
 */
function computeOrderTotals({ items, baseDeliveryFee = 0, tip = 0, offer = null }) {
  const subtotal = round2(items.reduce((sum, it) => sum + it.price * it.quantity, 0));
  const gst = round2(subtotal * GST_RATE);
  const deliveryFee = subtotal > FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : round2(baseDeliveryFee);
  const platformFee = subtotal === 0 ? 0 : PLATFORM_FEE;
  const packagingFee = subtotal === 0 ? 0 : PACKAGING_FEE;

  let discount = 0;
  if (offer) {
    if (offer.discountType === "percent") {
      discount = round2(subtotal * (offer.value / 100));
    } else if (offer.discountType === "flat") {
      discount = round2(offer.value);
    } else if (offer.discountType === "free_delivery") {
      discount = deliveryFee;
    }
  }

  if (offer && offer.maxDiscount != null) {
    discount = Math.min(discount, offer.maxDiscount);
  }

  const safeTip = round2(Math.max(0, Number(tip) || 0));
  const total = round2(
    Math.max(0, subtotal + gst + deliveryFee + platformFee + packagingFee + safeTip - discount)
  );

  return { subtotal, gst, deliveryFee, platformFee, packagingFee, tip: safeTip, discount, total };
}

module.exports = {
  computeOrderTotals,
  GST_RATE,
  PLATFORM_FEE,
  PACKAGING_FEE,
  FREE_DELIVERY_THRESHOLD,
  round2,
};
