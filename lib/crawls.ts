// Crawl data types and mock fixtures.
// Real data will replace mock crawls in Phase 2 when the backend is wired up.

export type CrawlStatus = "running" | "completed" | "failed" | "queued";

export type Crawl = {
  id: string;
  domain: string;
  startedAt: Date;
  pagesCrawled: number;
  status: CrawlStatus;
};

// Mock data: 12 sample crawls covering all four statuses and a realistic
// mix of RankUno client domains. Dates are recent so the dashboard feels live.
export const mockCrawls: Crawl[] = [
  {
    id: "crawl-001",
    domain: "manulife.ca",
    startedAt: new Date(Date.now() - 1000 * 60 * 32),
    pagesCrawled: 758,
    status: "completed",
  },
  {
    id: "crawl-002",
    domain: "sciex.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 18),
    pagesCrawled: 412,
    status: "running",
  },
  {
    id: "crawl-003",
    domain: "leica-microsystems.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    pagesCrawled: 1245,
    status: "completed",
  },
  {
    id: "crawl-004",
    domain: "phenomenex.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    pagesCrawled: 0,
    status: "failed",
  },
  {
    id: "crawl-005",
    domain: "abcam.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    pagesCrawled: 2103,
    status: "completed",
  },
  {
    id: "crawl-006",
    domain: "manulife.com.sg",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    pagesCrawled: 643,
    status: "completed",
  },
  {
    id: "crawl-007",
    domain: "infosysbpm.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
    pagesCrawled: 287,
    status: "running",
  },
  {
    id: "crawl-008",
    domain: "gepworldwide.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    pagesCrawled: 989,
    status: "completed",
  },
  {
    id: "crawl-009",
    domain: "elgi.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    pagesCrawled: 0,
    status: "queued",
  },
  {
    id: "crawl-010",
    domain: "macys.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    pagesCrawled: 5421,
    status: "completed",
  },
  {
    id: "crawl-011",
    domain: "renewalbyandersen.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    pagesCrawled: 156,
    status: "failed",
  },
  {
    id: "crawl-012",
    domain: "finacle.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    pagesCrawled: 1834,
    status: "completed",
  },
];

// Helper functions used by the greeting section and table.
// Putting these here keeps the page component clean.

export function getCrawlStats(crawls: Crawl[]) {
  const running = crawls.filter((c) => c.status === "running").length;
  const completed = crawls.filter((c) => c.status === "completed").length;
  const failed = crawls.filter((c) => c.status === "failed").length;
  const queued = crawls.filter((c) => c.status === "queued").length;
  return { total: crawls.length, running, completed, failed, queued };
}

// Recent meaning within the last 7 days. Used by the greeting summary line.
export function getRecentCompletedCount(crawls: Crawl[]): number {
  const sevenDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  return crawls.filter(
    (c) => c.status === "completed" && c.startedAt.getTime() >= sevenDaysAgo
  ).length;
}

// Format a Date as "Nov 5, 2025 · 10:32 AM" for the table.
export function formatCrawlDate(date: Date): string {
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} · ${timeStr}`;
}