import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { restaurants, foods } from "@/data/mockData";
import { FoodCard } from "@/components/cards/FoodCard";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { FiSearch, FiTrendingUp, FiClock } from "react-icons/fi";

const trending = ["Pizza", "Biryani", "Sushi", "Burger", "Pasta", "Coffee"];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("foodly-recent-search") || "[]"));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (!q) return;
    const t = setTimeout(() => {
      try {
        const prev = JSON.parse(localStorage.getItem("foodly-recent-search") || "[]");
        const next = [q, ...prev.filter((x) => x !== q)].slice(0, 6);
        localStorage.setItem("foodly-recent-search", JSON.stringify(next));
        setRecent(next);
      } catch {
        /* noop */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [q]);

  const { matchingR, matchingF } = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return { matchingR: [], matchingF: [] };
    return {
      matchingR: restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.cuisines.some((c) => c.toLowerCase().includes(term)),
      ),
      matchingF: foods.filter((f) => f.name.toLowerCase().includes(term)),
    };
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search restaurants, dishes, cuisines..."
          className="w-full rounded-full border border-border bg-card py-4 pl-12 pr-4 text-base outline-none shadow-soft focus:border-primary focus:shadow-elegant"
        />
      </div>

      {!q && (
        <div className="mt-8 space-y-8">
          {recent.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-bold">
                <FiClock /> Recent searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQ(r)}
                    className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-primary"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              <FiTrendingUp /> Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {trending.map((r) => (
                <button
                  key={r}
                  onClick={() => setQ(r)}
                  className="rounded-full gradient-warm px-4 py-1.5 text-sm font-semibold text-primary-foreground"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {q && (
        <div className="mt-8 space-y-10">
          {matchingR.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">Restaurants ({matchingR.length})</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchingR.map((r, i) => (
                  <RestaurantCard key={r.id} r={r} i={i} />
                ))}
              </div>
            </section>
          )}
          {matchingF.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">Dishes ({matchingF.length})</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchingF.map((f, i) => (
                  <FoodCard key={f.id} f={f} i={i} />
                ))}
              </div>
            </section>
          )}
          {matchingR.length === 0 && matchingF.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <div className="text-6xl">🔍</div>
              <p className="mt-3">No results for "{q}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
