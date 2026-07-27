import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "ORD123456";
  const eta = 25 + Math.floor(Math.random() * 15);
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center md:px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className="mx-auto grid h-24 w-24 place-items-center rounded-full gradient-warm shadow-glow"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <FiCheck className="text-4xl text-primary-foreground" strokeWidth={3} />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-3xl font-extrabold"
      >
        Order placed! 🎉
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-muted-foreground"
      >
        Your order <span className="font-bold text-foreground">#{id ?? "—"}</span> is being
        prepared.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/40"
      >
        <div className="text-xs font-semibold text-muted-foreground">Estimated delivery</div>
        <div className="mt-1 text-2xl font-extrabold gradient-text">{eta} minutes</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        {id && (
          <Link
            to={`/orders/${id}`}
            className="rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground shadow-soft"
          >
            Track order
          </Link>
        )}
        <Link to="/" className="rounded-full border border-border px-6 py-3 font-bold">
          Continue shopping
        </Link>
      </motion.div>
    </div>
  );
}
