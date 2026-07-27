import { motion } from "framer-motion";
import { FiStar, FiHeart, FiPlus, FiMinus } from "react-icons/fi";
import toast from "react-hot-toast";

import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";

export function FoodCard({ f, i = 0 }) {
  const { state, dispatch } = useApp();
  const inCart = state.cart.find((c) => c.id === f.id);
  const wished = state.wishlist.some((w) => w.id === f.id);

  const add = () => {
    dispatch({ type: "ADD_CART", item: f });
    toast.success(`${f.name} added to cart`);
  };
  const inc = () => dispatch({ type: "INC", id: f.id });
  const dec = () => dispatch({ type: "DEC", id: f.id });
  const toggleWish = () => {
    dispatch({ type: "TOGGLE_WISH", item: f });
    toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
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
        >
          <FiHeart className={wished ? "fill-primary text-primary" : ""} />
        </button>
        <div className="absolute left-3 top-3 flex gap-1">
          <span
            className={`grid h-5 w-5 place-items-center rounded-sm border-2 ${f.isVeg ? "border-success" : "border-destructive"} bg-background`}
          >
            <span className={`h-2 w-2 rounded-full ${f.isVeg ? "bg-success" : "bg-destructive"}`} />
          </span>
          {f.isBestseller && (
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black">
              ★ BESTSELLER
            </span>
          )}
        </div>
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
          {inCart ? (
            <div className="flex items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground shadow-soft">
              <button
                onClick={dec}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20"
              >
                <FiMinus size={14} />
              </button>
              <span className="min-w-6 text-center text-sm font-bold">{inCart.quantity}</span>
              <button
                onClick={inc}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20"
              >
                <FiPlus size={14} />
              </button>
            </div>
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
