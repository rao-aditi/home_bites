import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiClock } from "react-icons/fi";

export function RestaurantCard({ r, i = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.03, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/restaurants/${r.id}`}
        className="group block overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/40 transition hover:shadow-elegant"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={r.image}
            alt={r.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {r.discount && (
            <div className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-soft">
              {r.discount}
            </div>
          )}
          <div className="absolute right-3 top-3 flex gap-1">
            {r.isBestseller && (
              <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black">
                BESTSELLER
              </span>
            )}
            {r.isVeg && (
              <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                PURE VEG
              </span>
            )}
            {!r.isOpen && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                CLOSED
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-bold">{r.name}</h3>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
              <FiStar className="fill-current" /> {r.rating}
            </div>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">{r.cuisines.join(" • ")}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FiClock /> {r.deliveryTime} min
            </span>
            <span>{r.distance} km</span>
            <span>${(r.priceForTwo / 20) | 0} for two</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
