import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiTrendingUp, FiClock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "@/store/slice/CustomerSlice/foodSlice";
import { fetchCategories } from "@/store/slice/CustomerSlice/categorySlice";
import { FoodCard } from "@/CustomerWebsite/components/cards/FoodCard";
import { FoodGridSkeleton } from "@/CustomerWebsite/components/shared/FoodCardSkeleton";

const trending = ["Pizza", "Biryani", "Burger", "Pasta", "Coffee", "Dessert"];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("homebites-recent-search") || "[]"));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (!q) return;
    const t = setTimeout(() => {
      try {
        const prev = JSON.parse(localStorage.getItem("homebites-recent-search") || "[]");
        const next = [q, ...prev.filter((x) => x !== q)].slice(0, 6);
        localStorage.setItem("homebites-recent-search", JSON.stringify(next));
        setRecent(next);
      } catch {
        /* noop */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [q]);

  const dispatch = useDispatch();
  const { foods, loading: isFetching } = useSelector((state) => state.customerFood);
  const categories = useSelector((state) => state.customerCategory.categories);

  useEffect(() => {
    if (q) dispatch(fetchFoods({ search: q }));
  }, [dispatch, q]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const matchingCategories = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return [];
    return categories.filter((c) => c.name.toLowerCase().includes(term));
  }, [q, categories]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search dishes or categories..."
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
          {matchingCategories.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">Categories ({matchingCategories.length})</h2>
              <div className="flex flex-wrap gap-2">
                {matchingCategories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/menu?category=${encodeURIComponent(c.id)}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-xl font-extrabold">Dishes {foods.length > 0 && `(${foods.length})`}</h2>
            {isFetching ? (
              <FoodGridSkeleton count={4} />
            ) : foods.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {foods.map((f, i) => (
                  <FoodCard key={f.id} f={f} i={i} />
                ))}
              </div>
            ) : matchingCategories.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <div className="text-6xl">🔍</div>
                <p className="mt-3">No results for "{q}"</p>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
