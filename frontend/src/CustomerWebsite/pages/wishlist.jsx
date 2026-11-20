import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/slice/CustomerSlice/wishlistSlice";
import { FoodCard } from "@/CustomerWebsite/components/cards/FoodCard";
import { FoodGridSkeleton } from "@/CustomerWebsite/components/shared/FoodCardSkeleton";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist, loaded, error } = useSelector((state) => state.customerWishlist);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchWishlist());

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  const foods = wishlist.map((w) => w.food).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Your wishlist</h1>
      <p className="mt-2 text-muted-foreground">
        {foods.length} saved item{foods.length !== 1 && "s"}
      </p>
      {isError ? (
        <div className="mt-8">
          <ErrorState message="Couldn't load your wishlist." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-8">
          <FoodGridSkeleton />
        </div>
      ) : foods.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-7xl">💔</div>
          <p className="mt-4 text-lg font-bold">Nothing saved yet</p>
          <p className="text-muted-foreground">Tap the heart on any dish to save it here.</p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
          >
            Explore the menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((f, i) => (
            <FoodCard key={f.id} f={f} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
