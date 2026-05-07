import { AppShell } from "@/components/layout/AppShell";
import { NewCrawlForm } from "@/components/new-crawl/NewCrawlForm";

export default function NewCrawlPage() {
  return (
    <AppShell
      title="New Crawl"
      description="Configure and start a new SEO crawl"
    >
      <NewCrawlForm />
    </AppShell>
  );
}