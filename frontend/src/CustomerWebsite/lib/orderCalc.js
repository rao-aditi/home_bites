// Shared display-total formula used by cart.jsx, checkout.jsx and payment.jsx
// so the three pages never disagree on what the bill looks like again.
//
// This is DISPLAY-ONLY. The amount actually charged always comes back from
// the backend's `POST /orders` response (it recomputes server-side from the
// live cart + DB prices) — nothing here is ever re-sent as a trusted total.

export const GST_RATE = 0.05;
export const FREE_DELIVERY_THRESHOLD = 20;
export const DELIVERY_FEE = 2.99;
export const PLATFORM_FEE = 0.99;
export const PACKAGING_FEE = 1.5;

export function cartSubtotal(items = []) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items = []) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Computes the full bill breakdown shown across cart/checkout/payment.
 * @param {Object} opts
 * @param {Array} opts.items - cart items with { price, quantity }
 * @param {number} [opts.tip]
 * @param {number} [opts.discount]
 */
export function calcOrderSummary({ items = [], tip = 0, discount = 0 } = {}) {
  const subtotal = cartSubtotal(items);
  const gst = subtotal * GST_RATE;
  const deliveryFee =
    subtotal === 0 || subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const platformFee = subtotal === 0 ? 0 : PLATFORM_FEE;
  const packagingFee = subtotal === 0 ? 0 : PACKAGING_FEE;
  const total = Math.max(
    0,
    subtotal + gst + deliveryFee + platformFee + packagingFee + tip - discount,
  );

  return {
    subtotal,
    gst,
    deliveryFee,
    platformFee,
    packagingFee,
    tip,
    discount,
    total,
  };
}
