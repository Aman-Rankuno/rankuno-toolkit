import { cn } from "@/lib/utils";
import { CrawlStatus } from "@/lib/crawls";

type StatusConfig = {
  label: string;
  className: string;
  pulse: boolean;
};

const statusConfig: Record<CrawlStatus, StatusConfig> = {
  running: {
    label: "Running",
    className: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
    pulse: true,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    pulse: false,
  },
  failed: {
    label: "Failed",
    className: "bg-ru-red/10 text-ru-red ring-ru-red/20",
    pulse: false,
  },
  queued: {
    label: "Queued",
    className: "bg-ru-grey/10 text-ru-grey ring-ru-grey/30",
    pulse: false,
  },
};

type StatusBadgeProps = {
  status: CrawlStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          config.pulse && "animate-pulse"
        )}
      />
      {config.label}
    </span>
  );
}