import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { foods, restaurants } from "@/data/mockData";
import { motion } from "framer-motion";
import { FiStar, FiHeart, FiPlus, FiMinus } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function FoodDetails() {
  const { id } = useParams();
  const f = foods.find((x) => x.id === id) || foods[0];
  const restaurant = restaurants.find((r) => r.id === f.restaurantId);
  const { state, dispatch } = useApp();
  const inCart = state.cart.find((c) => c.id === f.id);
  const wished = state.wishlist.some((w) => w.id === f.id);

  useEffect(() => {
    dispatch({ type: "VIEW", id: f.id });
  }, [f.id, dispatch]);

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
            {f.isBestseller && (
              <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black">
                ★ BESTSELLER
              </span>
            )}
          </div>
          <h1 className="mt-3 text-4xl font-extrabold">{f.name}</h1>
          {restaurant && (
            <Link
              to="/restaurants/$id"
              params={{ id: restaurant.id }}
              className="mt-1 text-muted-foreground hover:text-primary"
            >
              at {restaurant.name}
            </Link>
          )}
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
            {inCart ? (
              <div className="flex items-center gap-2 rounded-full bg-primary p-1.5 text-primary-foreground">
                <button
                  onClick={() => dispatch({ type: "DEC", id: f.id })}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/20"
                >
                  <FiMinus />
                </button>
                <span className="min-w-8 text-center font-bold">{inCart.quantity}</span>
                <button
                  onClick={() => dispatch({ type: "INC", id: f.id })}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/20"
                >
                  <FiPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  dispatch({ type: "ADD_CART", item: f });
                  toast.success("Added to cart");
                }}
                className="rounded-full gradient-warm px-8 py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow"
              >
                Add to cart
              </button>
            )}
            <button
              onClick={() => {
                dispatch({ type: "TOGGLE_WISH", item: f });
                toast(wished ? "Removed" : "Wishlisted ❤️");
              }}
              className="grid h-12 w-12 place-items-center rounded-full border border-border hover:bg-accent"
            >
              <FiHeart className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
