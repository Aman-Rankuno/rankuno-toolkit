"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, GitCompare, Sparkles, ChevronsUpDown, MessageSquare, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewCrawlTrigger } from "@/components/dashboard/NewCrawlTrigger";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  status?: "active" | "soon" | "v2";
};

const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid,  },
];

const secondaryNav: NavItem[] = [
  { label: "Comparisons", href: "#", icon: GitCompare, status: "soon" },
  { label: "Analysis", href: "#", icon: Sparkles, status: "soon" },
  { label: "Chat with AI", href: "/chat", icon: MessageSquare }
];

// Restricted-access tools: kept visually separate from the main menu since
// they require a login of their own, distinct from the rest of the toolkit
const restrictedNav: NavItem[] = [
  { label: "Import Crawl", href: "/import-crawl", icon: Lock },
];

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.href === pathname;
        const isSoon = item.status === "soon";
        const isV2 = item.status === "v2";
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
                isSoon && "cursor-not-allowed text-ru-grey/60",
                isV2 && "cursor-not-allowed text-ru-grey/60"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {isSoon && (
                <span className="rounded-md bg-beige px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-grey">
                  Soon
                </span>
              )}
              {isV2 && (
                <span className="rounded-md bg-ru-red/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ru-red">
                  V2
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

        {/* Restricted-access section, visually separated with a divider */}
        <div className="mt-4 border-t border-ru-grey/15 pt-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ru-grey/70">
            Restricted
          </p>
          <NavList items={restrictedNav} />
        </div>
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
