import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp, cartTotal } from "@/context/AppContext";
import { FiMinus, FiPlus, FiTrash2, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CartPage() {
  const { state, dispatch } = useApp();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const navigate = useNavigate();

  const subtotal = cartTotal(state.cart);
  const gst = subtotal * 0.05;
  const delivery = subtotal > 20 ? 0 : 2.99;
  const platform = 0.99;
  const packaging = 1.5;
  const total = Math.max(0, subtotal + gst + delivery + platform + packaging + tip - discount);

  const applyCoupon = () => {
    if (!coupon) return;
    const map = {
      WELCOME50: subtotal * 0.5,
      FREEDEL: delivery,
      WEEKEND25: subtotal * 0.25,
      SUPER40: subtotal * 0.4,
    };
    const d = map[coupon.toUpperCase()];
    if (d) {
      setDiscount(d);
      toast.success(`Coupon applied! You saved $${d.toFixed(2)}`);
    } else {
      toast.error("Invalid coupon");
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <div className="text-7xl">🛒</div>
        <h1 className="mt-4 text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something delicious.</p>
        <Link
          to="/restaurants"
          className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-3xl font-extrabold">Your cart ({state.cart.length})</h1>
        <div className="mt-6 space-y-3">
          {state.cart.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border/40"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{c.name}</div>
                <div className="text-sm text-muted-foreground">${c.price} each</div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground">
                <button
                  onClick={() => dispatch({ type: "DEC", id: c.id })}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20"
                >
                  <FiMinus size={14} />
                </button>
                <span className="min-w-6 text-center text-sm font-bold">{c.quantity}</span>
                <button
                  onClick={() => dispatch({ type: "INC", id: c.id })}
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20"
                >
                  <FiPlus size={14} />
                </button>
              </div>
              <div className="w-20 text-right font-bold">${(c.price * c.quantity).toFixed(2)}</div>
              <button
                onClick={() => dispatch({ type: "REMOVE_CART", id: c.id })}
                className="text-muted-foreground hover:text-destructive"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border/40">
          <div className="mb-2 font-bold">Tip your delivery partner 🛵</div>
          <div className="flex gap-2">
            {[0, 1, 2, 5].map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${tip === t ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {t === 0 ? "No tip" : `$${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <h3 className="mb-4 font-bold">Bill details</h3>
          {[
            { l: "Item total", v: subtotal },
            { l: "GST (5%)", v: gst },
            { l: "Delivery fee", v: delivery },
            { l: "Platform fee", v: platform },
            { l: "Packaging", v: packaging },
            ...(tip > 0 ? [{ l: "Delivery tip", v: tip }] : []),
            ...(discount > 0 ? [{ l: "Discount", v: -discount }] : []),
          ].map((row) => (
            <div key={row.l} className="flex justify-between py-1 text-sm">
              <span className={row.l === "Discount" ? "text-success" : "text-muted-foreground"}>
                {row.l}
              </span>
              <span className={row.l === "Discount" ? "text-success" : ""}>
                {row.v < 0 ? "-" : ""}${Math.abs(row.v).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border/40">
          <div className="flex items-center gap-2 font-bold">
            <FiTag /> Have a coupon?
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter code"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={applyCoupon}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Apply
            </button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Try: WELCOME50, FREEDEL, WEEKEND25
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/checkout" })}
          className="w-full rounded-full gradient-warm py-4 text-base font-bold text-primary-foreground shadow-soft hover:shadow-glow"
        >
          Checkout • ${total.toFixed(2)}
        </button>
        <button
          onClick={() => {
            dispatch({ type: "CLEAR_CART" });
            toast.success("Cart cleared");
          }}
          className="w-full text-sm text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}
