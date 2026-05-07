 "use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CrawlConfigForm } from "./CrawlConfigForm";

export type CrawlSource = "full-site" | "url-list";

export type CrawlType =
  | "full-audit"
  | "advanced-audit"
  | "js-crawl"
  | "orphan-pages"
  | "sitemap-generator";

export type CrawlConfig = {
  crawlType: CrawlType | null;
  domain: string;
  startUrl: string;
  urls: string;
  includePatterns: string;
  excludePatterns: string;
  gscEmail: string;
  gscDevice: string;
  gscDateRange: string;
  gscCountry: string;
  device: string;
  apiKey: string;
};

export const defaultConfig: CrawlConfig = {
  crawlType: null,
  domain: "",
  startUrl: "",
  urls: "",
  includePatterns: "",
  excludePatterns: "",
  gscEmail: "",
  gscDevice: "desktop",
  gscDateRange: "last-3-months",
  gscCountry: "",
  device: "desktop",
  apiKey: "",
};

export function NewCrawlForm() {
  const [source, setSource] = useState<CrawlSource | null>(null);
  const [config, setConfig] = useState<CrawlConfig>(defaultConfig);

  function handleStart() {
    console.log("Starting crawl:", { source, config });
    alert(
      `Crawl started: ${source} / ${config.crawlType} / ${
        source === "full-site" ? config.domain : "URL list"
      }`
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Source selector */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ru-grey">
          Select Source
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                value: "full-site" as CrawlSource,
                label: "Full Site",
                desc: "Crawl an entire domain from the root URL",
              },
              {
                value: "url-list" as CrawlSource,
                label: "URL List",
                desc: "Crawl a specific list of URLs you provide",
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setSource(opt.value);
                setConfig(defaultConfig);
              }}
              className={cn(
                "rounded-xl border-2 px-5 py-4 text-left transition-colors",
                source === opt.value
                  ? "border-ru-red bg-ru-red/5"
                  : "border-ru-grey/20 bg-white hover:border-ru-grey/40"
              )}
            >
              <p
                className={cn(
                  "text-base font-semibold",
                  source === opt.value ? "text-ru-red" : "text-neutral-dark"
                )}
              >
                {opt.label}
              </p>
              <p className="mt-0.5 text-xs text-ru-grey">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Config form, only shown after source selected */}
      {source !== null && (
        <CrawlConfigForm
          source={source}
          config={config}
          onChange={setConfig}
          onStart={handleStart}
        />
      )}
    </div>
  );
}