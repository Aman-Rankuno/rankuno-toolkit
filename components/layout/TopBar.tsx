import { Search } from "lucide-react";

type TopBarProps = {
  title: string;
  description?: string;
};

export function TopBar({ title, description }: TopBarProps) {
  return (
    <header className="border-b border-ru-grey/15 bg-white">
      <div className="flex items-center justify-between gap-4 px-8 py-5">
        {/* Page title */}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-neutral-dark">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 truncate text-sm text-ru-grey">
              {description}
            </p>
          )}
        </div>

        {/* Right side: search + user */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-ru-grey/20 bg-white px-3 py-1.5 text-sm text-ru-grey transition-colors hover:border-ru-grey/40 hover:bg-ru-grey/5"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Search crawls</span>
            <kbd className="ml-1 hidden rounded border border-ru-grey/20 bg-ru-grey/5 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-ru-grey sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* User avatar */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-ru-red text-xs font-semibold text-white"
            aria-label="Current user"
            title="G.O.A.T."
          >
            G
          </div>
        </div>
      </div>
    </header>
  );
}