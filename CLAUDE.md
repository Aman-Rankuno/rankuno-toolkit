# Claude Code Context: RankUno Crawl Toolkit

This file gives Claude Code (and any AI assistant) project context. Read this before making changes.

## Project Purpose

Internal web-based SEO crawl management toolkit for RankUno. Replaces a fragile n8n-based system. Users submit crawl requests via a form, the system runs Screaming Frog crawls in the background, and results are accessible from a centralized dashboard. Future: crawl comparison, auto-detected issue reports.

## Owner

G.O.A.T. (Aman Bharti) at RankUno. Email: aman.bharti@rankuno.com

## Tech Stack (Committed, Do Not Change Without Reason)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (no plain JS) |
| Styling | Tailwind CSS v4 (uses `@theme` in CSS, NOT `tailwind.config.js`) |
| Components | shadcn/ui (Radix primitives, Nova preset) |
| Font | Afacad (Google Fonts) |
| Package Manager | pnpm (NOT npm or yarn) |
| Version Control | Git, branch `main` |

## Project Location

`D:\projects\rankuno-toolkit` (D: drive, NOT C:)

## Brand Requirements (Strict)

### Colors

| Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| RU Red (primary) | `#DE1921` | `bg-ru-red`, `text-ru-red` | CTAs, key actions, brand accents |
| RU Grey (primary) | `#58595B` | `bg-ru-grey`, `text-ru-grey` | Secondary text, subtle UI |
| Accent Red | `#DE195F` | `bg-accent-red` | Hover states, secondary CTAs |
| Accent Orange | `#DE4F19` | `bg-accent-orange` | Section dividers |
| Tertiary Teal | `#19DED5` | `bg-tertiary-teal` | Use sparingly, special highlights |
| Tertiary Blue | `#1921DE` | `bg-tertiary-blue` | Use sparingly, alerts |
| Tertiary Green | `#21DE19` | `bg-tertiary-green` | Use sparingly, success states |
| Neutral Dark | `#333333` | `text-neutral-dark` | Body text on light backgrounds |
| Neutral Light | `#F5F5F5` | `bg-neutral-light` | Page backgrounds (the default `--background`) |
| Neutral Beige | `#F4E3DC` | `bg-neutral-beige` | Subtle warm accents |

Brand colors are defined in `app/globals.css` inside the `@theme` block. Add to that block, do not redefine elsewhere.

### Typography

- Primary: Afacad (Google Font)
- Weights in use: Regular 400, Medium 500, Semibold 600
- Fallback: Georgia, Domine
- Usage per brand guide:
  - Afacad Semibold (600): section titles
  - Afacad Medium (500): page titles, subtitles
  - Afacad Regular (400): body text

Font is loaded in `app/layout.tsx` via `next/font/google`. Available as `--font-afacad` and aliased to `--font-sans` (in `globals.css`), so Tailwind's `font-sans` utility uses Afacad.

### Voice

Strategic, Confident, Collaborative, Clear & Insightful.

## Coding Conventions

### Strict Rules

- **Never use em dashes** in any output: UI copy, comments, commit messages, docs, anything. Use commas, colons, semicolons, or restructure the sentence.
- TypeScript only, no plain JS
- Tailwind utility classes only, no inline styles or arbitrary CSS unless tokens are missing
- shadcn components are project-owned (in `components/ui/`), modify freely as needed
- Use `cn()` from `@/lib/utils` for combining class names

### File Naming

- React components: PascalCase (`CrawlForm.tsx`)
- Utilities and configs: lowercase (`utils.ts`, `next.config.ts`)
- Routes follow Next.js App Router: `app/{route}/page.tsx`

## Project Structure

## Working Approach

- ONE step at a time, verify before moving on (per owner's preference)
- Show output or screenshots after each step
- Do not batch multiple steps and discover bugs late
- If something breaks, troubleshoot together

## Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| 0 | ✓ Done (v0.1.0) | Foundation setup |
| 1 | Next | Toolkit screens with mock data (Toolkit Home, New Crawl Form, Crawl Detail) |
| 2 | Pending | Backend (FastAPI, Postgres, Celery, Redis) |
| 3 | Pending | Crawl execution integration |
| 4+ | Pending | Auto-analysis, comparison, multi-user, cloud, auth |

## Out of Scope for v1

- Authentication and login (Phase 4+)
- Multi-user roles (Phase 5)
- Auto-analysis features (Phase 6)
- Compare Crawls feature (Phase 5)
- Cloud storage and S3 (Phase 4+)
- Dark mode (no brand-defined dark theme yet)

## Working Approach

- ONE step at a time, verify before moving on (per owner's preference)
- Show output or screenshots after each step
- Do not batch multiple steps and discover bugs late
- If something breaks, troubleshoot together

## Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| 0 | ✓ Done (v0.1.0) | Foundation setup |
| 1 | Next | Toolkit screens with mock data (Toolkit Home, New Crawl Form, Crawl Detail) |
| 2 | Pending | Backend (FastAPI, Postgres, Celery, Redis) |
| 3 | Pending | Crawl execution integration |
| 4+ | Pending | Auto-analysis, comparison, multi-user, cloud, auth |

## Out of Scope for v1

- Authentication and login (Phase 4+)
- Multi-user roles (Phase 5)
- Auto-analysis features (Phase 6)
- Compare Crawls feature (Phase 5)
- Cloud storage and S3 (Phase 4+)
- Dark mode (no brand-defined dark theme yet)