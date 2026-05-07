import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Crawl } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";

type CrawlsTableProps = {
  crawls: Crawl[];
};

function formatCrawlDate(dateStr: string): string {
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateFormatted} · ${timeFormatted}`;
}

export function CrawlsTable({ crawls }: CrawlsTableProps) {
  if (crawls.length === 0) {
    return (
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ru-grey">
            Recent Crawls
          </h3>
          <span className="text-xs text-ru-grey">0 crawls</span>
        </div>
        <div className="rounded-lg border border-dashed border-ru-grey/25 bg-white px-12 py-16 text-center">
          <p className="text-sm font-medium text-neutral-dark">No crawls yet</p>
          <p className="mt-1 text-xs text-ru-grey">
            Click &quot;New Crawl&quot; in the sidebar to get started
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ru-grey">
          Recent Crawls
        </h3>
        <span className="text-xs text-ru-grey">
          {crawls.length} {crawls.length === 1 ? "crawl" : "crawls"}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-ru-grey/15 bg-white">
        <table className="w-full">
          <thead className="border-b border-ru-grey/15 bg-ru-grey/5">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ru-grey">
                Domain Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ru-grey">
                Date and Time
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ru-grey">
                Pages Crawled
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ru-grey">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ru-grey">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ru-grey/10">
            {crawls.map((crawl) => (
              <tr key={crawl.id} className="transition-colors hover:bg-ru-grey/5">
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-neutral-dark">
                    {crawl.domain}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-ru-grey">
                    {formatCrawlDate(crawl.created_at)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm tabular-nums text-neutral-dark">
                    {crawl.pages_crawled > 0
                      ? crawl.pages_crawled.toLocaleString()
                      : "—"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={crawl.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/crawls/${crawl.id}`}
                    className="inline-flex items-center gap-1 rounded-md border border-ru-grey/20 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-dark transition-colors hover:border-ru-red/30 hover:bg-ru-red/5 hover:text-ru-red"
                  >
                    View
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}