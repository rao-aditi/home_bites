import { motion } from "framer-motion";
import { offers } from "@/data/mockData";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Offers & deals</h1>
      <p className="mt-2 text-muted-foreground">Tap a coupon to copy the code.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((o, i) => (
          <motion.button
            key={o.id}
            onClick={() => {
              navigator.clipboard?.writeText(o.code);
              toast.success(`Copied ${o.code}`);
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${o.color} p-7 text-left text-white shadow-elegant`}
          >
            <div className="text-xs font-semibold uppercase opacity-90">{o.subtitle}</div>
            <div className="mt-1 text-3xl font-extrabold">{o.title}</div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-white/60 px-4 py-2 text-sm font-bold">
              {o.code} <FiCopy />
            </div>
            <div className="absolute -bottom-8 -right-8 text-9xl opacity-20">🎁</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
