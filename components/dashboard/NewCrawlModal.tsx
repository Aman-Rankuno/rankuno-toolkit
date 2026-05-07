"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type CrawlType = "full-site" | "url-list";

type NewCrawlModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewCrawlModal({ isOpen, onClose }: NewCrawlModalProps) {
  const [crawlType, setCrawlType] = useState<CrawlType>("full-site");
  const [domain, setDomain] = useState("");
  const [urls, setUrls] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    // Phase 2: will call the backend API here
    console.log("Starting crawl:", { crawlType, domain, urls });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-dark">
              New Crawl
            </h2>
            <p className="mt-0.5 text-sm text-ru-grey">
              Configure and start a new SEO crawl
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-ru-grey transition-colors hover:bg-ru-grey/10 hover:text-neutral-dark"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Crawl Type */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-neutral-dark">
            Crawl Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["full-site", "url-list"] as CrawlType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCrawlType(type)}
                className={cn(
                  "rounded-md border px-4 py-2.5 text-sm font-medium transition-colors",
                  crawlType === type
                    ? "border-ru-red bg-ru-red/5 text-ru-red"
                    : "border-ru-grey/25 bg-white text-ru-grey hover:border-ru-grey/50"
                )}
              >
                {type === "full-site" ? "Full Site" : "URL List"}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional field */}
        {crawlType === "full-site" ? (
          <div className="mb-6">
            <label
              htmlFor="domain"
              className="mb-1.5 block text-sm font-medium text-neutral-dark"
            >
              Domain
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. manulife.ca"
              className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/50 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
            />
          </div>
        ) : (
          <div className="mb-6">
            <label
              htmlFor="urls"
              className="mb-1.5 block text-sm font-medium text-neutral-dark"
            >
              URLs
              <span className="ml-1 text-ru-grey/60">(one per line)</span>
            </label>
            <textarea
              id="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={"https://example.com/page-1\nhttps://example.com/page-2"}
              rows={5}
              className="w-full resize-none rounded-md border border-ru-grey/25 bg-white px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/50 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-md bg-ru-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-red"
          >
            Start Crawl
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ru-grey/25 px-4 py-2.5 text-sm font-medium text-neutral-dark transition-colors hover:bg-ru-grey/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}