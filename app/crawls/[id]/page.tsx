import { AppShell } from "@/components/layout/AppShell";
import { fetchCrawl } from "@/lib/api";
import { ArrowLeft, FileX } from "lucide-react";
import Link from "next/link";
import { CrawlDetailPoller } from "@/components/crawls/CrawlDetailPoller";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CrawlDetailPage({ params }: Props) {
  const { id } = await params;

  let crawl = null;
  try {
    crawl = await fetchCrawl(id);
  } catch {
    return (
      <AppShell title="Crawl Not Found">
        <div className="rounded-2xl border border-dashed border-ru-grey/25 bg-white px-12 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ru-red/10">
            <FileX className="h-7 w-7 text-ru-red" strokeWidth={2} />
          </div>
          <p className="text-base font-semibold text-neutral-dark">Crawl not found</p>
          <p className="mt-1 text-sm text-ru-grey">
            The crawl you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-ru-red px-4 py-2 text-sm font-semibold text-ru-red transition-colors hover:bg-ru-red/5"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={crawl.domain} description={`Crawl ID: ${crawl.id}`}>
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ru-grey transition-colors hover:text-ru-red"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back to Dashboard
        </Link>
      </div>
      <CrawlDetailPoller initial={crawl} />
    </AppShell>
  );
}
