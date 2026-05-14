# Claude Code Context: RankUno Crawl Toolkit

This file gives Claude Code (and any AI assistant) project context. Read this before making changes.

## Project Purpose

Internal web-based SEO crawl management toolkit for RankUno. Replaces a fragile n8n-based system. Users submit crawl requests via a form, the system runs Screaming Frog crawls in the background, and results are accessible from a centralized dashboard. Future: crawl comparison, auto-detected issue reports.

## Owner

G.O.A.T. (Aman Bharti) at RankUno. Email: aman.bharti@rankuno.com

## Project Locations

- Frontend: `D:\projects\rankuno-toolkit`
- Backend: `D:\projects\rankuno-backend`
- Crawl outputs: `D:\projects\rankuno-reports`
- SF configs: `D:\projects\rankuno-configs`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router) |
| Language | TypeScript (no plain JS) |
| Styling | Tailwind CSS v4 (uses `@theme` in CSS, NOT `tailwind.config.js`) |
| Components | shadcn/ui (Radix primitives, Nova preset) |
| Font | Afacad (Google Fonts) |
| Package Manager | pnpm (NOT npm or yarn) |
| Backend | FastAPI (Python) |
| Task Queue | Celery + Redis |
| Database | PostgreSQL via SQLAlchemy |
| Crawl Engine | Screaming Frog SEO Spider 19.4 CLI |
| Version Control | Git, branch `main` |

---

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
| Neutral Light | `#F5F5F5` | `bg-neutral-light` | Page backgrounds |
| Neutral Beige | `#F4E3DC` | `bg-neutral-beige` | Subtle warm accents |

Brand colors are defined in `app/globals.css` inside the `@theme` block. Add to that block, do not redefine elsewhere.

### Typography

- Primary: Afacad (Google Font)
- Weights: Regular 400, Medium 500, Semibold 600
- Fallback: Georgia, Domine
- Afacad Semibold (600): section titles
- Afacad Medium (500): page titles, subtitles
- Afacad Regular (400): body text

Font loaded in `app/layout.tsx` via `next/font/google`. Available as `--font-afacad`, aliased to `--font-sans`.

### Voice

Strategic, Confident, Collaborative, Clear & Insightful.

---

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

---

## Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| 0 | Done (v0.1.0) | Foundation setup |
| 1 | Done (v0.1.4c) | All toolkit screens: Dashboard, New Crawl Form, Crawl Detail |
| 2 | Done | Backend: FastAPI, Postgres, Celery, Redis |
| 3 | Done | Crawl execution + GSC integration live and tested |
| 4+ | Pending | Auto-analysis, comparison, multi-user, cloud, auth |

### Last committed tag: Step 1.4c

---

## What Is Built

### Frontend (rankuno-toolkit)

- **Dashboard** (`app/page.tsx`): lists all crawls from real backend, shows status badges, links to detail page
- **New Crawl Form** (`components/new-crawl/`): accordion-based config form with sections for crawl type, source (full-site or URL list), SF config file, GSC, include/exclude patterns
- **Crawl Detail** (`app/crawls/[id]/page.tsx`): shows domain, status, pipeline progress, stats, download buttons, error banner
- **PipelineProgress** (`components/crawls/PipelineProgress.tsx`): four-step visual (Crawl, Audit, Narratives, Report)
- **lib/api.ts**: all fetch calls to FastAPI backend, types for Crawl, CrawlPipelineState, CrawlMetadataAPI
- **lib/crawls.ts**: Crawl types, mock data (used during Phase 1, now supplemented by real data), helper functions

### Backend (rankuno-backend)

- **FastAPI** (`app/main.py`): CORS configured for localhost:3000 and 192.168.1.106:3000
- **Routes** (`app/api/crawls.py`): POST /api/crawls/, GET /api/crawls/, GET /api/crawls/{id}
- **Celery task** (`app/tasks/crawl_runner.py`): runs SF CLI, handles GSC flag, exports Internal:All and Search Console:All tabs, saves crawl.seospider
- **Database** (`app/models/crawl.py`): Crawl model with id, domain, crawl_type, status, pages_crawled, report_path, error_message, created_at, completed_at

### GSC Integration (fully working)

- Frontend sends `gsc_account` and `gsc_property` to backend
- Backend passes both to Celery task
- Celery builds SF CLI command with `--use-google-search-console {account} {property}`
- SF reuses OAuth token saved in SF GUI (one-time setup already done)
- Account label in SF: `Rankuno.com` (Gmail: rankuno@gmail.com)
- Property format: `sc-domain:example.com` for domain properties, `https://www.example.com/` for URL prefix properties
- Search Console data exported as `search_console_all.csv` alongside `internal_all.csv`

---

## API Contract (Frontend to Backend)

### POST /api/crawls/

| Field | Type | Notes |
|---|---|---|
| domain | str | Required |
| crawl_type | str | full-audit, advanced-audit, js-crawl, orphan-pages, sitemap-generator, url-list |
| urls | str | Optional, newline-separated, url-list mode only |
| config_file | str | Optional, SF config filename |
| gsc_account | str | Optional, SF saved account label e.g. "Rankuno.com" |
| gsc_property | str | Optional, e.g. "sc-domain:rankuno.com" |
| include_patterns | str | Optional, recorded but not yet applied (SF CLI 19.4 limitation) |
| exclude_patterns | str | Optional, same limitation |

### GET /api/crawls/{id} response

Current fields returned: id, domain, crawl_type, status, pages_crawled, report_path, error_message, created_at, completed_at

Pending (not yet returned, needed for detail page enhancements): failed_step, pipeline, metadata

---

## Known Gaps (Next Up)

1. `failed_step`, `pipeline`, and `metadata` not yet returned by the API. Backend needs to read job folder marker files and `metadata.json` and include them in the GET response. Frontend is already typed and ready for these fields.
2. Download buttons on Crawl Detail are not functional. Need a `GET /api/crawls/{id}/download/{file}` endpoint to stream files from the job folder.
3. `include_patterns` and `exclude_patterns` are recorded but not applied to the crawl. Requires per-job `.seospiderconfig` generation. Planned for v2.
4. `start_url` not wired: backend constructs `crawl_url` as `https://{domain}/` which may not be correct for all clients.

---

## Working Approach

- ONE step at a time, verify before moving on
- Show output or screenshots after each step
- Do not batch multiple steps and discover bugs late
- If something breaks, troubleshoot together

---

## Out of Scope for v1

- Authentication and login (Phase 4+)
- Multi-user roles (Phase 5)
- Auto-analysis features (Phase 6)
- Compare Crawls (Phase 5)
- Cloud storage and S3 (Phase 4+)
- Dark mode (no brand-defined dark theme yet)