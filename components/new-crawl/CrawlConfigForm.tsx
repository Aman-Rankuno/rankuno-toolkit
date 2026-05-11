"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrawlConfig, CrawlSource, CrawlType } from "./NewCrawlForm";

const CRAWL_TYPES: {
  value: CrawlType;
  label: string;
  description: string;
}[] = [
  {
    value: "full-audit",
    label: "Full Audit",
    description: "Complete site crawl with all SEO checks",
  },
  {
    value: "advanced-audit",
    label: "Advanced Audit",
    description: "Deep audit with custom extraction rules",
  },
  {
    value: "js-crawl",
    label: "JS Crawl",
    description: "JavaScript rendered crawl via headless browser",
  },
  {
    value: "orphan-pages",
    label: "Orphan Pages",
    description: "Detect pages with no internal links pointing to them",
  },
  {
    value: "sitemap-generator",
    label: "Sitemap Generator",
    description: "Generate an XML sitemap from crawl results",
  },
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
    if (!config.crawlType) {
      alert("Please select a crawl type.");
      return;
    }
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

  return (
    <div className="flex flex-col gap-6">
      {/* SF Config */}
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ru-grey">
          Screaming Frog Configuration
        </p>
        <div className="flex flex-col gap-2">
          {[
            { value: "", label: "Default", desc: "Use Screaming Frog default settings" },
            { value: "SEO Spider Config - Basic.seospiderconfig", label: "Basic", desc: "Basic crawl with essential SEO checks" },
            { value: "SEO Spider Config - Full crawl.seospiderconfig", label: "Full Crawl", desc: "Complete site crawl with all SEO checks" },
            { value: "SEO Spider Config - Java Script.seospiderconfig", label: "JS Crawl", desc: "JavaScript rendered crawl via headless browser" },
            { value: "SEO Spider Config - Basic (with URL parameter).seospiderconfig", label: "Basic (URL Parameter)", desc: "Basic crawl including URL parameters" },
            { value: "SEO Spider Config - Full crawl ( with URL parameter).seospiderconfig", label: "Full Crawl (URL Parameter)", desc: "Full crawl including URL parameters" },
            { value: "SEO Spider Config - Java Script ( with URL parameter).seospiderconfig", label: "JS Crawl (URL Parameter)", desc: "JS crawl including URL parameters" },
          ].map((cfg) => (
            <button
              key={cfg.value}
              type="button"
              onClick={() => set("configFile", cfg.value)}
              className={cn(
                "flex items-center gap-4 rounded-lg border px-4 py-3.5 text-left transition-colors",
                config.configFile === cfg.value
                  ? "border-ru-red bg-ru-red/5"
                  : "border-ru-grey/20 bg-white hover:border-ru-grey/40 hover:bg-ru-grey/5"
              )}
            >
              <span className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                config.configFile === cfg.value
                  ? "border-ru-red bg-ru-red"
                  : "border-ru-grey/40 bg-white"
              )}>
                {config.configFile === cfg.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <div>
                <p className={cn("text-sm font-medium", config.configFile === cfg.value ? "text-ru-red" : "text-neutral-dark")}>
                  {cfg.label}
                </p>
                <p className="text-xs text-ru-grey">{cfg.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      
      {/* Crawl Type */}
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ru-grey">
          Crawl Type
        </p>
        <div className="flex flex-col gap-2">
          {CRAWL_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => set("crawlType", type.value)}
              className={cn(
                "flex items-center gap-4 rounded-lg border px-4 py-3.5 text-left transition-colors",
                config.crawlType === type.value
                  ? "border-ru-red bg-ru-red/5"
                  : "border-ru-grey/20 bg-white hover:border-ru-grey/40 hover:bg-ru-grey/5"
              )}
            >
              {/* Radio dot */}
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  config.crawlType === type.value
                    ? "border-ru-red bg-ru-red"
                    : "border-ru-grey/40 bg-white"
                )}
              >
                {config.crawlType === type.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    config.crawlType === type.value
                      ? "text-ru-red"
                      : "text-neutral-dark"
                  )}
                >
                  {type.label}
                </p>
                <p className="text-xs text-ru-grey">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Config */}
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ru-grey">
          Configuration
        </p>
        <div className="flex flex-col gap-2">
          {/* Domain / URLs - required */}
          <AccordionSection
            label={isFullSite ? "Domain" : "URLs"}
            sectionKey="target"
            isOpen={isOpen("target")}
            onToggle={() => toggleSection("target")}
            required
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

          {/* Include & Exclude */}
          <AccordionSection
            label="Include & Exclude"
            sectionKey="include-exclude"
            isOpen={isOpen("include-exclude")}
            onToggle={() => toggleSection("include-exclude")}
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

          {/* GSC Settings */}
          <AccordionSection
            label="Google Search Console"
            sectionKey="gsc"
            isOpen={isOpen("gsc")}
            onToggle={() => toggleSection("gsc")}
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
                    {["Desktop", "Mobile", "Tablet"].map((d) => (
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

          {/* Device & User Agent */}
          <AccordionSection
            label="Device & User Agent"
            sectionKey="device"
            isOpen={isOpen("device")}
            onToggle={() => toggleSection("device")}
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

          {/* APIs */}
          <AccordionSection
            label="APIs"
            sectionKey="apis"
            isOpen={isOpen("apis")}
            onToggle={() => toggleSection("apis")}
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

      {/* Start Crawl */}
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="w-full rounded-md bg-ru-red py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-red disabled:opacity-60"
      >
        {loading ? "Starting..." : "Start Crawl"}
      </button>
    </div>
  );
}

type AccordionSectionProps = {
  label: string;
  sectionKey: AccordionKey;
  isOpen: boolean;
  onToggle: () => void;
  required?: boolean;
  children: React.ReactNode;
};

function AccordionSection({
  label,
  isOpen,
  onToggle,
  required,
  children,
}: AccordionSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-ru-grey/15 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-neutral-dark">
          {label}
          {required && (
            <span className="rounded-sm bg-ru-red/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-red">
              Required
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