"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Crawl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(crawls.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const shown = crawls.slice(start, start + PAGE_SIZE);

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

     <div className="overflow-hidden rounded-lg border border-ru-grey/15 bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "42%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>

          <thead className="bg-ru-red">
            <tr>
              <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-white">
                Domain Name
              </th>

              <th className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-white">
                Date &amp; Time
              </th>

              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                Pages Crawled
              </th>

              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                Status
              </th>

              <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ru-grey/10">
            {shown.map((crawl) => {
              const failed = crawl.status === "failed";

              return (
                <tr
                  key={crawl.id}
                  className="transition-colors hover:bg-ru-grey/5"
                >
                  {/* Domain */}
                  <td
                    className={cn(
                      "px-4 py-4",
                      failed &&
                        "relative before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-ru-red before:content-['']"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ru-grey/10">
                        <Globe
                          className="h-4 w-4 text-ru-grey"
                          strokeWidth={2}
                        />
                      </span>

                      <span className="truncate text-sm font-medium text-neutral-dark">
                        {crawl.domain}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-3 py-4">
                    <span className="whitespace-nowrap text-sm text-ru-grey">
                      {formatCrawlDate(crawl.created_at)}
                    </span>
                  </td>

                  {/* Pages Crawled */}
                  <td className="px-3 py-4 text-center">
                    {crawl.pages_crawled > 0 ? (
                      <span className="text-sm font-medium tabular-nums text-neutral-dark">
                        {crawl.pages_crawled.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-ru-grey/50">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <StatusBadge status={crawl.status} />
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <Link
                        href={`/crawls/${crawl.id}`}
                        className="inline-flex h-9 w-[92px] items-center justify-center gap-1 rounded-md border border-ru-grey/20 bg-white text-xs font-medium text-neutral-dark transition-colors hover:border-ru-red/30 hover:bg-ru-red/5 hover:text-ru-red"
                      >
                        View
                        <ArrowUpRight
                          className="h-3.5 w-3.5"
                          strokeWidth={2.5}
                        />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-ru-grey/10 bg-ru-grey/5 px-4 py-2">
          <span className="text-xs text-ru-grey">
            Showing {start + 1} to {start + shown.length} of {crawls.length}
          </span>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
};

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center gap-1.5">
      <PageButton
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        ariaLabel="Previous page"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
      </PageButton>
      {pages.map((p) => (
        <PageButton
          key={p}
          active={p === page}
          onClick={() => onChange(p)}
        >
          {p}
        </PageButton>
      ))}
      <PageButton
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        ariaLabel="Next page"
      >
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
      </PageButton>
    </div>
  );
}

type PageButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-7 min-w-[28px] items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors",
        active
          ? "border-ru-red bg-ru-red text-white"
          : "border-ru-grey/20 bg-white text-neutral-dark hover:border-ru-grey/40 hover:bg-ru-grey/5",
        disabled &&
          "cursor-not-allowed opacity-40 hover:border-ru-grey/20 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}