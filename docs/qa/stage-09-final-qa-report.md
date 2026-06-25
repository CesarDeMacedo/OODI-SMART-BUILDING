# Stage 9 — Final QA Report

**Project:** Oodi Smart Building  
**Stage:** 9 — Final Quality Assurance  
**Status:** Complete  
**Recommendation:** PASS  
**Closed:** 2026-06-25  
**QA commit:** `33ebb85`  
**Browser/tooling:** Chromium · Playwright  

---

## Routes Validated

| Route | Result |
|---|---|
| `/` — Opening | Pass |
| `/overview` — Overview | Pass |
| `/resource-performance` — Resource Performance | Pass |
| `/building-intelligence` — Building Intelligence | Pass |
| `/insights` — Insights | Pass |
| `/data-transparency` — Data Transparency | Pass |

---

## Viewports Tested

2560×1440 · 1920×1080 · 1536×864 · 1366×768

No horizontal scroll at any viewport. No content overlap.

---

## Interactions Validated

- Four utility selectors and three period selectors on Resource Performance — all functional
- Four level selectors and five intelligence layer tabs on Building Intelligence — all functional, correct `aria-pressed` states
- Priority Insights cap — two Data Notice cards in Priority section, remainder in Data Quality & Coverage
- Browser back/forward navigation — correct
- Direct hash-route refresh — correct (hash routing; no server config required)
- Active `aria-current="page"` nav state — correct on all routes

---

## Accessibility

- Focus-visible outlines present (`2px solid` accent) on all interactive elements
- Tab order logical: logo → navigation → content
- Reduced-motion CSS present in stylesheet

---

## Data States Validated

- Utility fallback states labelled "Latest available period" with visual indicator (Electricity, Heat, District Cooling)
- Water returned live hourly data
- Open-Meteo weather independently attributed
- Conceptual IoT disclosures present throughout Building Intelligence
- Nuuka, Open-Meteo and conceptual-IoT source classifications correct throughout

---

## Automated Results

| Check | Result |
|---|---|
| Tests | 124 / 124 passed (28 files) |
| TypeScript | Pass |
| ESLint | Pass |
| Production build | Pass |

---

## Defect Summary

| Severity | Count |
|---|---|
| High | 0 |
| Medium | 0 |
| Low | 1 |

**Low-severity limitation:** Nuuka hourly endpoint returns HTTP 404 for Electricity, Heat and District Cooling when requesting today's data. This is a server-side API behaviour, not an application defect. The fallback strategy recovers correctly via monthly data and an earlier hourly window. Fallback states are correctly labelled in the UI. Browser console 404 entries are expected and cannot be suppressed in client code.

---

## Conclusion

All six routes render correctly. No High or Medium defects. Automated suite fully passing. Known Nuuka 404 fallback behaviour documented and handled correctly.

**Approved for Stage 10 — Portfolio Packaging.**
