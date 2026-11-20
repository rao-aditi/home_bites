export function BestsellerBadge({ className = "" }) {
  return (
    <span
      className={`rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black ${className}`}
    >
      ★ BESTSELLER
    </span>
  );
}
