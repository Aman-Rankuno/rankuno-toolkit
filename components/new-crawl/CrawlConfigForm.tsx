"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Filter,
  LineChart,
  Monitor,
  Key,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrawlConfig, CrawlSource } from "./NewCrawlForm";

const SF_CONFIGS = [
  { value: "", label: "Default" },
  { value: "SEO Spider Config - Basic.seospiderconfig", label: "Basic" },
  { value: "SEO Spider Config - Basic with URL parameter.seospiderconfig", label: "Basic (URL Parameter)" },
  { value: "SEO Spider Config - Advance.seospiderconfig", label: "Advanced" },
  { value: "SEO Spider Config - Advance with URL parameter.seospiderconfig", label: "Advanced (URL Parameter)" },
  { value: "SEO Spider Config - Java Script.seospiderconfig", label: "JS Crawl" },
  { value: "SEO Spider Config - Java Script with URL parameter.seospiderconfig", label: "JS Crawl (URL Parameter)" },
];

const DEVICES = ["Desktop", "Mobile", "Tablet"];

const GSC_DATE_RANGES = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-28-days", label: "Last 28 days" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-6-months", label: "Last 6 months" },
  { value: "last-12-months", label: "Last 12 months" },
  { value: "last-16-months", label: "Last 16 months" },
];

type AccordionKey = "target" | "include-exclude" | "gsc" | "device" | "apis";

type CrawlConfigFormProps = {
  source: CrawlSource;
  config: CrawlConfig;
  onChange: (config: CrawlConfig) => void;
  onStart: () => void;
  loading?: boolean;
};

