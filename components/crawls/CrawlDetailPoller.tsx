"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { Crawl } from "@/lib/api";
import { FileArchive, Database, Sheet, FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function CrawlDetailPoller({ initial }: { initial: Crawl }) {
  const [crawl, setCrawl] = useState<Crawl>(initial);

  useEffect(() => {
    if (crawl.status === "completed" || crawl.status === "failed") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/crawls/${crawl.id}`, { cache: "no-store" });
        if (res.ok) {
          const updated: Crawl = await res.json();
          setCrawl(updated);
          if (updated.status === "completed" || updated.status === "failed") clearInterval(interval);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [crawl.id, crawl.status]);

  const isRunning = crawl.status === "running" || crawl.status === "queued";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-ru-grey/15 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-dark">{crawl.domain}</h2>
            <p className="mt-1 text-sm text-ru-grey">Started: {formatDate(crawl.created_at)}</p>
            {crawl.completed_at && <p className="text-sm text-ru-grey">Completed: {formatDate(crawl.completed_at)}</p>}
          </div>
          <StatusBadge status={crawl.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">Pages Crawled</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold tabular-nums text-neutral-dark">
              {crawl.pages_crawled > 0 ? crawl.pages_crawled.toLocaleString() : "--"}
            </p>
            {isRunning && (
              <span className="mb-1 flex items-center gap-1 text-xs text-accent-orange">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-orange" />
                live
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">Crawl Type</p>
          <p className="mt-2 text-xl font-semibold text-neutral-dark capitalize">{crawl.crawl_type.replace(/-/g, " ")}</p>
        </div>
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">Status</p>
          <div className="mt-2"><StatusBadge status={crawl.status} /></div>
        </div>
      </div>

      {crawl.report_path && (
        <div className="rounded-lg border border-ru-grey/15 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-grey">Report Location</p>
          <p className="break-all font-mono text-sm text-neutral-dark">{crawl.report_path}</p>
        </div>
      )}

      {crawl.status === "completed" && crawl.report_path && (
        <div className="rounded-lg border border-ru-grey/15 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ru-grey">Downloads</p>
          <div className="flex flex-wrap gap-3">
            <a href={`${API_URL}/api/crawls/${crawl.id}/download/zip`} download className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <FileArchive className="h-4 w-4" strokeWidth={2} />Zip File
            </a>
            <button type="button" className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <Database className="h-4 w-4" strokeWidth={2} />DB Spider
            </button>
            <a href={`${API_URL}/api/crawls/${crawl.id}/download/masterfile/response-codes-internal`} download className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <Sheet className="h-4 w-4" strokeWidth={2} />Response Codes
            </a>
            <a href={`${API_URL}/api/crawls/${crawl.id}/download/masterfile/url-issues`} download className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <Sheet className="h-4 w-4" strokeWidth={2} />URL Issues
            </a>
            <a href={`${API_URL}/api/crawls/${crawl.id}/download/masterfile/page-titles`} download className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <Sheet className="h-4 w-4" strokeWidth={2} />Page Titles
            </a>
            <a href={`${API_URL}/api/crawls/${crawl.id}/download/masterfile/meta-description`} download className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <Sheet className="h-4 w-4" strokeWidth={2} />Meta Description
            </a>
            <button type="button" className="inline-flex items-center gap-2 rounded-md bg-ru-red px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80">
              <FileText className="h-4 w-4" strokeWidth={2} />Word Document
            </button>
          </div>
        </div>
      )}

      {crawl.error_message && (
        <div className="rounded-lg border border-ru-red/20 bg-ru-red/5 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-red">Error</p>
          <p className="text-sm text-neutral-dark">{crawl.error_message}</p>
        </div>
      )}
    </div>
  );
}