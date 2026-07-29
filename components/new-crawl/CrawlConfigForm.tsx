"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Filter,
  LineChart,
  Key,
  PlayCircle,
  Search,
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrawlConfig, CrawlSource } from "./NewCrawlForm";
import { TARGET_DOMAINS } from "./domains";
import { fetchConfigs, uploadConfig, deleteConfig, type ConfigEntry } from "@/lib/api";

const GA4_EMAILS = [
  "DHLS",
  "Manoj-DHLS",
  "Rankuno",
  "access@rankuno.com",
  "analysis@serialscaling.com",
  "infy.technologies@gmail.com",
  "phenomenex@rankuno.com",
  "sutrishna@serialscaling.com",
];

const GSC_EMAILS = [
  "DHLS",
  "Manoj-DHLS",
  "Rankuno.com",
  "access@rankuno.com",
  "analysis@serialscaling.com",
  "infy.technologies@gmail.com",
  "phenomenex@rankuno.com",
  "sutrishna.rankuno@gmail.com",
  "sutrishna@serialscaling.com",
];

// Fallback list used only if the configs API is unreachable, so the form
// still works during a backend restart. Matches the presets on disk.
const SF_CONFIGS_FALLBACK = [
  { value: "SEO Spider Config - Basic.seospiderconfig", label: "Basic" },
  { value: "SEO Spider Config - Basic with URL parameter.seospiderconfig", label: "Basic (URL Parameter)" },
  { value: "SEO Spider Config - Advance.seospiderconfig", label: "Advanced" },
  { value: "SEO Spider Config - Advance with URL parameter.seospiderconfig", label: "Advanced (URL Parameter)" },
  { value: "SEO Spider Config - Java Script.seospiderconfig", label: "JS Crawl" },
  { value: "SEO Spider Config - Java Script with URL parameter.seospiderconfig", label: "JS Crawl (URL Parameter)" },
];

// Strip the shared filename prefix for friendlier preset labels
function presetLabel(name: string): string {
  return name.replace(/^SEO Spider Config - /i, "");
}

const DEVICES = ["Desktop", "Mobile", "Tablet"];

const GSC_DATE_RANGES = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-28-days", label: "Last 28 days" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-6-months", label: "Last 6 months" },
  { value: "last-12-months", label: "Last 12 months" },
  { value: "last-16-months", label: "Last 16 months" },
];

