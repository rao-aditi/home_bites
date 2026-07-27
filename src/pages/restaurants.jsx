import { useMemo, useState } from "react";
import { restaurants } from "@/data/mockData";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default RestaurantsPage;

const cuisines = [
  "Italian",
  "Indian",
  "Chinese",
  "Japanese",
  "Mexican",
  "American",
  "Thai",
  "Continental",
];
const sortOptions = [
  "Popularity",
  "Rating",
  "Delivery Time",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

function RestaurantsPage() {
  const [sort, setSort] = useState("Popularity");
  const [minRating, setMinRating] = useState(0);
  const [veg, setVeg] = useState(false);
  const [fast, setFast] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [cuisineFilter, setCuisineFilter] = useState([]);
  const [openMobile, setOpenMobile] = useState(false);

  const filtered = useMemo(() => {
    let list = restaurants.filter(
      (r) =>
        r.rating >= minRating &&
        (!veg || r.isVeg) &&
        (!fast || r.deliveryTime <= 30) &&
        (!offersOnly || r.discount) &&
        r.priceForTwo <= maxPrice &&
        (cuisineFilter.length === 0 || cuisineFilter.some((c) => r.cuisines.includes(c))),
    );
    switch (sort) {
      case "Rating":
        list = list.sort((a, b) => b.rating - a.rating);
        break;
      case "Delivery Time":
        list = list.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case "Price: Low to High":
        list = list.sort((a, b) => a.priceForTwo - b.priceForTwo);
        break;
      case "Price: High to Low":
        list = list.sort((a, b) => b.priceForTwo - a.priceForTwo);
        break;
    }
    return list;
  }, [sort, minRating, veg, fast, offersOnly, maxPrice, cuisineFilter]);

  const toggleC = (c) =>
    setCuisineFilter((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const FilterPanel = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 font-bold">Sort by</h3>
        <div className="space-y-1.5">
          {sortOptions.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                checked={sort === s}
                onChange={() => setSort(s)}
                className="accent-primary"
              />{" "}
              {s}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-bold">Quick filters</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Fast Delivery", v: fast, set: setFast },
            { label: "Pure Veg", v: veg, set: setVeg },
            { label: "Offers", v: offersOnly, set: setOffersOnly },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => f.set(!f.v)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${f.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-bold">
          Rating{" "}
          {minRating > 0 && <span className="text-xs text-muted-foreground">≥ {minRating}</span>}
        </h3>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={minRating}
          onChange={(e) => setMinRating(+e.target.value)}
          className="w-full accent-primary"
        />
      </div>
      <div>
        <h3 className="mb-3 font-bold">
          Max price for two{" "}
          <span className="text-xs text-muted-foreground">${(maxPrice / 20) | 0}</span>
        </h3>
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full accent-primary"
        />
      </div>
      <div>
        <h3 className="mb-3 font-bold">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => toggleC(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${cuisineFilter.includes(c) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Restaurants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} places delivering to you
          </p>
        </div>
        <button
          onClick={() => setOpenMobile(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold lg:hidden"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} r={r} i={i} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <div className="text-6xl">🍽️</div>
              <p className="mt-3">No restaurants match your filters.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setOpenMobile(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto h-full w-80 overflow-y-auto bg-background p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setOpenMobile(false)}>
                  <FiX />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
