import { AppShell } from "@/components/layout/AppShell";
import { fetchCrawl } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
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
    <AppShell title={crawl.domain} description={`Crawl ID: ${crawl.id}`}>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ru-grey transition-colors hover:text-neutral-dark"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back to Dashboard
        </Link>
      </div>
      <CrawlDetailPoller initial={crawl} />
    </AppShell>
  );
}