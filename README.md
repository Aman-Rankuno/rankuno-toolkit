# RankUno Crawl Toolkit

Internal SEO crawl management toolkit for RankUno. One place to find every crawl, replacing fragile email-based workflows.

## Status

**v0.1.0** - Phase 0 (Foundation Setup) complete. Next.js scaffold, RankUno brand system, shadcn/ui foundation in place. Phase 1 (toolkit UI with mock data) is next.

## Tech Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix + Nova) · Afacad · pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Run ESLint |

## Brand

- **Primary:** RU Red `#DE1921`, RU Grey `#58595B`
- **Surface:** Neutral Light `#F5F5F5`, Neutral Dark `#333333`
- **Typeface:** Afacad (Regular, Medium, Semibold), Georgia fallback

Full engineering and brand context: see `CLAUDE.md`.

## Phases

| Phase | Description |
|---|---|
| 0 | ✓ Foundation setup |
| 1 | Toolkit screens with mock data |
| 2 | Backend (FastAPI / Postgres / Celery / Redis) |
| 3+ | Auto-analysis, comparison, multi-user, cloud |