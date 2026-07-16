"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Send, ChevronDown, Loader2, Globe, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCrawls, type Crawl } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

type ProviderId = "openai" | "claude";

const PROVIDER_LABELS: Record<ProviderId, string> = {
  openai: "ChatGPT",
  claude: "Claude",
};

const SUGGESTIONS = [
  "What are the top 5 issues on this site?",
  "How many pages have missing meta descriptions?",
  "Summarize the internal linking problems",
];

export default function ChatWithAIPage() {
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [selectedCrawlId, setSelectedCrawlId] = useState<string>("");
  const [crawlPickerOpen, setCrawlPickerOpen] = useState(false);

  const [availableProviders, setAvailableProviders] = useState<Record<ProviderId, boolean>>({
    openai: false,
    claude: false,
  });
  const [provider, setProvider] = useState<ProviderId>("claude");

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCrawls()
      .then((all) => setCrawls(all.filter((c) => c.status === "completed")))
      .catch(() => setCrawls([]));

    fetch(`${API_URL}/api/chat/providers`)
      .then((r) => r.json())
      .then((data: Record<ProviderId, boolean>) => {
        setAvailableProviders(data);
        if (!data[provider]) {
          const firstReady = (Object.keys(data) as ProviderId[]).find((p) => data[p]);
          if (firstReady) setProvider(firstReady);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const selectedCrawl = crawls.find((c) => c.id === selectedCrawlId);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || !selectedCrawlId || sending) return;

    setError(null);
    const nextMessages: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crawl_id: selectedCrawlId,
          message: text,
          provider,
          history: messages,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(body.detail || "Request failed");
      }
      const data: { reply: string } = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <AppShell title="Chat with AI" description="Ask questions about any completed crawl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ru-grey transition-colors hover:text-ru-red"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back to Dashboard
        </Link>

        {/* Provider selector */}
        <div className="flex rounded-lg border border-ru-grey/20 bg-white p-1 shadow-sm">
          {(Object.keys(PROVIDER_LABELS) as ProviderId[]).map((p) => {
            const ready = availableProviders[p];
            return (
              <button
                key={p}
                type="button"
                disabled={!ready}
                onClick={() => setProvider(p)}
                title={ready ? undefined : "Not configured yet"}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  provider === p && ready
                    ? "bg-ru-red text-white shadow-sm"
                    : ready
                    ? "text-neutral-dark hover:bg-ru-grey/10"
                    : "cursor-not-allowed text-ru-grey/40"
                )}
              >
                {PROVIDER_LABELS[p]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[calc(100vh-13rem)] flex-col gap-4">
        {/* Crawl picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCrawlPickerOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl border border-ru-grey/15 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-ru-red/30"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ru-red/10">
              <Globe size={15} className="text-ru-red" strokeWidth={2.2} />
            </span>
            <span className="flex-1 truncate text-sm font-semibold text-neutral-dark">
              {selectedCrawl ? selectedCrawl.domain : "Select a crawl to chat about..."}
            </span>
            <ChevronDown
              size={16}
              className={cn("shrink-0 text-ru-grey transition-transform", crawlPickerOpen && "rotate-180")}
            />
          </button>

          {crawlPickerOpen && (
            <div className="absolute z-10 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-ru-grey/15 bg-white shadow-lg">
              {crawls.length === 0 && (
                <div className="px-4 py-3 text-sm text-ru-grey">No completed crawls yet.</div>
              )}
              {crawls.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCrawlId(c.id);
                    setCrawlPickerOpen(false);
                    setMessages([]);
                    setError(null);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-ru-grey/5",
                    c.id === selectedCrawlId && "bg-ru-red/5"
                  )}
                >
                  <span className="truncate font-medium text-neutral-dark">{c.domain}</span>
                  <span className="shrink-0 text-xs text-ru-grey">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message thread */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-ru-grey/15 bg-white p-6 shadow-sm"
        >
          {!selectedCrawlId && (
            <div className="flex h-full items-center justify-center text-center">
              <div className="max-w-sm">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ru-red/10">
                  <Bot size={26} className="text-ru-red" strokeWidth={1.8} />
                </span>
                <p className="text-sm font-semibold text-neutral-dark">Pick a crawl to get started</p>
                <p className="mt-1.5 text-sm text-ru-grey">
                  Choose a completed crawl above, then ask anything about its issues, priorities, or affected pages.
                </p>
              </div>
            </div>
          )}

          {selectedCrawlId && messages.length === 0 && !sending && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ru-red/10">
                <Sparkles size={24} className="text-ru-red" strokeWidth={1.8} />
              </span>
              <p className="text-sm font-semibold text-neutral-dark">
                Ready to answer questions about {selectedCrawl?.domain}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-ru-grey/20 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-dark transition-colors hover:border-ru-red/30 hover:bg-ru-red/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-ru-red/10" : "bg-ru-grey/10"
                )}
              >
                {m.role === "user" ? (
                  <User size={14} className="text-ru-red" strokeWidth={2.2} />
                ) : (
                  <Bot size={14} className="text-neutral-dark" strokeWidth={2.2} />
                )}
              </span>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user" ? "whitespace-pre-wrap bg-ru-red text-white" : "bg-ru-grey/8 text-neutral-dark"
                )}
              >
                {m.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ru-grey/10">
                <Bot size={14} className="text-neutral-dark" strokeWidth={2.2} />
              </span>
              <div className="flex items-center gap-2 rounded-2xl bg-ru-grey/8 px-4 py-2.5 text-sm text-ru-grey">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-ru-red/20 bg-ru-red/5 px-4 py-2 text-sm text-ru-red">{error}</div>
        )}

        {/* Input */}
        <div className="flex items-end gap-3 rounded-2xl border border-ru-grey/15 bg-white p-3 shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedCrawlId || sending}
            placeholder={selectedCrawlId ? "Ask a question about this crawl..." : "Select a crawl first..."}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-neutral-dark placeholder:text-ru-grey/60 focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!selectedCrawlId || !input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ru-red text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .markdown-body p {
          margin-bottom: 0.5rem;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }
        .markdown-body ul,
        .markdown-body ol {
          margin: 0.4rem 0 0.6rem 1.1rem;
        }
        .markdown-body ul {
          list-style-type: disc;
        }
        .markdown-body ol {
          list-style-type: decimal;
        }
        .markdown-body li {
          margin-bottom: 0.2rem;
        }
        .markdown-body strong {
          font-weight: 700;
          color: #1a1a1a;
        }
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3 {
          font-weight: 700;
          margin: 0.75rem 0 0.4rem;
          color: #1a1a1a;
        }
        .markdown-body h3 {
          font-size: 0.9rem;
        }
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.6rem 0;
          font-size: 0.8rem;
        }
        .markdown-body th,
        .markdown-body td {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.4rem 0.6rem;
          text-align: left;
        }
        .markdown-body th {
          background-color: rgba(222, 25, 33, 0.06);
          font-weight: 700;
          color: #1a1a1a;
        }
        .markdown-body tr:nth-child(even) td {
          background-color: rgba(0, 0, 0, 0.015);
        }
        .markdown-body code {
          background-color: rgba(0, 0, 0, 0.06);
          padding: 0.1rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        .markdown-body a {
          color: #de1921;
          text-decoration: underline;
        }
      `}</style>
    </AppShell>
  );
}
