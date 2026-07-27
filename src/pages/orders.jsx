import { Link, Outlet } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function OrdersLayout() {
  const { state, dispatch } = useApp();

  return (
    <ProtectedLayout>
      {state.orders.length === 0 ? (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
          <div className="text-7xl">📦</div>
          <h1 className="mt-4 text-3xl font-extrabold">No orders yet</h1>
          <p className="mt-2 text-muted-foreground">Your delicious history starts here.</p>
          <Link
            to="/restaurants"
            className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
          >
            Order now
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
          <h1 className="text-3xl font-extrabold">My orders</h1>
          <div className="mt-6 space-y-4">
            {state.orders.map((o, i) => (
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
                    <div className="mt-1 font-bold">{o.restaurantName}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
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
                    onClick={() => {
                      o.items.forEach((item) => dispatch({ type: "ADD_CART", item }));
                    }}
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
      )}
    </ProtectedLayout>
  );
}
