const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CrawlStatus = "queued" | "running" | "completed" | "failed";

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