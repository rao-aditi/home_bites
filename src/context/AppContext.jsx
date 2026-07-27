import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const initial = {
  cart: [],
  wishlist: [],
  addresses: [
    {
      id: "a1",
      label: "Home",
      line1: "42 Sunset Boulevard, Apt 12B",
      city: "San Francisco",
      phone: "+1 415 555 0121",
      isDefault: true,
    },
  ],
  orders: [],
  recentlyViewed: [],
  theme: "light",
  location: "San Francisco, CA",
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "ADD_CART": {
      const existing = state.cart.find((c) => c.id === action.item.id);
      if (existing)
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.id === action.item.id ? { ...c, quantity: c.quantity + 1 } : c,
          ),
        };
      return { ...state, cart: [...state.cart, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE_CART":
      return { ...state, cart: state.cart.filter((c) => c.id !== action.id) };
    case "INC":
      return {
        ...state,
        cart: state.cart.map((c) => (c.id === action.id ? { ...c, quantity: c.quantity + 1 } : c)),
      };
    case "DEC":
      return {
        ...state,
        cart: state.cart.flatMap((c) =>
          c.id === action.id ? (c.quantity > 1 ? [{ ...c, quantity: c.quantity - 1 }] : []) : [c],
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISH": {
      const exists = state.wishlist.find((w) => w.id === action.item.id);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((w) => w.id !== action.item.id)
          : [...state.wishlist, action.item],
      };
    }
    case "ADD_ADDRESS":
      return {
        ...state,
        addresses: [
          ...state.addresses.map((a) => ({ ...a, isDefault: false })),
          { ...action.address, isDefault: true },
        ],
      };
    case "REMOVE_ADDRESS":
      return { ...state, addresses: state.addresses.filter((a) => a.id !== action.id) };
    case "SET_DEFAULT_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === action.id })),
      };
    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders], cart: [] };
    case "VIEW":
      return {
        ...state,
        recentlyViewed: [action.id, ...state.recentlyViewed.filter((i) => i !== action.id)].slice(
          0,
          8,
        ),
      };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "SET_LOCATION":
      return { ...state, location: action.location };
    case "HYDRATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("foodly-state");
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("foodly-state", JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const cartTotal = (cart) => cart.reduce((s, i) => s + i.price * i.quantity, 0);
export const cartCount = (cart) => cart.reduce((s, i) => s + i.quantity, 0);
