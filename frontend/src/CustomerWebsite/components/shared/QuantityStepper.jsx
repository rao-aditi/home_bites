import { FiMinus, FiPlus } from "react-icons/fi";

const sizeClasses = {
  sm: { btn: "h-7 w-7", icon: 14, text: "text-sm", pad: "p-1", min: "min-w-6" },
  md: { btn: "h-9 w-9", icon: 16, text: "font-bold", pad: "p-1.5", min: "min-w-8" },
};

/**
 * Shared +/- quantity control, deduping the hand-rolled stepper that used to
 * be copy-pasted across FoodCard, cart.jsx and food.$id.jsx.
 */
export function QuantityStepper({ quantity, onIncrement, onDecrement, size = "sm", className = "" }) {
  const s = sizeClasses[size] || sizeClasses.sm;
  return (
    <div className={`flex items-center gap-1 rounded-full bg-primary ${s.pad} text-primary-foreground shadow-soft ${className}`}>
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`grid ${s.btn} place-items-center rounded-full hover:bg-white/20`}
      >
        <FiMinus size={s.icon} />
      </button>
      <span className={`${s.min} text-center ${s.text}`}>{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={`grid ${s.btn} place-items-center rounded-full hover:bg-white/20`}
      >
        <FiPlus size={s.icon} />
      </button>
    </div>
  );
}
