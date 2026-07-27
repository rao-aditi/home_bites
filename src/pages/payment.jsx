import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp, cartTotal } from "@/context/AppContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const methods = [
  { id: "upi", label: "UPI", icon: "💸", note: "PhonePe, GPay, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", note: "Visa, Mastercard, Amex" },
  { id: "net", label: "Net Banking", icon: "🏦", note: "All major banks" },
  { id: "wallet", label: "Wallet", icon: "👛", note: "Paytm, Amazon Pay" },
  { id: "gpay", label: "Google Pay", icon: "🟢", note: "One-tap payment" },
  { id: "phonepe", label: "PhonePe", icon: "🟣", note: "Instant UPI" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", note: "Pay when you receive" },
];

export default function PaymentPage() {
  const { state, dispatch } = useApp();
  const [method, setMethod] = useState("upi");
  const nav = useNavigate();
  const subtotal = cartTotal(state.cart);
  const total = subtotal + subtotal * 0.05 + 2.49;
  if (state.cart.length === 0) {
    nav("/");
    return null;
  }

  const placeOrder = () => {
    const id = `ORD${Math.floor(Math.random() * 900000 + 100000)}`;
    dispatch({
      type: "ADD_ORDER",
      order: {
        id,
        total,
        status: "placed",
        createdAt: Date.now(),
        address: state.addresses.find((a) => a.isDefault) || state.addresses[0] || null,
        items: state.cart,
        restaurantName: state.cart[0]?.restaurantName || "Foodly Partner",
        method,
      },
    });
    toast.success("Order placed successfully! 🎉");
    nav(`/order-success?id=${id}`);
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-3xl font-extrabold">Payment method</h1>
        <div className="mt-6 space-y-2">
          {methods.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${method === m.id ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"}`}
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-2xl">
                {m.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.note}</div>
              </div>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border-2 ${method === m.id ? "border-primary" : "border-border"}`}
              >
                {method === m.id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <h3 className="font-bold">Amount to pay</h3>
          <div className="mt-3 text-4xl font-extrabold gradient-text">${total.toFixed(2)}</div>
          <div className="mt-3 text-xs text-muted-foreground">
            Includes taxes and delivery fees.
          </div>
          <button
            onClick={placeOrder}
            className="mt-6 w-full rounded-full gradient-warm py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow"
          >
            Place order
          </button>
          <div className="mt-3 text-center text-xs text-muted-foreground">🔒 Secure payment</div>
        </div>
      </aside>
    </div>
  );
}
