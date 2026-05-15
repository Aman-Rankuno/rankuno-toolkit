import { AppShell } from "@/components/layout/AppShell";
import { fetchCrawl } from "@/lib/api";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ArrowLeft, FileArchive, Database, Sheet, FileText } from "lucide-react";
import Link from "next/link";


type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function CrawlDetailPage({ params }: Props) {
  const { id } = await params;
  let crawl = null;
  try {
    crawl = await fetchCrawl(id);
  } catch {
    return (
      <AppShell title="Crawl Not Found">
        <div className="rounded-lg border border-dashed border-ru-grey/25 bg-white px-12 py-16 text-center">
          <p className="text-sm font-medium text-neutral-dark">Crawl not found.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-ru-red hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={crawl.domain}
      description={`Crawl ID: ${crawl.id}`}
    >
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ru-grey transition-colors hover:text-neutral-dark"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back to Dashboard
        </Link>
      </div>

      {/* Header card */}
      <div className="mb-6 rounded-lg border border-ru-grey/15 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-dark">
              {crawl.domain}
            </h2>
            <p className="mt-1 text-sm text-ru-grey">
              Started: {formatDate(crawl.created_at)}
            </p>
            {crawl.completed_at && (
              <p className="text-sm text-ru-grey">
                Completed: {formatDate(crawl.completed_at)}
              </p>
            )}
          </div>
          <StatusBadge status={crawl.status} />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
            Pages Crawled
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-neutral-dark">
            {crawl.pages_crawled > 0 ? crawl.pages_crawled.toLocaleString() : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
            Crawl Type
          </p>
          <p className="mt-2 text-xl font-semibold text-neutral-dark capitalize">
            {crawl.crawl_type.replace("-", " ")}
          </p>
        </div>
        <div className="rounded-lg border border-ru-grey/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
            Status
          </p>
          <div className="mt-2">
            <StatusBadge status={crawl.status} />
          </div>
        </div>
      </div>

      {/* Report path or error */}
      {crawl.report_path && (
        <div className="mb-6 rounded-lg border border-ru-grey/15 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-grey">
            Report Location
          </p>
          <p className="text-sm font-mono text-neutral-dark break-all">
            {crawl.report_path}
          </p>
        </div>
      )}

      {/* Download buttons */}
      {crawl.status === "completed" && crawl.report_path && (
        <div className="rounded-lg border border-ru-grey/15 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ru-grey">
            Downloads
          </p>
          <div className="flex flex-wrap gap-3">
            <a
            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/crawls/${crawl.id}/download/zip`}
              download
              className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              <FileArchive className="h-4 w-4" strokeWidth={2} />
              Zip File
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              <Database className="h-4 w-4" strokeWidth={2} />
              DB Spider
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-ru-grey px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              <Sheet className="h-4 w-4" strokeWidth={2} />
              Mastersheet
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-ru-red px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              <FileText className="h-4 w-4" strokeWidth={2} />
              Word Document
            </button>
          </div>
        </div>
      )}

      {crawl.error_message && (
        <div className="rounded-lg border border-ru-red/20 bg-ru-red/5 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-red">
            Error
          </p>
          <p className="text-sm text-neutral-dark">{crawl.error_message}</p>
        </div>
      )}
    </AppShell>
  );
}