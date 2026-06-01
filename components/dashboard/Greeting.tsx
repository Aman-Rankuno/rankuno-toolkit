import { Crawl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Activity, CircleCheck, TriangleAlert } from "lucide-react";

type GreetingProps = {
  name: string;
  crawls: Crawl[];
};

export function Greeting({ name, crawls }: GreetingProps) {
  const total = crawls.length;
  const running = crawls.filter((c) => c.status === "running").length;
  const completed = crawls.filter((c) => c.status === "completed").length;
  const failed = crawls.filter((c) => c.status === "failed").length;

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-dark sm:text-4xl">
        Hi {name}
      </h2>
      <p className="mt-2 text-base text-ru-grey">
        Here&apos;s where your crawls stand today.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Activity}
          label="Running"
          value={running}
          sub={running === 0 ? "Nothing in progress" : "In progress now"}
        />
        <StatCard
          icon={CircleCheck}
          label="Completed"
          value={completed}
          sub={`of ${total} total`}
        />
        <StatCard
          icon={TriangleAlert}
          label="Need attention"
          value={failed}
          sub={failed === 1 ? "Failed crawl" : "Failed crawls"}
          accent
        />
      </div>
    </section>
  );
}

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  accent?: boolean;
};

function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        accent ? "border-ru-red/20" : "border-ru-grey/15"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
          {label}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            accent ? "bg-ru-red/10" : "bg-ru-grey/10"
          )}
        >
          <Icon
            className={cn("h-4 w-4", accent ? "text-ru-red" : "text-ru-grey")}
            strokeWidth={2.2}
          />
        </span>
      </div>

      <span
        className={cn(
          "mt-1 text-2xl font-semibold tabular-nums tracking-tight",
          accent ? "text-ru-red" : "text-neutral-dark"
        )}
      >
        {value}
      </span>
      <span className="mt-1 text-sm text-ru-grey">{sub}</span>
    </div>
  );
}
