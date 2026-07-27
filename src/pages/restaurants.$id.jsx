import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiClock, FiMapPin, FiSearch } from "react-icons/fi";
import { restaurants, foods } from "@/data/mockData";
import { FoodCard } from "@/components/cards/FoodCard";

export default function RestaurantDetails() {
  const { id } = useParams();
  const r = restaurants.find((x) => x.id === id) || restaurants[0];
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const menu = foods
    .filter((f) => f.restaurantId === r.id)
    .filter(
      (f) =>
        (tab === "all" ||
          (tab === "veg" && f.isVeg) ||
          (tab === "nonveg" && !f.isVeg) ||
          (tab === "best" && f.isBestseller)) &&
        (!q || f.name.toLowerCase().includes(q.toLowerCase())),
    );

  return (
    <div>
      <div className="relative h-56 md:h-80">
        <img src={r.banner} alt={r.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="mx-auto -mt-24 max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-card p-6 shadow-elegant ring-1 ring-border/40 md:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold md:text-4xl">{r.name}</h1>
              <p className="mt-1 text-muted-foreground">{r.cuisines.join(" • ")}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <FiMapPin /> {r.address}
              </p>
            </div>
            <div className="rounded-2xl bg-success/10 p-4 text-success">
              <div className="flex items-center gap-1 text-xl font-extrabold">
                <FiStar className="fill-current" /> {r.rating}
              </div>
              <div className="text-xs">{r.reviews}+ reviews</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold">
              <FiClock /> {r.deliveryTime} min
            </span>
            <span className="font-semibold">${(r.priceForTwo / 20) | 0} for two</span>
            <span className="font-semibold">{r.distance} km away</span>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${r.isOpen ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
            >
              {r.isOpen ? "OPEN NOW" : "CLOSED"}
            </span>
          </div>
          {r.offers.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
              {r.offers.map((o) => (
                <div
                  key={o}
                  className="shrink-0 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary"
                >
                  🎁 {o}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {[
              { k: "all", l: "All" },
              { k: "best", l: "Bestseller" },
              { k: "veg", l: "Veg" },
              { k: "nonveg", l: "Non-Veg" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${tab === t.k ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-extrabold">Menu</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((f, i) => (
            <FoodCard key={f.id} f={f} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
