import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchCategories } from "@/store/slice/CustomerSlice/categorySlice";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, loaded, error } = useSelector((state) => state.customerCategory);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchCategories());

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Explore by category</h1>
      <p className="mt-2 text-muted-foreground">Find exactly what you're craving.</p>

      {isError ? (
        <div className="mt-8">
          <ErrorState message="Couldn't load categories." onRetry={refetch} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))
            : categories.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/menu?category=${encodeURIComponent(c.id)}`}
                    className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border/40 hover:shadow-elegant"
                  >
                    <div className="grid">
                      <img src={c.image} alt={c.name} className="h-28 w-28 object-contain" />
                    </div>
                    <span className="font-bold">{c.name}</span>
                  </Link>
                </motion.div>
              ))}
        </div>
      )}
    </div>
  );
}
