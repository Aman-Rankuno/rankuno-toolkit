import { AppShell } from "@/components/layout/AppShell";
import { Greeting } from "@/components/dashboard/Greeting";
import { CrawlsTable } from "@/components/dashboard/CrawlsTable";
import { mockCrawls } from "@/lib/crawls";

export default function Home() {
  // Sort by most recent first so running and recent crawls land at the top
  const sortedCrawls = [...mockCrawls].sort(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
  );

  return (
    <AppShell title="Dashboard" description="Your SEO crawls at a glance">
      <Greeting name="G.O.A.T." crawls={mockCrawls} />
      <CrawlsTable crawls={sortedCrawls} />
    </AppShell>
  );
}