type AccordionKey = "target" | "include-exclude" | "gsc" | "apis";

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

  // Config library state
  const [presetConfigs, setPresetConfigs] = useState<ConfigEntry[]>([]);
  const [customConfigs, setCustomConfigs] = useState<ConfigEntry[]>([]);
  const [configsLoaded, setConfigsLoaded] = useState(false);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [manageError, setManageError] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchConfigs()
      .then((data) => {
        if (cancelled) return;
        setPresetConfigs(data.presets);
        setCustomConfigs(data.custom.filter((c) => !c.missing_on_disk));
        setConfigsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        // API unreachable: fall back to the static preset list
        setPresetConfigs(
          SF_CONFIGS_FALLBACK.map((c) => ({
            id: c.value,
            name: c.label,
            kind: "preset" as const,
            config_file: c.value,
          }))
        );
        setConfigsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  async function handleUpload() {
    setUploadError("");
    setUploadSuccess("");
    if (!uploadFile) {
      setUploadError("Choose a .seospiderconfig file first.");
      return;
    }
    if (!uploadFile.name.toLowerCase().endsWith(".seospiderconfig")) {
      setUploadError("File must be a .seospiderconfig exported from Screaming Frog.");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadConfig(uploadFile, uploadName.trim());
      // Refresh the library and auto-select the new config
      const data = await fetchConfigs();
      setPresetConfigs(data.presets);
      setCustomConfigs(data.custom.filter((c) => !c.missing_on_disk));
      set("configFile", result.config_file);
      setUploadSuccess(`"${result.name}" uploaded and selected.`);
      setUploadFile(null);
      setUploadName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowUpload(false);
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Upload failed. Check the backend is running."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(cfg: ConfigEntry) {
    const ok = window.confirm(
      `Delete "${cfg.name}"? Past crawls that used it keep their saved configuration, but it will no longer be selectable for new crawls.`
    );
    if (!ok) return;
    setManageError("");
    setDeletingId(cfg.id);
    try {
      await deleteConfig(cfg.id);
      const data = await fetchConfigs();
      setPresetConfigs(data.presets);
      setCustomConfigs(data.custom.filter((c) => !c.missing_on_disk));
      // If the deleted config was selected, fall back to Default
      if (config.configFile === cfg.config_file) {
        set("configFile", "");
      }
    } catch (e) {
      setManageError(
        e instanceof Error ? e.message : "Delete failed. Check the backend is running."
      );
    } finally {
      setDeletingId(null);
    }
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

  const selectedConfigEntry =
    presetConfigs.find((c) => c.config_file === config.configFile) ||
    customConfigs.find((c) => c.config_file === config.configFile);
  const selectedConfigLabel = selectedConfigEntry
    ? selectedConfigEntry.kind === "preset"
      ? presetLabel(selectedConfigEntry.name)
      : selectedConfigEntry.name
    : "";

  const summaryParts: string[] = [];
  if (isFullSite && config.domain.trim()) {
    summaryParts.push(config.domain.trim());
  } else if (!isFullSite) {
    const lines = config.urls.trim().split("\n").filter(Boolean).length;
    if (lines > 0) summaryParts.push(`${lines} URL${lines === 1 ? "" : "s"}`);
  }
  if (selectedConfigLabel) summaryParts.push(selectedConfigLabel);
  if (config.gscEmail.trim() && config.gscProperty.trim())
    summaryParts.push("GSC linked");
  if (config.gaAccount.trim() && config.ga4Account.trim() && config.ga4Property.trim() && config.ga4Stream.trim())
    summaryParts.push("GA4 linked");

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
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
          <p className="mt-1.5 mb-4 text-xs text-ru-grey">
            {isFullSite
              ? "Full URL including https://. Must match the GSC property registered above if GSC is used."
              : "One URL per line. SF will crawl exactly this list, no link discovery."}
          </p>
        </div>
      </div>

      {/* 02 — Screaming Frog Configuration */}
      <div className="mt-8">
        <SectionHeader number="02" title="Screaming Frog Configuration" complete={true} />
        <div className="mt-3 sm:mt-4">
          <select
            value={config.configFile}
            onChange={(e) => set("configFile", e.target.value)}
            disabled={!configsLoaded}
            className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-3 text-sm font-medium text-neutral-dark focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20 disabled:opacity-60"
          >
            <option value="">Default</option>
            {presetConfigs.length > 0 && (
              <optgroup label="Presets">
                {presetConfigs.map((cfg) => (
                  <option key={cfg.id} value={cfg.config_file}>
                    {presetLabel(cfg.name)}
                  </option>
                ))}
              </optgroup>
            )}
            {customConfigs.length > 0 && (
              <optgroup label="Custom Uploads">
                {customConfigs.map((cfg) => (
                  <option key={cfg.id} value={cfg.config_file}>
                    {cfg.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Upload custom config */}
          <div className="mt-2">
            {!showUpload ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(true);
                    setShowManage(false);
                    setUploadError("");
                    setUploadSuccess("");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ru-red/40 bg-ru-red/5 px-3 py-2 text-xs font-semibold text-ru-red transition-colors hover:bg-ru-red hover:text-white"
                >
                  <Upload className="h-3.5 w-3.5" strokeWidth={2} />
                  Upload custom config
                </button>
                {customConfigs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowManage((v) => !v);
                      setManageError("");
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors",
                      showManage
                        ? "border-ru-grey/40 bg-ru-grey/15 text-neutral-dark"
                        : "border-ru-grey/30 bg-white text-ru-grey hover:border-ru-grey/50 hover:text-neutral-dark"
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    {showManage ? "Close manage" : "Manage uploads"}
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-ru-grey/20 bg-ru-grey/5 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-grey">
                  Upload custom config
                </p>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".seospiderconfig"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setUploadFile(f);
                        setUploadError("");
                        if (f && !uploadName.trim()) {
                          setUploadName(f.name.replace(/\.seospiderconfig$/i, ""));
                        }
                      }}
                      className="w-full text-xs text-neutral-dark file:mr-3 file:rounded-md file:border-0 file:bg-ru-red/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ru-red hover:file:bg-ru-red/20"
                    />
                    <p className="mt-1 text-[11px] text-ru-grey">
                      Must be saved from Screaming Frog 19.x via File, Configuration, Save As.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="Display name, e.g. Manulife SG JS Crawl"
                    className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-2 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
                  />
                  {uploadError && (
                    <p className="text-xs text-ru-red">{uploadError}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading || !uploadFile}
                      className="rounded-md bg-ru-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-red disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpload(false);
                        setUploadError("");
                        setUploadFile(null);
                        setUploadName("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-ru-grey hover:bg-ru-grey/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {uploadSuccess && (
              <p className="mt-1.5 text-xs font-medium text-emerald-700">
                {uploadSuccess}
              </p>
            )}

            {/* Manage uploaded configs */}
            {showManage && !showUpload && customConfigs.length > 0 && (
              <div className="mt-2 rounded-lg border border-ru-grey/20 bg-ru-grey/5 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ru-grey">
                  Uploaded configs
                </p>
                <div className="flex flex-col gap-1.5">
                  {customConfigs.map((cfg) => (
                    <div
                      key={cfg.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-ru-grey/15 bg-white px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-dark">
                          {cfg.name}
                        </p>
                        <p className="truncate text-[11px] text-ru-grey">
                          {cfg.original_filename}
                          {cfg.size_bytes != null &&
                            ` · ${Math.round(cfg.size_bytes / 1024)} KB`}
                          {cfg.uploaded_at &&
                            ` · ${new Date(cfg.uploaded_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(cfg)}
                        disabled={deletingId === cfg.id}
                        title="Delete this config"
                        className="shrink-0 rounded-md p-1.5 text-ru-grey transition-colors hover:bg-ru-red/10 hover:text-ru-red disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
                {manageError && (
                  <p className="mt-2 text-xs text-ru-red">{manageError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 03 — Configuration */}
      <div>
        <div className="h-px bg-ru-grey/10" />
        <div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4">
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
                <EmailDropdown
                  value={config.gaAccount}
                  options={GA4_EMAILS}
                  onChange={(val) => set("gaAccount", val)}
                />
                <p className="mt-1.5 mb-2 text-xs text-ru-grey">
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
                <EmailDropdown
                  value={config.gscEmail}
                  options={GSC_EMAILS}
                  onChange={(val) => set("gscEmail", val)}
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

        </div>
      </div>

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
                autoComplete="off"
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
              <button
                type="button"
                onClick={() => { onChange(search); setOpen(false); setSearch(""); }}
                className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-ru-red hover:bg-ru-red/5"
              >
                <span className="font-medium">Use &quot;{search}&quot;</span>
                <span className="text-xs text-ru-grey">as custom domain</span>
              </button>
            ) : (
              <>
                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => { onChange(search); setOpen(false); setSearch(""); }}
                    className="flex w-full items-center gap-2 border-b border-ru-grey/10 px-3 py-2.5 text-left text-sm text-ru-red hover:bg-ru-red/5"
                  >
                    <span className="font-medium">Use &quot;{search}&quot;</span>
                    <span className="text-xs text-ru-grey">as custom domain</span>
                  </button>
                )}
                {filtered.map((url) => {
                  const isSelected = url === value;
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => { onChange(url); setOpen(false); setSearch(""); }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                        isSelected ? "bg-ru-red/5 text-ru-red" : "text-neutral-dark hover:bg-ru-grey/5"
                      )}
                    >
                      <span className="truncate">{url}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-ru-red" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </>
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

/* ============================================================
   Email Dropdown
   Same style as DomainDropdown, but without search box
   ============================================================ */
function EmailDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2.5 text-left text-sm transition-colors",
          open ? "border-ru-red ring-2 ring-ru-red/20" : "border-ru-grey/25 hover:border-ru-grey/40",
          value ? "font-medium text-neutral-dark" : "text-ru-grey/60"
        )}
      >
        <span className="truncate">{value || "Select a Gmail account..."}</span>
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
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((email) => {
              const isSelected = email === value;
              return (
                <button
                  key={email}
                  type="button"
                  onClick={() => {
                    onChange(email);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-ru-red/5 text-ru-red"
                      : "text-neutral-dark hover:bg-ru-grey/5"
                  )}
                >
                  <span className="truncate">{email}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-ru-red" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-ru-grey/10 bg-ru-grey/5 px-3 py-1.5 text-[11px] font-medium text-ru-grey">
            {options.length} accounts available
          </div>
        </div>
      )}
    </div>
  );
}
