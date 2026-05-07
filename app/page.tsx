import { AppShell } from "@/components/layout/AppShell";
import { Greeting } from "@/components/dashboard/Greeting";
import { CrawlsTable } from "@/components/dashboard/CrawlsTable";
import { fetchCrawls, Crawl } from "@/lib/api";

export default async function Home() {
  let crawls: Crawl[] = [];
  try {
    crawls = await fetchCrawls();
  } catch {
    crawls = [];
  }

  return (
    <AppShell title="Dashboard" description="Your SEO crawls at a glance">
      <Greeting name="G.O.A.T." crawls={crawls} />
      <CrawlsTable crawls={crawls} />
    </AppShell>
  );
}