import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchFood } from "@/store/slice/CustomerSlice/foodSlice";
import { addToCart, updateCartItem } from "@/store/slice/CustomerSlice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/CustomerSlice/wishlistSlice";
import { selectIsAuthenticated } from "@/store/slice/CustomerSlice/authSlice";
import { addRecentlyViewed } from "@/store/slice/uiSlice";
import { QuantityStepper } from "@/CustomerWebsite/components/shared/QuantityStepper";
import { BestsellerBadge } from "@/CustomerWebsite/components/shared/BestsellerBadge";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

export default function FoodDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { food, foodError } = useSelector((state) => state.customerFood);
  const cart = useSelector((state) => state.customerCart.cart);
  const wishlist = useSelector((state) => state.customerWishlist.wishlist);

  // Only show the stored dish if it is the one in the URL.
  const f = food?.id === id ? food : undefined;
  const isLoading = !f && !foodError;
  const isError = Boolean(foodError);
  const refetch = () => dispatch(fetchFood(id));

  useEffect(() => {
    dispatch(fetchFood(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (f?.id) dispatch(addRecentlyViewed(f.id));
  }, [f?.id, dispatch]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !f) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorState message="Couldn't load this dish." onRetry={refetch} />
      </div>
    );
  }

  const cartItem = cart.find((c) => c.foodId === f.id);
  const wished = wishlist.some((w) => w.foodId === f.id);

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in first");
      return false;
    }
    return true;
  };

  const add = async () => {
    if (!requireAuth()) return;
    try {
      await dispatch(addToCart({ foodId: f.id, quantity: 1 })).unwrap();
      toast.success("Added to cart");
    } catch {
      toast.error("Couldn't add to cart");
    }
  };
  const inc = () => dispatch(updateCartItem({ id: cartItem.id, action: "inc" }));
  const dec = () => dispatch(updateCartItem({ id: cartItem.id, action: "dec" }));

  const toggleWish = async () => {
    if (!requireAuth()) return;
    try {
      if (wished) {
        await dispatch(removeFromWishlist(f.id)).unwrap();
        toast("Removed");
      } else {
        await dispatch(addToWishlist({ foodId: f.id })).unwrap();
        toast("Wishlisted ❤️");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square overflow-hidden rounded-3xl shadow-elegant"
        >
          <img src={f.image} alt={f.name} className="h-full w-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`grid h-5 w-5 place-items-center rounded-sm border-2 ${f.isVeg ? "border-success" : "border-destructive"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${f.isVeg ? "bg-success" : "bg-destructive"}`}
              />
            </span>
            {f.isBestseller && <BestsellerBadge />}
          </div>
          <h1 className="mt-3 text-4xl font-extrabold">{f.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-bold text-success">
              <FiStar className="fill-current" /> {f.rating}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">${f.price}</span>
              {f.originalPrice && (
                <span className="text-muted-foreground line-through">${f.originalPrice}</span>
              )}
            </div>
          </div>
          <p className="mt-5 text-muted-foreground">{f.description}</p>
          <div className="mt-8 flex items-center gap-3">
            {f.isAvailable === false ? (
              <span className="rounded-full bg-accent px-8 py-3 font-bold text-muted-foreground">
                Currently sold out
              </span>
            ) : cartItem ? (
              <QuantityStepper quantity={cartItem.quantity} onIncrement={inc} onDecrement={dec} size="md" />
            ) : (
              <button
                onClick={add}
                className="rounded-full gradient-warm px-8 py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow"
              >
                Add to cart
              </button>
            )}
            <button
              onClick={toggleWish}
              className="grid h-12 w-12 place-items-center rounded-full border border-border hover:bg-accent"
              aria-label="Toggle wishlist"
            >
              <FiHeart className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>
          <Link to="/menu" className="mt-6 text-sm font-semibold text-primary hover:underline">
            ← Back to menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
