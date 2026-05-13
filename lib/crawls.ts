// Crawl data types and mock fixtures.
// Real data will replace mock crawls in Phase 2 when the backend is wired up.

export type CrawlStatus = "running" | "completed" | "failed" | "queued";

export type CrawlSource = "full-site" | "url-list";

export type CrawlType =
  | "full-audit"
  | "advanced-audit"
  | "js-crawl"
  | "orphan-pages"
  | "sitemap-generator";

// Fields the orchestrator writes to metadata.json after the audit step.
export type CrawlMetadata = {
  siteHealthScore?: number;
  issuesCount?: number;
  rows?: number;
  columns?: number;
  themesApplied?: boolean;
  scoringVersion?: string;
  themesVersion?: string;
  generatedAt?: Date;
};

// File paths the orchestrator returns in JobResult.output_paths.
export type CrawlOutputs = {
  masterXlsx?: string;
  jsonl?: string;
  narratives?: string;
  report?: string;
  crawlZip?: string;
};

// Per-step pipeline state from the orchestrator's marker files.
export type CrawlPipelineState = {
  crawl: "pending" | "running" | "done" | "failed";
  audit: "pending" | "running" | "done" | "failed";
  narratives: "pending" | "running" | "done" | "failed";
  report: "pending" | "running" | "done" | "failed";
  failedStep?: "crawl" | "audit" | "narratives" | "report";
  errorMessage?: string;
};

export type Crawl = {
  id: string;
  domain: string;
  startedAt: Date;
  pagesCrawled: number;
  status: CrawlStatus;
  // New optional fields, populated once the orchestrator runs.
  source?: CrawlSource;
  crawlType?: CrawlType;
  gscEnabled?: boolean;
  gscProperty?: string;
  metadata?: CrawlMetadata;
  outputs?: CrawlOutputs;
  pipeline?: CrawlPipelineState;
};

// Mock data: 12 sample crawls covering all four statuses and a realistic
// mix of RankUno client domains. Dates are recent so the dashboard feels live.
// A few rows now include metadata, outputs, and pipeline so the Crawl Detail
// page has realistic content during Phase 1.
export const mockCrawls: Crawl[] = [
  {
    id: "crawl-001",
    domain: "manulife.ca",
    startedAt: new Date(Date.now() - 1000 * 60 * 32),
    pagesCrawled: 758,
    status: "completed",
    source: "full-site",
    crawlType: "full-audit",
    gscEnabled: true,
    gscProperty: "sc-domain:manulife.ca",
    metadata: {
      siteHealthScore: 78.5,
      issuesCount: 42,
      rows: 758,
      columns: 56,
      themesApplied: true,
      scoringVersion: "scoring.v2",
      themesVersion: "themes.v4",
      generatedAt: new Date(Date.now() - 1000 * 60 * 24),
    },
    outputs: {
      masterXlsx: "/jobs/crawl-001/master.xlsx",
      jsonl: "/jobs/crawl-001/master.jsonl",
      narratives: "/jobs/crawl-001/narratives.json",
      report: "/jobs/crawl-001/report.pdf",
      crawlZip: "/jobs/crawl-001/crawl.zip",
    },
    pipeline: {
      crawl: "done",
      audit: "done",
      narratives: "done",
      report: "done",
    },
  },
  {
    id: "crawl-002",
    domain: "sciex.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 18),
    pagesCrawled: 412,
    status: "running",
    source: "full-site",
    crawlType: "full-audit",
    pipeline: {
      crawl: "running",
      audit: "pending",
      narratives: "pending",
      report: "pending",
    },
  },
  {
    id: "crawl-003",
    domain: "leica-microsystems.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    pagesCrawled: 1245,
    status: "completed",
    source: "full-site",
    crawlType: "advanced-audit",
    gscEnabled: true,
    gscProperty: "https://www.leica-microsystems.com/",
    metadata: {
      siteHealthScore: 65.2,
      issuesCount: 87,
      rows: 1245,
      columns: 58,
      themesApplied: false,
      scoringVersion: "scoring.v2",
      themesVersion: "themes.v4",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 24),
    },
    outputs: {
      masterXlsx: "/jobs/crawl-003/master.xlsx",
      jsonl: "/jobs/crawl-003/master.jsonl",
      narratives: "/jobs/crawl-003/narratives.json",
      report: "/jobs/crawl-003/report.pdf",
      crawlZip: "/jobs/crawl-003/crawl.zip",
    },
    pipeline: {
      crawl: "done",
      audit: "done",
      narratives: "done",
      report: "done",
    },
  },
  {
    id: "crawl-004",
    domain: "phenomenex.com",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    pagesCrawled: 0,
    status: "failed",
    source: "full-site",
    crawlType: "full-audit",
    pipeline: {
      crawl: "failed",
      audit: "pending",
      narratives: "pending",
      report: "pending",
      failedStep: "crawl",
      errorMessage:
        "Screaming Frog crawl failed (exit 1). Connection refused on target host.",
    },
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
    pipeline: {
      crawl: "done",
      audit: "failed",
      narratives: "pending",
      report: "pending",
      failedStep: "audit",
      errorMessage:
        "Audit: ingestion produced empty DataFrame. Check that internal_all.csv contains URLs.",
    },
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

// Look up a single crawl by its id for the detail page.
export function getCrawlById(id: string): Crawl | undefined {
  return mockCrawls.find((c) => c.id === id);
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