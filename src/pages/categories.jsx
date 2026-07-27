import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/mockData";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">
        Explore by category
      </h1>
      <p className="mt-2 text-muted-foreground">
        Find exactly what you're craving.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }}
          >
            <Link
              to="/search"
              search={{ q: c.name }}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border/40 hover:shadow-elegant"
            >
              <div className="grid">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-28 w-28 object-contain"
                />
              </div>

              <span className="font-bold">{c.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}