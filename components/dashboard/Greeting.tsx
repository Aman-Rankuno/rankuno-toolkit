import { Crawl, getCrawlStats, getRecentCompletedCount } from "@/lib/crawls";
import { cn } from "@/lib/utils";

type GreetingProps = {
  name: string;
  crawls: Crawl[];
};

export function Greeting({ name, crawls }: GreetingProps) {
  const stats = getCrawlStats(crawls);
  const recentCompleted = getRecentCompletedCount(crawls);
  const needsAttention = stats.failed;

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-dark sm:text-4xl">
        Hi {name}
      </h2>
      <p className="mt-2 text-base text-ru-grey">
        Here&apos;s where your crawls stand.{" "}
        <span className="font-semibold text-neutral-dark">
          {stats.running} running
        </span>
        {", "}
        <span className="font-semibold text-neutral-dark">
          {recentCompleted} completed this week
        </span>
        {needsAttention > 0 && (
          <>
            {", "}
            <span className={cn("font-semibold text-ru-red")}>
              {needsAttention} {needsAttention === 1 ? "needs" : "need"} attention
            </span>
          </>
        )}
        .
      </p>
    </section>
  );
}