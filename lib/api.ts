const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CrawlStatus = "queued" | "running" | "completed" | "failed";

export type CrawlPipelineState = {
  crawl: "pending" | "running" | "done" | "failed";
  audit: "pending" | "running" | "done" | "failed";
  narratives: "pending" | "running" | "done" | "failed";
  report: "pending" | "running" | "done" | "failed";
};

export type CrawlMetadataAPI = {
  site_health_score?: number;
  issues_count?: number;
  rows?: number;
  columns?: number;
  themes_applied?: boolean;
  scoring_version?: string;
  themes_version?: string;
  generated_at?: string;
};

export type Crawl = {
  id: string;
  domain: string;
  crawl_type: string;
  status: CrawlStatus;
  pages_crawled: number;
  report_path: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  failed_step?: "crawl" | "audit" | "narratives" | "report";
  pipeline?: CrawlPipelineState;
  metadata?: CrawlMetadataAPI;
};

export async function fetchCrawls(): Promise<Crawl[]> {
  const res = await fetch(`${API_URL}/api/crawls/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch crawls");
  return res.json();
}

export async function createCrawl(payload: {
  domain: string;
  crawl_type: string;
  urls?: string;
  config_file?: string;
  gsc_account?: string;
  gsc_property?: string;
  ga_account?: string;
  ga4_account?: string;
  ga4_property?: string;
  ga4_stream?: string;
  include_patterns?: string;
  exclude_patterns?: string;
}): Promise<{ id: string; status: string; message: string }> {
  const res = await fetch(`${API_URL}/api/crawls/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create crawl");
  return res.json();
}

export async function fetchCrawl(id: string): Promise<Crawl> {
  const res = await fetch(`${API_URL}/api/crawls/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Crawl not found");
  return res.json();
}