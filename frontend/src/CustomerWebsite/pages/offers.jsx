import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { fetchOffers } from "@/store/slice/CustomerSlice/offerSlice";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function OffersPage() {
  const dispatch = useDispatch();
  const { offers, loaded, error } = useSelector((state) => state.customerOffer);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchOffers());

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Offers & deals</h1>
      <p className="mt-2 text-muted-foreground">Tap a coupon to copy the code.</p>

      {isError ? (
        <div className="mt-8">
          <ErrorState message="Couldn't load offers." onRetry={refetch} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))
            : offers.map((o, i) => (
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
      )}
    </div>
  );
}
