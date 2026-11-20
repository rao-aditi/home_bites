import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchOrders } from "@/store/slice/CustomerSlice/orderSlice";
import { addToCart } from "@/store/slice/CustomerSlice/cartSlice";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loaded, error } = useSelector((state) => state.customerOrder);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchOrders());

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const reorder = async (order) => {
    try {
      await Promise.all(
        order.items.map((item) =>
          dispatch(addToCart({ foodId: item.foodId, quantity: item.quantity })).unwrap(),
        ),
      );
      toast.success("Items added to your cart");
    } catch {
      toast.error("Couldn't reorder — some items may be unavailable");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Skeleton className="h-10 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorState message="Couldn't load your orders." onRetry={refetch} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <div className="text-7xl">📦</div>
        <h1 className="mt-4 text-3xl font-extrabold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">Your delicious history starts here.</p>
        <Link
          to="/menu"
          className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
        >
          Order now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold">My orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">
                  #{o.id} • {new Date(o.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {o.items.map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold">${o.total.toFixed(2)}</div>
                <div
                  className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${o.status === "delivered" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}
                >
                  {o.status.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/orders/${o.id}`}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-bold hover:border-primary"
              >
                Track
              </Link>
              <button
                onClick={() => reorder(o)}
                className="rounded-full gradient-warm px-4 py-1.5 text-xs font-bold text-primary-foreground"
              >
                Reorder
              </button>
              <button className="rounded-full border border-border px-4 py-1.5 text-xs font-bold hover:border-primary">
                Rate order
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
