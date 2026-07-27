import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { FoodCard } from "@/components/cards/FoodCard";

export default function WishlistPage() {
  const { state } = useApp();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold md:text-4xl">Your wishlist</h1>
      <p className="mt-2 text-muted-foreground">
        {state.wishlist.length} saved item{state.wishlist.length !== 1 && "s"}
      </p>
      {state.wishlist.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-7xl">💔</div>
          <p className="mt-4 text-lg font-bold">Nothing saved yet</p>
          <p className="text-muted-foreground">Tap the heart on any dish to save it here.</p>
          <Link
            to="/restaurants"
            className="mt-6 inline-flex rounded-full gradient-warm px-6 py-3 font-bold text-primary-foreground"
          >
            Explore restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {state.wishlist.map((f, i) => (
            <FoodCard key={f.id} f={f} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
