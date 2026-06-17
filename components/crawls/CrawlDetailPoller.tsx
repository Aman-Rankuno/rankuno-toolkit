"use client";

import { useEffect, useState } from "react";
import type { Crawl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Globe, Clock, CircleCheck, Info, Folder, Copy, Check,
  FileText, AlertCircle, Heading, Tag, Type, Link as LinkIcon,
  ShieldCheck, Share2, Lock, Zap, Code, Link2, AlertTriangle, Files,
  BarChart3, ChevronsRight, Languages, FileType, Download, Calendar,
  Layers, Gauge,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Subtle halftone dot overlay used on the red hero.
const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Ccircle cx='7' cy='7' r='1' fill='%23ffffff' fill-opacity='0.18'/%3E%3C/svg%3E")`;

// "May 20, 2026 · 4:29 PM"
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  return `${datePart} · ${timePart}`;
}

// "1h 38m" / "42m" / "In progress"
function formatDuration(start: string, end?: string | null): string {
  if (!end) return "In progress";
  const minutes = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// "Avg 263 pages/min" — derived from real pages_crawled and times
function avgPagesPerMin(pages: number, start: string, end?: string | null): string {
  if (!end) return "Awaiting completion";
  if (!pages) return "";
  const minutes = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (minutes < 1) return `${pages} pages`;
  return `Avg ${Math.round(pages / minutes)} pages/min`;
}

// Export config. Entries with `slug` map to real backend endpoints at
// `/api/crawls/{id}/download/masterfile/{slug}`.
// Entries without `slug` render as placeholder buttons (no download yet).
// To wire a placeholder, just add a `slug` value once the backend endpoint exists.
type ExportItem = {
  icon: LucideIcon;
  label: string;
  slug?: string;
};

const EXPORTS: ExportItem[] = [
  { icon: FileText,        label: "Response Codes Internal", slug: "response-codes-internal" },
  { icon: AlertCircle,     label: "URL Issues",              slug: "url-issues" },
  { icon: Heading,         label: "Page Titles",             slug: "page-titles" },
  { icon: Tag,             label: "Meta Description",        slug: "meta-description" },
  { icon: Type,            label: "H1",                   slug: "h1" },
  { icon: LinkIcon,        label: "Canonicals" },
  { icon: ShieldCheck,     label: "Directives",          slug: "directives" },
  { icon: Files,           label: "Sitemaps",                slug: "sitemaps" },
  { icon: Lock,            label: "Security" },
  { icon: Zap,             label: "Page Speed / CWV" },
  { icon: Code,            label: "Structured Tags" },
  { icon: Link2,           label: "Functional Internal Links Analysis", slug: "internal-links-functional" },
  { icon: Link2,           label: "Non-Functional Internal Links", slug: "internal-links-non-functional" },
  { icon: AlertTriangle,   label: "Content Issues",         slug: "content-issues" },
  { icon: Copy,            label: "Duplicate Content",        slug: "duplicate-content" },
  { icon: BarChart3,       label: "Custom Search GA4 & GTM", slug: "custom-search-ga4-gtm" },
  { icon: Share2,          label: "Custom Search OG & Twitter", slug: "custom-search-og-twitter" },
  { icon: ChevronsRight,   label: "Pagination",          slug: "pagination" },
  { icon: Languages,       label: "Hreflang" },
];

// Status pill styled for the red hero (white background, coloured text + dot).
function HeroStatusPill({ status }: { status: Crawl["status"] }) {
  const map: Record<string, { textCls: string; dotCls: string; label: string; pulse?: boolean }> = {
    completed: { textCls: "text-emerald-700", dotCls: "bg-emerald-500", label: "Completed" },
    failed:    { textCls: "text-ru-red",      dotCls: "bg-ru-red",      label: "Failed" },
    running:   { textCls: "text-amber-700",   dotCls: "bg-amber-500",   label: "Running", pulse: true },
    queued:    { textCls: "text-slate-700",   dotCls: "bg-slate-400",   label: "Queued" },
  };
  const c = map[status] || map.queued;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold">
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dotCls, c.pulse && "animate-pulse")} />
      <span className={c.textCls}>{c.label}</span>
    </span>
  );
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  capitalizeValue?: boolean;
};

