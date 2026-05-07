import { Crawl } from "@/lib/api";
import { cn } from "@/lib/utils";

type GreetingProps = {
  name: string;
  crawls: Crawl[];
};

export function Greeting({ name, crawls }: GreetingProps) {
  const running = crawls.filter((c) => c.status === "running").length;
  const completed = crawls.filter((c) => c.status === "completed").length;
  const failed = crawls.filter((c) => c.status === "failed").length;

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-dark sm:text-4xl">
        Hi {name}
      </h2>
      <p className="mt-2 text-base text-ru-grey">
        Here&apos;s where your crawls stand.{" "}
        <span className="font-semibold text-neutral-dark">
          {running} running
        </span>
        {", "}
        <span className="font-semibold text-neutral-dark">
          {completed} completed
        </span>
        {failed > 0 && (
          <>
            {", "}
            <span className={cn("font-semibold text-ru-red")}>
              {failed} {failed === 1 ? "needs" : "need"} attention
            </span>
          </>
        )}
        .
      </p>
    </section>
  );
}