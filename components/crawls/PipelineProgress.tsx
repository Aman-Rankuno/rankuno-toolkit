import { Check, Circle, Loader2, X } from "lucide-react";
import type { CrawlPipelineState } from "@/lib/crawls";

const STEPS: Array<{
  key: keyof Pick<CrawlPipelineState, "crawl" | "audit" | "narratives" | "report">;
  label: string;
}> = [
  { key: "crawl", label: "Crawl" },
  { key: "audit", label: "Audit" },
  { key: "narratives", label: "Narratives" },
  { key: "report", label: "Report" },
];

export function PipelineProgress({
  pipeline,
}: {
  pipeline: CrawlPipelineState;
}) {
  return (
    <div className="flex items-start gap-2">
      {STEPS.map((step, i) => {
        const status = pipeline[step.key];
        const nextDone =
          i < STEPS.length - 1
            ? pipeline[STEPS[i + 1].key] !== "pending"
            : false;
        return (
          <div key={step.key} className="flex flex-1 items-start gap-2">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <StepDot status={status} />
              <span className="text-xs font-semibold text-neutral-dark">
                {step.label}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ru-grey">
                {status}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mt-3.5 h-0.5 flex-1 ${
                  nextDone ? "bg-tertiary-green/40" : "bg-ru-grey/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepDot({
  status,
}: {
  status: "pending" | "running" | "done" | "failed";
}) {
  const base = "flex h-8 w-8 items-center justify-center rounded-full";
  if (status === "done") {
    return (
      <div className={`${base} bg-tertiary-green/20 text-tertiary-green`}>
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  if (status === "running") {
    return (
      <div className={`${base} bg-accent-orange/20 text-accent-orange`}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className={`${base} bg-ru-red/15 text-ru-red`}>
        <X className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className={`${base} bg-ru-grey/10 text-ru-grey/50`}>
      <Circle className="h-3 w-3" />
    </div>
  );
}