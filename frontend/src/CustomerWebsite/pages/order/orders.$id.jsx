import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder, updateOrderStatus } from "@/store/slice/CustomerSlice/orderSlice";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

const steps = [
  { k: "placed", l: "Order placed" },
  { k: "accepted", l: "Restaurant accepted" },
  { k: "preparing", l: "Preparing your food" },
  { k: "ready", l: "Food is ready" },
  { k: "assigned", l: "Delivery partner assigned" },
  { k: "out", l: "Out for delivery" },
  { k: "delivered", l: "Delivered" },
];

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order: storedOrder, orderError } = useSelector((state) => state.customerOrder);
  // Only show the stored order if it is the one in the URL.
  const order = storedOrder?.id === id ? storedOrder : undefined;
  const isLoading = !order && !orderError;
  const isError = Boolean(orderError);
  const refetch = () => dispatch(fetchOrder(id));

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);
  const [stepIdx, setStepIdx] = useState(0);
  const initialized = useRef(false);

  // Initialize progress from the REAL fetched order.status so a refresh
  // mid-tracking doesn't reset back to step 0.
  useEffect(() => {
    if (!order || initialized.current) return;
    const idx = steps.findIndex((s) => s.k === order.status);
    setStepIdx(idx >= 0 ? idx : 0);
    initialized.current = true;
  }, [order]);

  useEffect(() => {
    if (!order || stepIdx >= steps.length - 1) return;
    const t = setInterval(() => {
      setStepIdx((s) => {
        const next = Math.min(s + 1, steps.length - 1);
        if (next !== s) {
          dispatch(updateOrderStatus({ id: order.id, status: steps[next].k }));
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, stepIdx]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center md:px-6">
        {isError ? (
          <ErrorState message="Couldn't load this order." onRetry={refetch} />
        ) : (
          <>
            <div className="text-6xl">📭</div>
            <p className="mt-4 font-bold">Order not found</p>
          </>
        )}
        <Link to="/orders" className="mt-4 inline-flex text-primary">
          Back to orders
        </Link>
      </div>
    );
  }

  const progress = (stepIdx / (steps.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link to="/orders" className="text-sm text-muted-foreground hover:text-primary">
        ← All orders
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold">Tracking order #{order.id}</h1>

      <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/40 md:p-8">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-accent">
          <motion.div
            className="h-full gradient-warm"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <ol className="space-y-4">
          {steps.map((s, i) => {
            const done = i <= stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s.k} className="flex items-center gap-4">
                <motion.div
                  animate={active ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
                  className={`grid h-9 w-9 place-items-center rounded-full ${done ? "gradient-warm text-primary-foreground shadow-glow" : "bg-accent text-muted-foreground"}`}
                >
                  {done ? <FiCheck /> : i + 1}
                </motion.div>
                <div>
                  <div className={`font-semibold ${done ? "" : "text-muted-foreground"}`}>
                    {s.l}
                  </div>
                  {active && <div className="text-xs text-primary">In progress...</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/40">
        <div className="font-bold">Order items</div>
        <div className="mt-2 space-y-1">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span>
                {it.quantity}× {it.name}
              </span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
