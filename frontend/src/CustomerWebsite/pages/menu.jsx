import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slice/CustomerSlice/categorySlice";
import { fetchFoods } from "@/store/slice/CustomerSlice/foodSlice";
import { FoodCard } from "@/CustomerWebsite/components/cards/FoodCard";
import { FoodGridSkeleton } from "@/CustomerWebsite/components/shared/FoodCardSkeleton";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const dispatch = useDispatch();
  const { categories, loaded: categoriesLoaded } = useSelector((state) => state.customerCategory);
  const { foods, loaded: foodsLoaded, loading: foodsFetching, error } = useSelector(
    (state) => state.customerFood,
  );
  const categoriesLoading = !categoriesLoaded;
  const foodsLoading = foodsFetching || !foodsLoaded;
  const isError = Boolean(error) && !foodsFetching;
  const refetch = () => dispatch(fetchFoods(activeCategory ? { category: activeCategory } : {}));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFoods(activeCategory ? { category: activeCategory } : {}));
  }, [dispatch, activeCategory]);

  const setCategory = (id) => {
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Our menu</h1>
      <p className="mt-2 text-muted-foreground">Everything we're cooking today, by category.</p>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary"
          }`}
        >
          All
        </button>
        {!categoriesLoading &&
          categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(String(c.id))}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === String(c.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
      </div>

      <div className="mt-8">
        {isError ? (
          <ErrorState message="Couldn't load the menu." onRetry={refetch} />
        ) : foodsLoading ? (
          <FoodGridSkeleton />
        ) : foods.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="text-6xl">🍽️</div>
            <p className="mt-3">No dishes in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {foods.map((f, i) => (
              <FoodCard key={f.id} f={f} i={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
