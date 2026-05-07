"use client";

import Link from "next/link";

export function NewCrawlTrigger() {
  return (
    <Link
      href="/new-crawl"
      className="flex w-full items-center gap-2 rounded-md bg-ru-red px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-red"
    >
      <span className="text-base font-light leading-none">+</span>
      New Crawl
    </Link>
  );
}