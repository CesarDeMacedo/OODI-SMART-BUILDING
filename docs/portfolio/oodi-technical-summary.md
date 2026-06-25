# Oodi Smart Building Intelligence — Technical Summary

## Frontend

- **React 18** with functional components and hooks
- **TypeScript** — strict mode; all data structures typed end-to-end
- **Vite** — build tooling and local development server
- **Responsive CSS** — custom design tokens; utility-aware visual overlays; auto-zoom for laptop viewports; stable layouts at 390×844, 430×932, 1366×768, 1536×864 and 1920×1080
- **Hash routing** — client-side only; no server-side configuration required for direct route refresh
- **Accessible interaction states** — `aria-current`, `aria-pressed`, `aria-hidden`, `tabIndex`, `focus-visible` outlines, `prefers-reduced-motion` support

---

## Runtime Data

| Source | Type | Update frequency |
|---|---|---|
| Helsinki Nuuka Open API | Electricity, Heat, Water, District Cooling | Daily (server-side) |
| Open-Meteo forecast API | Temperature, humidity, wind, weather code | Near real-time |
| Local deterministic dataset | Conceptual IoT — 45 records, 9 zones × 5 layers | Static; no live timestamps |

---

## Data Handling

- **Normalization** — each utility fetched via its own repository; responses mapped to a consistent internal structure with unit, granularity, source and timestamp
- **Validation** — boundary checks on returned values; empty, partial and error states handled at component level
- **Caching** — in-memory snapshot cache preserves the last successful Nuuka response; displayed with a Cached Public Data Snapshot badge when the live fetch fails
- **Same-granularity fallback** — when a finer period is unavailable (for example, today's hourly data returns a 404), the repository falls back to the next available granularity and labels the fallback in the UI; fallback period is surfaced in both the chart header and the Insights page
- **No interpolation** — no values are synthesized, averaged across missing gaps or fabricated; missing readings are reported as missing
- **Independent timestamps** — each utility has its own source timestamp; timestamps are not synchronized across utilities
- **Partial and error states** — loading, partial, empty, error, cached-snapshot and memory-cache states are all handled and surfaced distinctly in the UI

---

## Visualization

- **Custom SVG charts** — runtime area fill, line path and peak marker rendered from fetched data points; no third-party chart library
- **Utility-aware visual overlays** — each utility (Electricity, Heat, Water, District Cooling) has a distinct hero overlay communicating its visual character
- **Deterministic insight rules** — rule-based functions over fetched data produce Priority Insights and Data Quality observations; no runtime generative AI
- **Spatial building-intelligence interaction** — Oodi cutaway illustration with CSS percentage-coordinate hotspots and level region bands; zone and layer selection synchronized; 20 unique insight texts across 4 levels × 5 layers

---

## QA

- **Vitest** — 28 test files, 124 unit and integration tests
- **Playwright** — end-to-end route validation via the Stage 9 QA process
- **TypeScript** — `tsc --noEmit` passes with zero errors
- **ESLint** — zero warnings or errors
- **Production build** — `vite build` completes cleanly
- **Responsive validation** — five viewport breakpoints confirmed
- **Stage 9 result** — 124/124 tests pass; PASS recommendation; High 0 · Medium 0 · Low 1

---

## Deployment

- **GitHub Pages** — static hosting via the `/OODI-SMART-BUILDING/` base path
- **GitHub Actions** — automated deployment workflow on push to `main`
- **Live URL** — [https://cesardemacedo.github.io/OODI-SMART-BUILDING/](https://cesardemacedo.github.io/OODI-SMART-BUILDING/)

---

## AI-Assisted Development

The following tools were used during planning, design and development:

- **ChatGPT** — product strategy, content drafting, data-source evaluation
- **Claude Code** — implementation assistance, staged development workflow, code review, QA planning and portfolio packaging
- **Codex** — code generation assistance during implementation stages

These tools assisted the development process. They do not run inside the deployed application. All runtime data comes from the Nuuka API, Open-Meteo and a local deterministic dataset. No generative AI produces content, insights or building data at runtime.
