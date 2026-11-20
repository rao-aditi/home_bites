import { motion } from "framer-motion";
import { FiStar, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slice/CustomerSlice/authSlice";
import { addToCart, updateCartItem } from "@/store/slice/CustomerSlice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/CustomerSlice/wishlistSlice";
import { QuantityStepper } from "@/CustomerWebsite/components/shared/QuantityStepper";
import { BestsellerBadge } from "@/CustomerWebsite/components/shared/BestsellerBadge";

export function FoodCard({ f, i = 0 }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Cart and wishlist are loaded once by AppShell; every card just reads them.
  const cart = useSelector((state) => state.customerCart.cart);
  const wishlist = useSelector((state) => state.customerWishlist.wishlist);

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
      toast.success(`${f.name} added to cart`);
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
        toast("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ foodId: f.id })).unwrap();
        toast("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.03, duration: 0.4 }}
      className="group overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/40 transition hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/food/${f.id}`}>
          <img
            src={f.image}
            alt={f.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </Link>
        <button
          onClick={toggleWish}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <FiHeart className={wished ? "fill-primary text-primary" : ""} />
        </button>
        <div className="absolute left-3 top-3 flex gap-1">
          <span
            className={`grid h-5 w-5 place-items-center rounded-sm border-2 ${f.isVeg ? "border-success" : "border-destructive"} bg-background`}
          >
            <span className={`h-2 w-2 rounded-full ${f.isVeg ? "bg-success" : "bg-destructive"}`} />
          </span>
          {f.isBestseller && <BestsellerBadge />}
        </div>
        {f.isAvailable === false && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-bold">{f.name}</h3>
          <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-success">
            <FiStar className="fill-current" /> {f.rating}
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{f.description}</p>
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-lg font-extrabold">${f.price}</div>
            {f.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">${f.originalPrice}</div>
            )}
          </div>
          {f.isAvailable === false ? (
            <span className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-muted-foreground">
              Unavailable
            </span>
          ) : cartItem ? (
            <QuantityStepper quantity={cartItem.quantity} onIncrement={inc} onDecrement={dec} />
          ) : (
            <button
              onClick={add}
              className="rounded-full gradient-warm px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:shadow-glow active:scale-95"
            >
              ADD +
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
