import { Link, useNavigate } from "react-router-dom";
import { useApp, cartTotal } from "@/context/AppContext";
import { useState } from "react";
import { FiMapPin, FiClock, FiEdit2 } from "react-icons/fi";

export default function CheckoutPage() {
  const { state } = useApp();
  const nav = useNavigate();
  const [slot, setSlot] = useState("now");
  const def = state.addresses.find((a) => a.isDefault) || state.addresses[0];
  const subtotal = cartTotal(state.cart);
  if (state.cart.length === 0) {
    nav("/cart");
    return null;
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <h1 className="text-3xl font-extrabold">Checkout</h1>

        <section className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <FiMapPin className="mt-1 text-primary" />
              <div>
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  Deliver to • {def?.label}
                </div>
                {def ? (
                  <div className="mt-1 font-semibold">
                    {def.line1}, {def.city}
                  </div>
                ) : (
                  <div>No address</div>
                )}
                {def?.phone && <div className="text-sm text-muted-foreground">{def.phone}</div>}
              </div>
            </div>
            <Link
              to="/addresses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <FiEdit2 /> Change
            </Link>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <div className="mb-3 flex items-center gap-2 font-bold">
            <FiClock /> Delivery slot
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { k: "now", l: "ASAP", s: "30 min" },
              { k: "1", l: "In 1 hr", s: "" },
              { k: "2", l: "In 2 hrs", s: "" },
              { k: "sched", l: "Schedule", s: "Later" },
            ].map((s) => (
              <button
                key={s.k}
                onClick={() => setSlot(s.k)}
                className={`rounded-2xl border p-3 text-sm font-semibold transition ${slot === s.k ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
              >
                <div>{s.l}</div>
                {s.s && <div className="text-xs text-muted-foreground">{s.s}</div>}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <div className="mb-3 font-bold">Order items ({state.cart.length})</div>
          <div className="space-y-2">
            {state.cart.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span>
                  {c.quantity} × {c.name}
                </span>
                <span className="font-semibold">${(c.price * c.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/40">
          <h3 className="font-bold">Order summary</h3>
          <div className="mt-3 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes & fees</span>
            <span>${(subtotal * 0.05 + 2.49).toFixed(2)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span>${(subtotal + subtotal * 0.05 + 2.49).toFixed(2)}</span>
          </div>
          <button
            onClick={() => nav("/payment")}
            className="mt-5 w-full rounded-full gradient-warm py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow"
          >
            Proceed to payment
          </button>
        </div>
      </aside>
    </div>
  );
}