function StatCard({ icon: Icon, label, value, sub, capitalizeValue }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-ru-grey/15 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ru-red/10">
            <Icon size={15} className="text-ru-red" strokeWidth={2.2} />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ru-grey">{label}</span>
        </div>
        <Info size={13} className="text-ru-grey/60" strokeWidth={2.2} />
      </div>
      <div className={cn("mt-4 text-3xl font-semibold tracking-tight text-neutral-dark", capitalizeValue && "capitalize")}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-ru-grey">{sub}</div>
    </div>
  );
}

export function CrawlDetailPoller({ initial }: { initial: Crawl }) {
  const [crawl, setCrawl] = useState<Crawl>(initial);
  const [copied, setCopied] = useState(false);

  // Polling — unchanged. Polls every 3s while running/queued.
  useEffect(() => {
    if (crawl.status === "completed" || crawl.status === "failed") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/crawls/${crawl.id}`, { cache: "no-store" });
        if (res.ok) {
          const updated: Crawl = await res.json();
          setCrawl(updated);
          if (updated.status === "completed" || updated.status === "failed") clearInterval(interval);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [crawl.id, crawl.status]);

  const isCompleted = crawl.status === "completed";
  const isRunning = crawl.status === "running" || crawl.status === "queued";
  const crawlTypeLabel = (crawl.crawl_type ?? "").replace(/-/g, " ");
  const subtitleSuffix = isCompleted
    ? `, completed in ${formatDuration(crawl.created_at, crawl.completed_at)}`
    : isRunning
    ? ", currently in progress"
    : crawl.status === "failed"
    ? ", did not complete"
    : "";

  function copyPath() {
    if (!crawl.report_path) return;
    navigator.clipboard?.writeText(crawl.report_path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-5">
      {/* HERO — bold RU Red with halftone dots, domain watermark, soft glow */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #DE1921 0%, #A6131A 100%)",
          boxShadow: "0 10px 32px rgba(222,25,33,0.24)",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: DOT_PATTERN, pointerEvents: "none" }} />
        <div
          aria-hidden
          style={{
            position: "absolute", right: -30, bottom: -50,
            fontSize: 220, fontWeight: 800, color: "rgba(255,255,255,0.07)",
            letterSpacing: "-0.05em", lineHeight: 0.85,
            pointerEvents: "none", whiteSpace: "nowrap",
          }}
        >
          {crawl.domain}
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute", left: -100, top: -100,
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="flex items-center justify-center rounded-xl"
                style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(4px)" }}
              >
                <Globe size={24} className="text-white" strokeWidth={2} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">Crawl Report</div>
                <h2 className="mt-1 text-4xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.028em" }}>
                  {crawl.domain}
                </h2>
                <p className="mt-1.5 text-sm capitalize text-white/90">
                  {crawlTypeLabel} crawl{subtitleSuffix}
                </p>
              </div>
            </div>
            <HeroStatusPill status={crawl.status} />
          </div>

          {/* Timeline */}
          <div className="mt-6 flex flex-wrap items-center gap-8 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-white/75" strokeWidth={2.2} />
              <span className="text-xs font-semibold text-white/80">Started</span>
              <span className="text-xs font-semibold text-white">{formatDate(crawl.created_at)}</span>
            </div>
            {crawl.completed_at && (
              <div className="flex items-center gap-2">
                <CircleCheck size={13} className="text-white/90" strokeWidth={2.2} />
                <span className="text-xs font-semibold text-white/80">Completed</span>
                <span className="text-xs font-semibold text-white">{formatDate(crawl.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={FileText}
          label="Pages crawled"
          value={crawl.pages_crawled > 0 ? crawl.pages_crawled.toLocaleString() : "--"}
          sub={isRunning ? "Live" : "All pages indexed"}
        />
        <StatCard
          icon={Layers}
          label="Crawl type"
          value={crawlTypeLabel}
          sub="Comprehensive analysis"
          capitalizeValue
        />
        <StatCard
          icon={Gauge}
          label="Duration"
          value={formatDuration(crawl.created_at, crawl.completed_at)}
          sub={avgPagesPerMin(crawl.pages_crawled, crawl.created_at, crawl.completed_at)}
        />
      </div>

      {/* Report Location */}
      {crawl.report_path && (
        <div className="rounded-2xl border border-ru-grey/15 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ru-red/10">
                <Folder size={15} className="text-ru-red" strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ru-grey">Report Location</div>
                <div className="truncate font-mono text-sm text-neutral-dark">{crawl.report_path}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={copyPath}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                copied
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-ru-red text-ru-red hover:bg-ru-red/5"
              )}
            >
              {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.3} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Data Exports — all 18 cards. Entries with `slug` are real downloads,
          others are placeholder buttons until the backend endpoint exists. */}
      {isCompleted && (
        <>
          <div className="pt-2 text-xs font-bold uppercase tracking-wider text-neutral-dark">
            Data Exports
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {EXPORTS.map((e) => {
              const Icon = e.icon;
              const url = e.slug ? `${API_URL}/api/crawls/${crawl.id}/download/masterfile/${e.slug}` : null;
              const inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ru-red/10">
                    <Icon size={15} className="text-ru-red" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 truncate text-sm font-semibold text-neutral-dark">{e.label}</span>
                  <Download size={14} className="text-ru-grey/70 group-hover:text-ru-red" strokeWidth={2.4} />
                </>
              );
              const baseClasses = "group flex items-center gap-3 rounded-xl border border-ru-grey/15 bg-white px-4 py-3 transition-colors hover:border-ru-red/30 hover:shadow-sm";
              return url ? (
                <a key={e.label} href={url} download className={baseClasses}>{inner}</a>
              ) : (
                <button key={e.label} type="button" className={cn(baseClasses, "text-left")}>{inner}</button>
              );
            })}
          </div>
        </>
      )}

      {/* Client Report — 4 buttons, all Coming in V2 */}
      {isCompleted && (
        <div
          className="relative overflow-hidden rounded-2xl border bg-white"
          style={{ borderColor: "#F4D2D4", boxShadow: "0 4px 14px rgba(17,24,39,0.06), 0 16px 36px rgba(17,24,39,0.08)" }}
        >
          <div style={{ height: 3, background: "linear-gradient(90deg, #DE1921, #A6131A)" }} />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ru-red/10">
                <FileType size={26} className="text-ru-red" strokeWidth={2.2} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-ru-red">Client Report</div>
                <div className="mt-1 text-xl font-bold tracking-tight text-neutral-dark">Download Reports</div>
                {crawl.completed_at && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ru-grey/10 px-2.5 py-1 text-[11px] font-medium text-ru-grey">
                    <Calendar size={11} strokeWidth={2.3} />
                    Generated on {formatDate(crawl.completed_at)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Masterfile", icon: FileText, slug: "all" },
                { label: "Word Document", icon: FileType },
                { label: "PPT", icon: Layers },
                { label: "Raw File", icon: Folder },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    {item.slug ? (
                      <a
                        href={`${API_URL}/api/crawls/${crawl.id}/download/masterfile/${item.slug}`}
                        download
                        className="inline-flex items-center gap-2 rounded-lg border border-ru-red bg-ru-red px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        <Icon size={15} strokeWidth={2.2} />
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 rounded-lg border border-ru-grey/20 bg-ru-grey/5 px-5 py-2.5 text-sm font-semibold text-ru-grey cursor-not-allowed opacity-60"
                      >
                        <Icon size={15} strokeWidth={2.2} />
                        {item.label}
                      </button>
                    )}
                    <span className="text-[10px] font-medium text-ru-grey/60 bg-ru-grey/10 rounded px-1.5 py-0.5">Coming in V2</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error message — only when error_message exists */}
      {crawl.error_message && (
        <div className="rounded-2xl border border-ru-red/20 bg-ru-red/5 p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ru-red">Error</p>
          <p className="text-sm text-neutral-dark">{crawl.error_message}</p>
        </div>
      )}
    </div>
  );
}