export function CrawlConfigForm({
  source,
  config,
  onChange,
  onStart,
  loading = false,
}: CrawlConfigFormProps) {
  const [openSections, setOpenSections] = useState<AccordionKey[]>(["target"]);
  const isFullSite = source === "full-site";

  function toggleSection(key: AccordionKey) {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function isOpen(key: AccordionKey) {
    return openSections.includes(key);
  }

  function set(field: keyof CrawlConfig, value: string | null) {
    onChange({ ...config, [field]: value });
  }

  function handleStart() {
    
    if (isFullSite && !config.domain.trim()) {
      alert("Please enter a domain.");
      return;
    }
    if (!isFullSite && !config.urls.trim()) {
      alert("Please enter at least one URL.");
      return;
    }
    onStart();
  }

  const targetComplete = isFullSite
    ? config.domain.trim().length > 0
    : config.urls.trim().length > 0;
  const selectedSfConfig = SF_CONFIGS.find((c) => c.value === config.configFile);

  const summaryParts: string[] = [];
  if (isFullSite && config.domain.trim()) {
    summaryParts.push(config.domain.trim());
  } else if (!isFullSite) {
    const lines = config.urls.trim().split("\n").filter(Boolean).length;
    if (lines > 0) summaryParts.push(`${lines} URL${lines === 1 ? "" : "s"}`);
  }
  if (selectedSfConfig && selectedSfConfig.label !== "Default")
    summaryParts.push(selectedSfConfig.label);
  if (config.gscEmail.trim()) summaryParts.push("GSC linked");
  if (config.device)
    summaryParts.push(
      config.device.charAt(0).toUpperCase() + config.device.slice(1)
    );

  return (
    <div className="flex flex-col gap-8">
      {/* 02 — Screaming Frog Configuration */}
      <div>
        <SectionHeader number="02" title="Screaming Frog Configuration" complete={true} />
        <div className="mt-3">
          <select
            value={config.configFile}
            onChange={(e) => set("configFile", e.target.value)}
            className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-3 text-sm font-medium text-neutral-dark focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
          >
            {SF_CONFIGS.map((cfg) => (
              <option key={cfg.value} value={cfg.value}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 03 — Configuration */}
      <div>
        <SectionHeader number="03" title="Configuration" />
        <div className="mt-3 flex flex-col gap-2">
          <AccordionSection
            label={isFullSite ? "Domain" : "URLs"}
            icon={Filter}
            sectionKey="target"
            isOpen={isOpen("target")}
            onToggle={() => toggleSection("target")}
            required
            complete={targetComplete}
          >
            {isFullSite ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ru-grey">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={config.domain}
                    onChange={(e) => set("domain", e.target.value)}
                    placeholder="e.g. manulife.ca"
                    className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ru-grey">
                    Start URL
                  </label>
                  <input
                    type="text"
                    value={config.startUrl}
                    onChange={(e) => set("startUrl", e.target.value)}
                    placeholder="https://manulife.ca"
                    className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  Paste URLs (one per line)
                </label>
                <textarea
                  value={config.urls}
                  onChange={(e) => set("urls", e.target.value)}
                  rows={6}
                  placeholder={"https://example.com/page-1\nhttps://example.com/page-2"}
                  className="w-full resize-none rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
              </div>
            )}
          </AccordionSection>

          <AccordionSection
            label="Include & Exclude"
            icon={Filter}
            sectionKey="include-exclude"
            isOpen={isOpen("include-exclude")}
            onToggle={() => toggleSection("include-exclude")}
            complete={
              config.includePatterns.trim().length > 0 ||
              config.excludePatterns.trim().length > 0
            }
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  Include patterns
                </label>
                <textarea
                  value={config.includePatterns}
                  onChange={(e) => set("includePatterns", e.target.value)}
                  rows={2}
                  placeholder={"/blog/\n/products/"}
                  className="w-full resize-none rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  Exclude patterns
                </label>
                <textarea
                  value={config.excludePatterns}
                  onChange={(e) => set("excludePatterns", e.target.value)}
                  rows={2}
                  placeholder={"/admin/\n/login/"}
                  className="w-full resize-none rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            label="Google Search Console"
            icon={LineChart}
            sectionKey="gsc"
            isOpen={isOpen("gsc")}
            onToggle={() => toggleSection("gsc")}
            complete={config.gscEmail.trim().length > 0}
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  GSC Gmail Account
                </label>
                <input
                  type="email"
                  value={config.gscEmail}
                  onChange={(e) => set("gscEmail", e.target.value)}
                  placeholder="team@rankuno.com"
                  className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ru-grey">
                    Device
                  </label>
                  <select
                    value={config.gscDevice}
                    onChange={(e) => set("gscDevice", e.target.value)}
                    className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                  >
                    {DEVICES.map((d) => (
                      <option key={d} value={d.toLowerCase()}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ru-grey">
                    Date Range
                  </label>
                  <select
                    value={config.gscDateRange}
                    onChange={(e) => set("gscDateRange", e.target.value)}
                    className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                  >
                    {GSC_DATE_RANGES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  Country
                </label>
                <input
                  type="text"
                  value={config.gscCountry}
                  onChange={(e) => set("gscCountry", e.target.value)}
                  placeholder="e.g. Canada, United States"
                  className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            label="Device & User Agent"
            icon={Monitor}
            sectionKey="device"
            isOpen={isOpen("device")}
            onToggle={() => toggleSection("device")}
            complete={config.device !== "desktop"}
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ru-grey">
                Crawl Device
              </label>
              <div className="flex gap-2">
                {DEVICES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set("device", d.toLowerCase())}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      config.device === d.toLowerCase()
                        ? "border-ru-red bg-ru-red/5 text-ru-red"
                        : "border-ru-grey/25 text-ru-grey hover:border-ru-grey/50"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            label="APIs"
            icon={Key}
            sectionKey="apis"
            isOpen={isOpen("apis")}
            onToggle={() => toggleSection("apis")}
            complete={config.apiKey.trim().length > 0}
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-ru-grey">
                API Key
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => set("apiKey", e.target.value)}
                placeholder="Enter API key"
                className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm font-mono text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
              />
              <p className="mt-1.5 text-xs text-ru-grey">
                Used for third-party integrations. Leave blank if not required.
              </p>
            </div>
          </AccordionSection>
        </div>
      </div>

      {/* Summary + Start */}
      <div className="rounded-xl border border-ru-grey/15 bg-white p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ru-red/10 text-ru-red">
            <PlayCircle className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
              Ready to crawl
            </p>
            <p className="mt-1 text-sm text-neutral-dark">
              {summaryParts.length === 0 ? (
                <span className="text-ru-grey/70">
                  Fill in the required fields above to start.
                </span>
              ) : (
                summaryParts.map((part, i) => (
                  <span key={i}>
                    <span className="font-semibold">{part}</span>
                    {i < summaryParts.length - 1 && (
                      <span className="text-ru-grey"> · </span>
                    )}
                  </span>
                ))
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="w-full rounded-md bg-ru-red py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-red disabled:opacity-60"
        >
          {loading ? "Starting..." : "Start Crawl"}
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  complete,
}: {
  number: string;
  title: string;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold tabular-nums",
          complete ? "bg-ru-red text-white" : "bg-ru-grey/10 text-ru-grey"
        )}
      >
        {complete ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : number}
      </span>
      <p className="text-sm font-semibold uppercase tracking-wider text-ru-grey">
        {title}
      </p>
    </div>
  );
}

type AccordionSectionProps = {
  label: string;
  icon?: React.ElementType;
  sectionKey: AccordionKey;
  isOpen: boolean;
  onToggle: () => void;
  required?: boolean;
  complete?: boolean;
  children: React.ReactNode;
};

function AccordionSection({
  label,
  icon: Icon,
  isOpen,
  onToggle,
  required,
  complete,
  children,
}: AccordionSectionProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white transition-colors",
        complete ? "border-ru-grey/30" : "border-ru-grey/15"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-ru-grey/5"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-neutral-dark">
          {Icon && <Icon className="h-4 w-4 text-ru-grey" strokeWidth={2} />}
          {label}
          {required && (
            <span className="rounded-sm bg-ru-red/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-red">
              Required
            </span>
          )}
          {complete && !required && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15">
              <Check className="h-2.5 w-2.5 text-emerald-700" strokeWidth={3} />
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-ru-grey" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-4 w-4 text-ru-grey" strokeWidth={2} />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-ru-grey/10 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}