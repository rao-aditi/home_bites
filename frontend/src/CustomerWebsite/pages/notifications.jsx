import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiPackage, FiGift, FiBell } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/store/slice/CustomerSlice/notificationSlice";
import { ErrorState } from "@/CustomerWebsite/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

const icon = (t) => (t === "order" ? <FiPackage /> : t === "offer" ? <FiGift /> : <FiBell />);

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, loaded, error } = useSelector((state) => state.customerNotification);
  const isLoading = !loaded && !error;
  const isError = !loaded && Boolean(error);
  const refetch = () => dispatch(fetchNotifications());

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold">Notifications</h1>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load notifications." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="mt-6 text-muted-foreground">You're all caught up.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {notifications.map((n, i) => (
            <motion.button
              key={n.id}
              type="button"
              onClick={() => n.unread && dispatch(markNotificationRead(n.id))}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex w-full items-start gap-4 rounded-2xl p-5 text-left shadow-soft ring-1 ring-border/40 ${n.unread ? "bg-primary/5" : "bg-card"}`}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
                {icon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-bold">{n.title}</div>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <div className="mt-1 text-xs text-muted-foreground">
                  {n.createdAt
                    ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                    : ""}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
