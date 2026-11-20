import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "@/store/slice/CustomerSlice/cartSlice";
import { validateOffer } from "@/store/slice/CustomerSlice/offerSlice";
import { calcOrderSummary } from "@/CustomerWebsite/lib/orderCalc";
import { QuantityStepper } from "@/CustomerWebsite/components/shared/QuantityStepper";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, loaded, error } = useSelector((state) => state.customerCart);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchCart());

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const navigate = useNavigate();

  const items = cart.map((c) => ({
    id: c.id,
    foodId: c.foodId,
    name: c.food?.name,
    image: c.food?.image,
    price: c.food?.price ?? 0,
    quantity: c.quantity,
  }));

  const summary = calcOrderSummary({ items, tip, discount });

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const result = await dispatch(
        validateOffer({ code: coupon.toUpperCase(), subtotal: summary.subtotal }),
      ).unwrap();
      if (result?.valid) {
        setDiscount(result.discount || 0);
        setAppliedCoupon(coupon.toUpperCase());
        toast.success(`Coupon applied! You saved $${(result.discount || 0).toFixed(2)}`);
      } else {
        toast.error(result?.message || "Invalid coupon");
      }
    } catch {
      toast.error("Invalid coupon");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorState message="Couldn't load your cart." onRetry={refetch} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <div className="text-7xl">🛒</div>
        <h1 className="mt-4 text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something delicious.</p>
        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-3xl font-extrabold">Your cart ({items.length})</h1>
        <div className="mt-6 space-y-3">
          {items.map((c, i) => (
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
              <QuantityStepper
                quantity={c.quantity}
                onIncrement={() => dispatch(updateCartItem({ id: c.id, action: "inc" }))}
                onDecrement={() => dispatch(updateCartItem({ id: c.id, action: "dec" }))}
              />
              <div className="w-20 text-right font-bold">${(c.price * c.quantity).toFixed(2)}</div>
              <button
                onClick={async () => {
                  try {
                    await dispatch(removeCartItem(c.id)).unwrap();
                  } catch {
                    toast.error("Couldn't remove item");
                  }
                }}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove item"
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
            { l: "Item total", v: summary.subtotal },
            { l: "GST (5%)", v: summary.gst },
            { l: "Delivery fee", v: summary.deliveryFee },
            { l: "Platform fee", v: summary.platformFee },
            { l: "Packaging", v: summary.packagingFee },
            ...(summary.tip > 0 ? [{ l: "Delivery tip", v: summary.tip }] : []),
            ...(summary.discount > 0 ? [{ l: "Discount", v: -summary.discount }] : []),
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
            <span>${summary.total.toFixed(2)}</span>
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
          {appliedCoupon && (
            <div className="mt-2 text-xs font-semibold text-success">
              {appliedCoupon} applied
            </div>
          )}
        </div>

        <button
          onClick={() =>
            navigate("/checkout", { state: { tip, discount, couponCode: appliedCoupon } })
          }
          className="w-full rounded-full gradient-warm py-4 text-base font-bold text-primary-foreground shadow-soft hover:shadow-glow"
        >
          Checkout • ${summary.total.toFixed(2)}
        </button>
      </aside>
    </div>
  );
}
