"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitCompare, Sparkles, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewCrawlTrigger } from "@/components/dashboard/NewCrawlTrigger";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  status?: "active" | "soon";
};

const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid,  },
];

const secondaryNav: NavItem[] = [
  { label: "Comparisons", href: "#", icon: GitCompare, status: "soon" },
  { label: "Analysis", href: "#", icon: Sparkles, status: "soon" }
];

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.href === pathname;
        const isSoon = item.status === "soon";
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <Link
              href={isSoon ? "#" : item.href}
              aria-disabled={isSoon}
              tabIndex={isSoon ? -1 : 0}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive &&
                  "bg-ru-red/10 text-ru-red before:absolute before:left-0 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-ru-red before:content-['']",
                !isActive && !isSoon && "text-neutral-dark hover:bg-ru-grey/10",
                isSoon && "cursor-not-allowed text-ru-grey/60"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {isSoon && (
                <span className="rounded-md bg-beige px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-grey">
                  Soon
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ru-grey/15 bg-white">
      {/* Brand */}
      <div className="border-b border-ru-grey/15 px-6 py-5">
        <Link href="/" className="inline-block">
          <Image
            src="/rankuno-logo.png"
            alt="RankUno"
            width={400}
            height={120}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ru-grey">
          Crawl Toolkit
        </p>
      </div>

      {/* Nav */}
    <nav className="flex-1 px-3 py-4">
        {/* New Crawl CTA */}
        <div className="px-0.5">
          <NewCrawlTrigger />
        </div>

        <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-ru-grey/70">
          Menu
        </p>

        <NavList items={[...primaryNav, ...secondaryNav]} />
      </nav>

      {/* Footer */}
     <div className="border-t border-ru-grey/15 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-ru-grey/10">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ru-red text-xs font-semibold text-white">
            N
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold leading-tight text-neutral-dark">
              Internal Tool
            </span>
            <span className="text-xs leading-tight text-ru-grey tabular-nums">
              v0.1.0
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-ru-grey" />
        </button>
      </div>
    </aside>
  );
}