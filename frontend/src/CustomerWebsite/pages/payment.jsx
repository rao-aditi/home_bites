import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchCart } from "@/store/slice/CustomerSlice/cartSlice";
import { createOrder } from "@/store/slice/CustomerSlice/orderSlice";
import { calcOrderSummary } from "@/CustomerWebsite/lib/orderCalc";
import { Skeleton } from "@/components/ui/skeleton";

const methods = [
  { id: "upi", label: "UPI", icon: "💸", note: "PhonePe, GPay, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: "💳", note: "Visa, Mastercard, Amex" },
  { id: "net", label: "Net Banking", icon: "🏦", note: "All major banks" },
  { id: "wallet", label: "Wallet", icon: "👛", note: "Paytm, Amazon Pay" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", note: "Pay when you receive" },
];

export default function PaymentPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { tip = 0, discount = 0, couponCode = null, addressId = null } = location.state || {};

  const dispatch = useDispatch();
  const { cart, loaded, error } = useSelector((state) => state.customerCart);
  const placing = useSelector((state) => state.customerOrder.creating);
  const isLoading = !loaded && !error;
  // Placing an order empties the cart on the server; don't treat that as "cart was empty".
  const placedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  const [method, setMethod] = useState("upi");

  const items = cart.map((c) => ({ price: c.food?.price ?? 0, quantity: c.quantity }));
  const summary = calcOrderSummary({ items, tip, discount });

  useEffect(() => {
    if (!isLoading && items.length === 0 && !placedRef.current) nav("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, items.length]);

  const placeOrder = async () => {
    if (!addressId) {
      toast.error("Please pick a delivery address first");
      nav("/checkout");
      return;
    }
    placedRef.current = true;
    try {
      // Server recomputes the total from the live cart + DB prices —
      // the client never sends (or trusts) a pre-computed total.
      const order = await dispatch(
        createOrder({
          addressId,
          paymentMethod: method,
          tip,
          couponCode,
        }),
      ).unwrap();
      toast.success("Order placed successfully! 🎉");
      nav(`/order-success?id=${order.id}`);
    } catch (err) {
      placedRef.current = false;
      toast.error(err || "Couldn't place your order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_340px]">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) return null;

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
          <div className="mt-3 text-4xl font-extrabold gradient-text">${summary.total.toFixed(2)}</div>
          <div className="mt-3 text-xs text-muted-foreground">
            Includes taxes, fees{summary.tip > 0 && " and tip"}.
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="mt-6 w-full rounded-full gradient-warm py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow disabled:opacity-50"
          >
            {placing ? "Placing order..." : "Place order"}
          </button>
          <div className="mt-3 text-center text-xs text-muted-foreground">🔒 Secure payment</div>
        </div>
      </aside>
    </div>
  );
}
