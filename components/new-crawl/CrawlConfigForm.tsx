"use client";
 
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Filter,
  LineChart,
  Monitor,
  Key,
  PlayCircle,
  Search,
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

const TARGET_DOMAINS = [
  "http://architectural.flosusa.com/",
  "http://rankuno.com/",
  "http://usa.flos.com/",
  "http://www.appetizersusa.com/",
  "http://www.brkthrudigital.com/",
  "http://www.frozendessertsupplies.com/",
  "http://www.gep.com/",
  "http://www.rankuno.com/",
  "http://www.sculptwareonline.com/",
  "http://www.seniority.in/",
  "https://architectural.flosusa.com/",
  "https://biotech.pall.com/",
  "https://cellandgene.com/",
  "https://chemicals-polymers.pall.com/",
  "https://eu.idtdna.com/",
  "https://fitday.in/",
  "https://food-beverage.pall.com/",
  "https://fractionalcmo.io/",
  "https://frozendessertsupplies.com/",
  "https://laboratory.pall.com/",
  "https://lifesciences.danaher.com/",
  "https://logicsource.com/",
  "https://medical.pall.com/",
  "https://oil-gas.pall.com/",
  "https://osacommerce.com/",
  "https://power-utilities.pall.com/",
  "https://prospur.io/",
  "https://reserveage.tlcchealth.com/",
  "https://sciex.com/",
  "https://service-tree.com/",
  "https://sg.idtdna.com/",
  "https://shop.leica-microsystems.com/",
  "https://shop.pall.co.uk/",
  "https://shop.pall.com/",
  "https://twinlab.tlcchealth.com/",
  "https://vitaquest.com/",
  "https://www.ababy.com/",
  "https://www.abcam.cn/",
  "https://www.abcam.co.jp/",
  "https://www.abcam.com/",
  "https://www.abcam.com/en-us/",
  "https://www.anniesannuals.com/",
  "https://www.appetizersusa.com/",
  "https://www.bhadepay.com/",
  "https://www.bioprocessonline.com/",
  "https://www.bloomingdales.com/",
  "https://www.brkthrudigital.com/",
  "https://www.cellandgene.com/",
  "https://www.clinicalleader.com/",
  "https://www.danaher.com/",
  "https://www.fairychimneys.com.au/",
  "https://www.frozendessertsupplies.com/",
  "https://www.genedata.com/",
  "https://www.gep.com/",
  "https://www.idtdna.com/",
  "https://www.leica-microsystems.com.cn/",
  "https://www.leica-microsystems.com/",
  "https://www.leica-microsystems.com/de/",
  "https://www.leica-microsystems.com/fr/",
  "https://www.leica-microsystems.com/it/",
  "https://www.leica-microsystems.com/jp/",
  "https://www.leica-microsystems.com/ko/",
  "https://www.leica-microsystems.com/pt/",
  "https://www.letsrenovate.com/",
  "https://www.moleculardevices.com/",
  "https://www.outsourcedpharma.com/",
  "https://www.pall.co.uk/",
  "https://www.phenomenex.com/",
  "https://www.rankuno.com/solutions/",
  "https://www.resvitale.co/",
  "https://www.sculptwareonline.com/",
  "https://www.seniority.in/",
  "https://www.seniority.in/blog/",
  "https://www.twinlab.com/",
  "https://www.virima.com/",
  "https://www.wateronline.com/",
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
  if (config.gscEmail.trim() && config.gscProperty.trim())
    summaryParts.push("GSC linked");
  if (config.gaAccount.trim() && config.ga4Account.trim() && config.ga4Property.trim() && config.ga4Stream.trim())
  summaryParts.push("GA4 linked");
  if (config.device)
    summaryParts.push(
      config.device.charAt(0).toUpperCase() + config.device.slice(1)
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-7 lg:gap-8">
      {/* 02 — Screaming Frog Configuration */}
      {/* 01 — Target */}
      <div>
        <SectionHeader
          number="01"
          title={isFullSite ? "Target Domain" : "Target URLs"}
          complete={targetComplete}
        />
        <div className="mt-3 sm:mt-4">
            {isFullSite ? (
          <DomainDropdown
              value={config.domain}
              options={TARGET_DOMAINS}
              onChange={(val) => set("domain", val)}
            />
          ) : (
            <textarea
              value={config.urls}
              onChange={(e) => set("urls", e.target.value)}
              rows={6}
              placeholder={"https://example.com/page-1\nhttps://example.com/page-2"}
              className="w-full resize-none rounded-md border border-ru-grey/25 bg-white px-3 py-3 font-mono text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
            />
          )}
          <p className="mt-1.5 text-xs text-ru-grey">
            {isFullSite
              ? "Full URL including https://. Must match the GSC property registered above if GSC is used."
              : "One URL per line. SF will crawl exactly this list, no link discovery."}
          </p>
        </div>
      </div>
      <div>
        <SectionHeader number="02" title="Screaming Frog Configuration" complete={true} />
        <div className="mt-3 sm:mt-4">
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
        
        <div className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3">
          <AccordionSection
  label="Google Analytics 4"
  icon={Key}
  sectionKey="apis"
  isOpen={isOpen("apis")}
  onToggle={() => toggleSection("apis")}
  complete={
    config.gaAccount.trim().length > 0 &&
    config.ga4Account.trim().length > 0 &&
    config.ga4Property.trim().length > 0 &&
    config.ga4Stream.trim().length > 0
  }
>
  <div className="flex flex-col gap-3">
    <div>
      <label className="mb-1 block text-xs font-medium text-ru-grey">Gmail Account</label>
      <input
        type="email"
        value={config.gaAccount}
        onChange={(e) => set("gaAccount", e.target.value)}
        placeholder="Rankuno"
        className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
      />
      <p className="mt-1.5 text-xs text-ru-grey">
        The Google account label as it appears in Screaming Frog. Same as the GSC field above if both use one login.
      </p>
    </div>

    <div>
      <label className="mb-1 block text-xs font-medium text-ru-grey">GA4 Account</label>
      <input
        type="text"
        value={config.ga4Account}
        onChange={(e) => set("ga4Account", e.target.value)}
        placeholder="RankUno"
        className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
      />
      <p className="mt-1.5 text-xs text-ru-grey">
        GA4 Account name, exactly as it appears in the SF Account dropdown.
      </p>
    </div>

    <div>
      <label className="mb-1 block text-xs font-medium text-ru-grey">GA4 Property</label>
      <input
        type="text"
        value={config.ga4Property}
        onChange={(e) => set("ga4Property", e.target.value)}
        placeholder="RankUno (New Reporting)"
        className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
      />
      <p className="mt-1.5 text-xs text-ru-grey">
        Property label, not the numeric ID. Copy verbatim from the SF Property dropdown.
      </p>
    </div>

    <div>
      <label className="mb-1 block text-xs font-medium text-ru-grey">GA4 Data Stream</label>
      <input
        type="text"
        value={config.ga4Stream}
        onChange={(e) => set("ga4Stream", e.target.value)}
        placeholder="rankuno.com"
        className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
      />
      <p className="mt-1.5 text-xs text-ru-grey">
        Data Stream label from the SF Data Stream dropdown.
      </p>
    </div>
  </div>
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
            complete={
              config.gscEmail.trim().length > 0 &&
              config.gscProperty.trim().length > 0
            }
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  Gmail Account
                </label>
                <input
                  type="email"
                  value={config.gscEmail}
                  onChange={(e) => set("gscEmail", e.target.value)}
                  placeholder="team@rankuno.com"
                  className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
                <p className="mt-1.5 text-xs text-ru-grey">
                  The Google account already authenticated inside Screaming Frog on the SF server.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ru-grey">
                  GSC Property
                </label>
                <input
                  type="text"
                  value={config.gscProperty}
                  onChange={(e) => set("gscProperty", e.target.value)}
                  placeholder="sc-domain:manulife.ca"
                  className="w-full rounded-md border border-ru-grey/25 px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                />
                <p className="mt-1.5 text-xs text-ru-grey">
                  Format:{" "}
                  <code className="rounded bg-ru-grey/10 px-1 py-0.5 text-[11px]">
                    sc-domain:example.com
                  </code>{" "}
                  for domain properties, or{" "}
                  <code className="rounded bg-ru-grey/10 px-1 py-0.5 text-[11px]">
                    https://www.example.com/
                  </code>{" "}
                  for URL prefix properties.
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-ru-grey/30 bg-ru-grey/5 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-sm bg-ru-grey/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-grey">
                    Coming in v2
                  </span>
                  <span className="text-[11px] text-ru-grey">
                    Requires a per-client .seospiderconfig file.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ru-grey/60">
                      Device
                    </label>
                    <select
                      disabled
                      value={config.gscDevice}
                      onChange={(e) => set("gscDevice", e.target.value)}
                      className="w-full cursor-not-allowed rounded-md border border-ru-grey/20 bg-white/60 px-3 py-2.5 text-sm text-ru-grey/60"
                    >
                      {DEVICES.map((d) => (
                        <option key={d} value={d.toLowerCase()}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ru-grey/60">
                      Date Range
                    </label>
                    <select
                      disabled
                      value={config.gscDateRange}
                      onChange={(e) => set("gscDateRange", e.target.value)}
                      className="w-full cursor-not-allowed rounded-md border border-ru-grey/20 bg-white/60 px-3 py-2.5 text-sm text-ru-grey/60"
                    >
                      {GSC_DATE_RANGES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <label className="mb-1 block text-xs font-medium text-ru-grey/60">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={config.gscCountry}
                    onChange={(e) => set("gscCountry", e.target.value)}
                    placeholder="e.g. Canada, United States"
                    className="w-full cursor-not-allowed rounded-md border border-ru-grey/20 bg-white/60 px-3 py-2.5 text-sm text-ru-grey/60 placeholder:text-ru-grey/40"
                  />
                </div>
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

          
        </div>
      </div>

      {/* Summary + Start */}
      {/* Summary + Start */}
      <div className="rounded-xl border border-ru-grey/20 bg-white p-5 sm:p-6 lg:p-7 shadow-lg">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ru-red/10 text-ru-red">
            <PlayCircle className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-ru-grey">
              Ready to crawl
            </p>
            <p className="mt-2 text-sm text-neutral-dark">
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
        className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-ru-grey/5"
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

/* ============================================================

   Custom Domain Dropdown

   Opens DOWN, searchable, fully styled (no native <select>)

   ============================================================ */

function DomainDropdown({

  value,

  options,

  onChange,

}: {

  value: string;

  options: string[];

  onChange: (val: string) => void;

}) {

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const wrapRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {

    function handleClickOutside(e: MouseEvent) {

      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {

        setOpen(false);

        setSearch("");

      }

    }

    if (open) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [open]);
 
  const filtered = search

    ? options.filter((url) => url.toLowerCase().includes(search.toLowerCase()))

    : options;
 
  return (
<div ref={wrapRef} className="relative w-full">
<button

        type="button"

        onClick={() => setOpen((o) => !o)}

        className={cn(

          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-3 text-left text-sm transition-colors",

          open ? "border-ru-red ring-2 ring-ru-red/20" : "border-ru-grey/25 hover:border-ru-grey/40",

          value ? "font-medium text-neutral-dark" : "text-ru-grey/60"

        )}
>
<span className="truncate">{value || "Select a domain..."}</span>
<ChevronDown

          className={cn(

            "ml-2 h-4 w-4 shrink-0 text-ru-grey transition-transform",

            open && "rotate-180"

          )}

          strokeWidth={2}

        />
</button>
 
      {open && (
<div className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-ru-grey/20 bg-white shadow-xl">

          {/* Search input */}
<div className="border-b border-ru-grey/10 p-2">
<div className="relative">
<Search

                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ru-grey"

                strokeWidth={2}

              />
<input

                autoFocus

                type="text"

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Search domains..."

                className="w-full rounded-md border border-ru-grey/15 bg-ru-grey/5 py-2 pl-8 pr-3 text-sm text-neutral-dark placeholder:text-ru-grey/50 focus:border-ru-red focus:bg-white focus:outline-none"

              />
</div>
</div>
 
          {/* Options list */}
<div className="max-h-72 overflow-y-auto py-1">

            {filtered.length === 0 ? (
<div className="px-3 py-6 text-center text-xs text-ru-grey">

                No domains match &quot;{search}&quot;
</div>

            ) : (

              filtered.map((url) => {

                const isSelected = url === value;

                return (
<button

                    key={url}

                    type="button"

                    onClick={() => {

                      onChange(url);

                      setOpen(false);

                      setSearch("");

                    }}

                    className={cn(

                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",

                      isSelected

                        ? "bg-ru-red/5 text-ru-red"

                        : "text-neutral-dark hover:bg-ru-grey/5"

                    )}
>
<span className="truncate">{url}</span>

                    {isSelected && (
<Check className="h-4 w-4 shrink-0 text-ru-red" strokeWidth={2.5} />

                    )}
</button>

                );

              })

            )}
</div>
 
          {/* Footer count */}
<div className="border-t border-ru-grey/10 bg-ru-grey/5 px-3 py-1.5 text-[11px] font-medium text-ru-grey">

            {filtered.length} of {options.length} domains
</div>
</div>

      )}
</div>

  );

}
 