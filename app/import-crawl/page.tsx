import { AppShell } from "@/components/layout/AppShell";
import { ImportCrawl } from "@/components/import-crawl/ImportCrawl";

export default function ImportCrawlPage() {
  return (
    <AppShell
      title="Import Crawl"
      description="Upload a Screaming Frog crawl file to generate reports"
    >
      <ImportCrawl />
    </AppShell>
  );
}
