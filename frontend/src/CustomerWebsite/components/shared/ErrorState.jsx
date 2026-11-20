import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";

/**
 * Generic load-failure state: message + retry (calls the page's own fetch
 * thunk again). Used wherever a page's load failed instead of a
 * bespoke error block per page.
 */
export function ErrorState({ message = "Something went wrong.", onRetry, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-10 text-center shadow-soft ring-1 ring-border/40 ${className}`}>
      <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <FiAlertTriangle size={22} />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="rounded-full">
          <FiRefreshCw /> Retry
        </Button>
      )}
    </div>
  );
}
