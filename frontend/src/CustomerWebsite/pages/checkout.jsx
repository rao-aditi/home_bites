import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiClock, FiEdit2 } from "react-icons/fi";
import { fetchCart } from "@/store/slice/CustomerSlice/cartSlice";
import { fetchAddresses } from "@/store/slice/CustomerSlice/addressSlice";
import { calcOrderSummary } from "@/CustomerWebsite/lib/orderCalc";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const nav = useNavigate();
  const location = useLocation();
  // Carried forward from the cart page (tip chosen, coupon applied there).
  const { tip = 0, discount = 0, couponCode = null } = location.state || {};

  const dispatch = useDispatch();
  const { cart, loaded: cartLoaded, error: cartError } = useSelector((state) => state.customerCart);
  const { addresses, loaded: addressesLoaded, error: addressesError } = useSelector(
    (state) => state.customerAddress,
  );
  const cartLoading = !cartLoaded && !cartError;
  const addressesLoading = !addressesLoaded && !addressesError;
  const isError = (!cartLoaded && Boolean(cartError)) || (!addressesLoaded && Boolean(addressesError));
  const refetch = () => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  };

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);
  const [slot, setSlot] = useState("now");

  const def = addresses.find((a) => a.isDefault) || addresses[0];

  const items = cart.map((c) => ({
    price: c.food?.price ?? 0,
    quantity: c.quantity,
    name: c.food?.name,
  }));
  const summary = calcOrderSummary({ items, tip, discount });

  useEffect(() => {
    if (!cartLoading && items.length === 0) nav("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartLoading, items.length]);

  if (cartLoading || addressesLoading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_360px]">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorState message="Couldn't load checkout." onRetry={refetch} />
      </div>
    );
  }

  if (items.length === 0) return null;

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
                  <div>No address saved yet</div>
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
          <div className="mb-3 font-bold">Order items ({items.length})</div>
          <div className="space-y-2">
            {items.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
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
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxes & fees</span>
            <span>
              ${(summary.gst + summary.deliveryFee + summary.platformFee + summary.packagingFee).toFixed(2)}
            </span>
          </div>
          {summary.tip > 0 && (
            <div className="flex justify-between text-sm">
              <span>Delivery tip</span>
              <span>${summary.tip.toFixed(2)}</span>
            </div>
          )}
          {summary.discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Discount {couponCode && `(${couponCode})`}</span>
              <span>-${summary.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span>${summary.total.toFixed(2)}</span>
          </div>
          <button
            disabled={!def}
            onClick={() =>
              nav("/payment", { state: { tip, discount, couponCode, addressId: def?.id } })
            }
            className="mt-5 w-full rounded-full gradient-warm py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow disabled:opacity-50"
          >
            Proceed to payment
          </button>
          {!def && (
            <p className="mt-2 text-center text-xs text-destructive">
              Add a delivery address to continue.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
