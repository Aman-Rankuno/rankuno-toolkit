"use client";

import { useEffect, useState } from "react";
import { Lock, Upload, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL_SERVER || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_STORAGE_KEY = "rankuno_import_token";

export function ImportCrawl() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    setToken(stored);
    setChecking(false);
  }, []);

  function handleLogin(newToken: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }

  if (checking) return null;

  return token ? (
    <UploadForm token={token} onLogout={handleLogout} onUnauthorized={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    if (!username.trim() || !password) {
      setError("Enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/imports/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Login failed");
      }
      const data = await res.json();
      onLogin(data.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-ru-grey/20 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lock className="h-5 w-5 text-ru-red" strokeWidth={2} />
        <p className="text-sm font-bold uppercase tracking-wider text-neutral-dark">
          Import Access Required
        </p>
      </div>
      <p className="mb-4 text-xs text-ru-grey">
        Crawl file imports are restricted. Enter the shared credentials to continue.
      </p>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Username"
          className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
        />
        {error && <p className="text-xs text-ru-red">{error}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-md bg-ru-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-red disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </div>
    </div>
  );
}

function UploadForm({
  token,
  onLogout,
  onUnauthorized,
}: {
  token: string;
  onLogout: () => void;
  onUnauthorized: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [domain, setDomain] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    setError("");
    setSuccess("");
    if (!file) {
      setError("Choose a .dbseospider (or .seospider) crawl file first.");
      return;
    }
    if (!domain.trim()) {
      setError("Enter the domain this crawl belongs to.");
      return;
    }
    setUploading(true);
    setProgress("Uploading, this can take a while for large crawl files...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("domain", domain.trim());

      const res = await fetch(`${API_URL}/api/imports/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.status === 401) {
        onUnauthorized();
        setError("Session expired. Please log in again.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Upload failed");
      }
      const data = await res.json();
      setSuccess(data.message || "Crawl file queued for export.");
      setFile(null);
      setDomain("");
      const input = document.getElementById("import-file-input") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-ru-grey/20 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-ru-red" strokeWidth={2} />
          <p className="text-sm font-bold uppercase tracking-wider text-neutral-dark">
            Import a Crawl File
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-xs text-ru-grey hover:text-neutral-dark"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
          Log out
        </button>
      </div>

      <p className="mb-4 text-xs text-ru-grey">
        Upload a crawl saved from Screaming Frog (File, Export, save as .dbseospider). The
        server will read it and generate the same reports a live crawl would, so every
        masterfile button works on it once processing completes.
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ru-grey">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="leica-microsystems.com"
            className="w-full rounded-md border border-ru-grey/25 bg-white px-3 py-2.5 text-sm text-neutral-dark placeholder:text-ru-grey/40 focus:border-ru-red focus:outline-none focus:ring-2 focus:ring-ru-red/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ru-grey">Crawl file</label>
          <input
            id="import-file-input"
            type="file"
            accept=".dbseospider,.seospider"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError("");
            }}
            className="w-full text-xs text-neutral-dark file:mr-3 file:rounded-md file:border-0 file:bg-ru-red/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ru-red hover:file:bg-ru-red/20"
          />
          {file && (
            <p className="mt-1 text-[11px] text-ru-grey">
              {file.name} — {Math.round(file.size / (1024 * 1024))} MB
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-md bg-ru-red/5 px-3 py-2 text-xs text-ru-red">{error}</p>
        )}
        {success && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {success}
          </p>
        )}
        {progress && <p className="text-xs text-ru-grey">{progress}</p>}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className={cn(
            "rounded-md bg-ru-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-red disabled:opacity-50"
          )}
        >
          {uploading ? "Uploading..." : "Upload and Queue"}
        </button>
      </div>
    </div>
  );
}
