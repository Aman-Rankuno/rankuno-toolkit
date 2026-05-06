export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        {/* Brand kicker */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-ru-red" />
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-ru-red">
            RankUno
          </span>
        </div>

        {/* Heading, Afacad Semibold (600) */}
        <h1 className="mb-4 text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-dark sm:text-6xl">
          Crawl Toolkit
        </h1>

        {/* Tagline, Afacad Medium (500) */}
        <p className="mb-8 text-xl font-medium text-ru-grey sm:text-2xl">
          Internal SEO Intelligence Platform
        </p>

        {/* Description, Afacad Regular (400) */}
        <p className="mb-10 max-w-xl text-base leading-relaxed text-ru-grey">
          Centralized SEO crawl management for the RankUno team. Submit crawls, track status, and access every report from one place. No more searching inboxes.
        </p>

        {/* Primary and secondary actions */}
        <div className="mb-16 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ru-red px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-red"
          >
            Open Toolkit
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-ru-grey/30 bg-transparent px-6 text-sm font-medium text-neutral-dark transition-colors hover:border-ru-grey/60 hover:bg-white"
          >
            View Documentation
          </button>
        </div>

        {/* Status footer */}
        <div className="border-t border-ru-grey/15 pt-6">
          <div className="flex items-center justify-between text-xs text-ru-grey">
            <span className="font-medium">Phase 0 · Foundation Setup</span>
            <span className="tabular-nums">v0.1.0</span>
          </div>
        </div>
      </div>
    </main>
  );
}