# OODI SMART BUILDING INTELLIGENCE — PROJECT CONTEXT

## 1. Project Overview

This project is a self-initiated interactive web application focused on Helsinki Central Library Oodi.

The application will combine real public-building energy data, current weather information, verified building context and a clearly identified conceptual IoT layer.

The primary purpose is to demonstrate how building information, operational data and spatial visualization can be transformed into a clear and engaging digital experience.

This is a portfolio project, not an official application created for Oodi, the City of Helsinki, Nuuka or WSP.

---

## 2. Strategic Purpose

The project is being developed for inclusion in a portfolio directed to a Digital Advisory Lead working within WSP Property & Buildings.

The application should demonstrate how Cesar De Macedo could contribute to Digital Advisory teams through:

* real-time and near-real-time data visualization;
* smart-building experience prototyping;
* digital twin experience concepts;
* browser-based interactive applications;
* technical storytelling;
* client and stakeholder communication;
* AI-assisted application development;
* built-environment visualization.

The project should not attempt to present Cesar as a building-systems engineer, data engineer or operational digital twin specialist.

The intended positioning is:

> A digital experience and real-time visualization specialist who can complement advisory, engineering and digital-delivery teams by transforming complex building information into accessible visual and interactive experiences.

---

## 3. Primary Audience

The primary audience is:

* Digital Advisory leaders;
* Property & Buildings professionals;
* smart-building consultants;
* digital twin specialists;
* building-performance teams;
* asset-management teams;
* BIM and digital-delivery professionals;
* engineering and advisory stakeholders;
* potential employers and collaborators.

The application must be understandable by both technical and non-technical users.

---

## 4. Building

### Public Name

Helsinki Central Library Oodi

### Exact Nuuka Property Name

4669 Oodi Helsingin keskustakirjasto

### Property Code

091-002-0014-0005

### Building Code

103534449X

### Purpose of Use

G kirjasto

### Location

Töölönlahdenkatu 4, Helsinki, Finland

### Why Oodi Was Selected

Oodi is a strong subject for this project because it is:

* a contemporary public building;
* architecturally distinctive;
* technologically advanced;
* highly occupied and people-centred;
* relevant to smart-building operations;
* connected to energy, comfort and facility-management topics;
* visually suitable for a high-quality portfolio experience;
* aligned with Property & Buildings and Digital Advisory.

---

## 5. Confirmed Public Data

The Nuuka Open API discovery phase confirmed that Oodi is available through the public Helsinki property dataset.

The following reporting groups are available:

* Electricity
* Heat
* Water
* District Cooling

### Units

* Electricity: kWh
* Heat: kWh
* District Cooling: kWh
* Water: m³

### Available Granularity

Depending on the reporting group and period:

* hourly;
* daily;
* monthly.

### Historical Availability

Monthly data is available from approximately 2018 for some reporting groups.

### Latest Data

The latest timestamp varies by reporting group.

The application must not assume that all utilities share the same update date.

Every data group must display its own:

* latest available timestamp;
* source;
* unit;
* granularity;
* selected period.

### API Access

Browser-side API access was successfully validated.

* HTTP status: 200
* CORS: successful
* Proxy or backend: not currently required for Nuuka data

The `nuuka-discovery-report.md` file is the technical source of truth for exact endpoints, dates, responses and availability.

---

## 6. Data Classification

The application must clearly distinguish between three data types.

### A. Real Public Building Data

Provided by the Nuuka Open API:

* electricity;
* heat;
* water;
* district cooling;
* historical trends;
* latest available readings.

### B. Real Weather Data

To be integrated in a later phase:

* current outdoor temperature;
* humidity;
* wind;
* precipitation;
* weather condition;
* forecast;
* relevant heating or cooling context.

### C. Conceptual IoT and Operational Data

These values may be simulated for experience-prototyping purposes:

* occupancy;
* indoor temperature;
* indoor comfort;
* CO₂;
* indoor air quality;
* HVAC status;
* asset health;
* maintenance alerts;
* system status;
* floor or zone conditions.

Conceptual data must never be presented as real Oodi operational data.

It must be visibly labelled with language such as:

* Conceptual IoT Layer
* Simulated Operational Indicators
* Experience Prototype Data
* Illustrative Sensor Data

---

## 7. Data Transparency Principles

The project must be technically honest.

The interface should always communicate:

* what data is real;
* what data is simulated;
* the data source;
* the unit;
* the last available timestamp;
* the update frequency;
* the selected period;
* missing or delayed readings;
* when fallback data is being used.

Avoid calling Nuuka utility data “live” when it is delayed or updated daily.

Preferred language:

* Latest available building data
* Public energy data
* Near-real-time building information
* Most recent available reading

“Live” may be used only for genuinely current weather information.

---

## 8. Recommended Time Windows

The product should support three principal time windows.

### Operational View

Latest 24 hours, using hourly data when available.

Purpose:

* recent activity;
* hourly consumption;
* short-term variation;
* current operational context.

### Trend View

Latest 30 days, using daily data.

Purpose:

* consumption trend;
* peaks;
* averages;
* comparison with previous periods;
* weather relationship.

### Historical View

Latest 12 months, using monthly data.

Purpose:

* seasonality;
* annual context;
* heating and cooling patterns;
* executive-level trends.

If a reporting group does not support a selected window, the application should use a documented fallback rather than fabricating values.

---

## 9. Initial Product Concept

Working title:

# Oodi Smart Building Intelligence

Alternative subtitle:

> A digital building experience combining public energy data, weather context and conceptual IoT visualization.

The experience should help users understand:

* how the building consumes energy;
* how energy use changes over time;
* how weather may influence heat and cooling;
* how different building systems relate;
* how operational information can be communicated visually;
* how real data and spatial context can support stakeholder understanding.

---

## 10. Proposed Application Sections

The exact structure will be defined in the PRD, but the current direction includes:

### Overview

* building identity;
* location;
* current Helsinki weather;
* latest data update;
* high-level utility summary;
* data transparency status.

### Energy

* electricity;
* heat;
* district cooling;
* 24-hour, 30-day and 12-month views;
* trends and comparisons.

### Water

* daily and monthly usage;
* average consumption;
* peaks or anomalies;
* latest available reading.

### Building Intelligence

* visual representation of Oodi;
* building systems;
* spatial overlays;
* conceptual IoT indicators;
* clearly labelled simulated information.

### Insights

* automatically calculated observations;
* unusual consumption;
* period comparisons;
* weather-related context;
* plain-language explanations.

### Data Transparency

* Nuuka Open API;
* weather-data source;
* real versus simulated classification;
* units;
* timestamps;
* update frequency;
* methodology and disclaimers.

---

## 11. Visual Direction

The final application should look:

* sophisticated;
* modern;
* architectural;
* technical;
* clean;
* premium;
* easy to understand;
* suitable for an executive and advisory audience.

The visual style should avoid:

* generic SaaS dashboard aesthetics;
* excessive cards;
* visual clutter;
* heavy neon effects;
* misleading futuristic interfaces;
* unsupported operational claims.

The design should balance:

* architecture;
* data;
* spatial context;
* human-centred communication;
* strong visual hierarchy;
* clear data provenance.

---

## 12. MVP Scope

The first functional MVP should include:

* working Nuuka API integration;
* Oodi property identification;
* electricity, heat, water and district cooling;
* normalized data structures;
* latest-reading logic;
* 24-hour, 30-day and 12-month views where supported;
* weather integration;
* loading, error and empty states;
* data-source and timestamp labels;
* clear separation of real and conceptual data;
* responsive browser interface;
* one polished building-intelligence experience;
* portfolio-quality screenshots.

---

## 13. Out of Scope for the Initial MVP

Do not include initially:

* authentication;
* user accounts;
* database;
* private Nuuka access;
* real BMS integration;
* operational control of building systems;
* real maintenance alerts;
* real occupant tracking;
* a complete BIM model;
* a production-grade digital twin;
* multi-building management;
* predictive machine learning;
* complex backend infrastructure;
* commercial deployment claims;
* official WSP or Oodi branding.

These may be future concepts but should not delay the MVP.

---

## 14. Product Integrity

This is not an operational digital twin.

It is a working interactive prototype that combines:

* verified public building data;
* weather information;
* architectural context;
* digital-experience design;
* clearly identified simulated operational layers.

Preferred description:

> A browser-based smart-building experience combining real public energy data, weather context and a clearly identified conceptual IoT layer.

---

## 15. Relationship to the WSP Portfolio

This application will support two portfolio pages.

### Real-Time Data Web Experience

Focus:

* public API integration;
* live weather;
* utility data;
* data normalization;
* interactive dashboard;
* transparent data sources.

### Interactive Project Communication

Focus:

* client-facing experience;
* technical storytelling;
* stakeholder understanding;
* digital advisory prototyping;
* communication of complex building information.

---

## 16. Stage Completion Record

### Stage 5 — Visual Design System

**Status:** Complete  
**Closed:** 2026-06-23  
**Validation:** Deployed and verified across multiple monitors and browsers via GitHub Pages.

Delivered: design token architecture, shared component library, chart visual language, all DataStatus states, data-classification visual distinctions, responsive behavior, and auto-zoom for Overview and Resource Performance. Opening, Overview and Resource Performance pages visually approved.

### Stage 6 — Resource Performance

**Status:** Complete  
**Closed:** 2026-06-23  

Delivered:

* four utility views — Electricity, Heat, Water, District Cooling;
* 24h, 30d and 12m period switching;
* runtime SVG charts with area fill, line path and peak marker;
* KPI metrics — average, peak, latest — per utility per period;
* period-aligned related utility summary cards (summaries match the active period);
* requested and effective period display in Period Details panel;
* per-utility source timestamps;
* provenance attribution — Helsinki Nuuka Open API;
* quality and granularity disclosure per utility;
* loading, partial, empty, error, cached-snapshot and memory-cache states;
* Data Notice with prototype-scope and non-operational disclosure;
* no interpolated or fabricated utility values;
* responsive layout with auto-zoom on laptop viewports.

### Stage 7 — Building Intelligence

**Status:** Implemented and approved  
**Closed:** 2026-06-24  

Delivered:

* clean Oodi cutaway illustration integrated (`public/media/oodi/building-intelligence-cutaway.webp`);
* deterministic conceptual dataset — 45 records, 9 zones × 5 intelligence layers, no random values or live timestamps;
* four level views — All Levels, Level 1, Level 2, Level 3;
* five intelligence layers — Occupancy, Indoor Comfort, Air Quality, HVAC, Asset Health;
* code-based overlays and hotspots positioned on the cutaway image via CSS percentage coordinates;
* level region bands calibrated to the image geometry, visible as highlight bands;
* level-specific insights for every level × layer combination (20 unique insight texts);
* layer-specific status terminology — occupancy uses Low/Moderate/High; HVAC uses Reduced Demand/Balanced/Elevated Demand; others use Good/Moderate/Attention;
* hotspot and zone-list selection remain synchronized; scrolls zone into view on selection;
* ClassificationBadge and DisclosureBar display persistent conceptual-IoT disclosures throughout the page;
* no BMS connection, no real sensor data, no fake live timestamps, no control behavior;
* responsive layout with auto-zoom behavior on laptop viewports consistent with other pages;
* keyboard focus and aria-pressed behavior for hotspot and zone buttons; inactive hotspots are aria-hidden and tabIndex -1;
* reduced-motion prefers-reduced-motion supported via CSS;
* typecheck, lint, 108/108 tests and production build all pass.

### Stage 8 — Insights and Data Transparency

**Status:** Implemented and approved  
**Closed:** 2026-06-25  

Delivered:

**Insights page:**

* deterministic rule-based insight generation — no runtime generative AI, no machine learning, no unsupported causal claims or forecasts;
* Priority Insights section — maximum two Data Notice cards, remaining notices overflow to Data Quality & Coverage;
* Data Quality & Coverage section — separate from Priority Insights, lists all remaining data-quality observations without crowding the priority view;
* Latest Available Readings — compact per-utility cards with correct values, units and individual source timestamps; no synchronized timestamps;
* Weather Context — independently attributed Open-Meteo data displayed separately from utility data; no implied causal relationship;
* Period Context — secondary summaries for requested and effective periods; fallback period labelled when it differs from the request;
* loading, empty, partial, fallback, cached-snapshot and error states preserved throughout;
* no synthetic scores, no interpolated values, no operational-system claims;
* no full-card duplication between Priority Insights and Data Quality & Coverage;
* responsive layout consistent with other pages.

**Data Transparency page:**

* Public Building Data, Current Public Weather Data and Conceptual IoT Layer remain clearly and visually distinct via ClassificationBadge;
* Cached Public Data Snapshot, Partial Data and Unavailable / Error remain distinguishable;
* Helsinki Nuuka Open API attribution accurate; Open-Meteo CC BY 4.0 attribution accurate;
* Opening Hero and Building Intelligence image credits both explicitly described as AI-assisted and conceptual — no public-domain claim;
* requested versus effective period explained in Methodology;
* independent utility timestamps explained — each utility has its own source timestamp, not synchronised;
* fallback and snapshot authenticity explained — snapshot contains authentic Nuuka data, not synthesised values;
* no-interpolation statement preserved;
* project limitations and non-affiliation disclaimer present — not affiliated with Oodi, the City of Helsinki, Nuuka, Open-Meteo or WSP;
* all text readable at Chrome 100% zoom across 1280×800, 1536×864 and 1920×1080;
* no horizontal scrolling; no content overlap; keyboard focus visible; direct route refresh works;
* typecheck, lint, 124/124 tests and production build all pass.

### Stage 9 — Final Quality Assurance

**Status:** Complete  
**Recommendation:** PASS  
**Closed:** 2026-06-25  
**QA commit:** `33ebb85`  
**Browser/tooling:** Chromium · Playwright  

Validated:

* 28 test files, 124 tests — all pass;
* TypeScript typecheck, ESLint and production build — all pass;
* all six routes (`/`, `/overview`, `/resource-performance`, `/building-intelligence`, `/insights`, `/data-transparency`) — render correctly, no application errors;
* browser back and forward navigation — correct;
* active `aria-current="page"` nav state — correct on all routes;
* direct hash-route refresh — correct (hash routing, no server-side config required);
* four utility selectors and three period selectors on Resource Performance — all functional;
* four level selectors and five intelligence layer tabs on Building Intelligence — all functional, correct pressed states;
* Priority Insights cap — two Data Notice cards in Priority section, remaining in Data Quality & Coverage;
* utility fallback states — labelled "Latest available period" with visual indicator for Electricity, Heat and District Cooling; Water returned live hourly data;
* Open-Meteo weather — independent from utility timestamps, independently attributed;
* Conceptual IoT disclosures — present throughout Building Intelligence;
* no horizontal scroll at 2560×1440, 1920×1080, 1536×864 and 1366×768;
* focus-visible outlines — present (`2px solid` accent) on all interactive elements;
* reduced-motion CSS — present in stylesheet;
* tab order — logical (logo → navigation → content);
* no application-level JavaScript or React errors in browser console.

Defect summary: High 0 · Medium 0 · Low 1.

Documented limitations:

* Nuuka hourly endpoint returns 404 for Electricity, Heat and District Cooling when requesting today's data — this is a server-side API behaviour, not an application defect; the fallback strategy correctly recovers via monthly data and an earlier hourly window; browser console logs these 404s automatically (cannot be suppressed in client code); fallback states are correctly labelled in the UI.

**Conclusion:** Approved for Stage 10 — Portfolio Packaging.

---

## 16. Development Principles

Development should proceed in small, reviewable stages.

Recommended sequence:

1. Data discovery — completed
2. PRD approval
3. Data normalization and time-window strategy
4. Weather integration
5. Information architecture
6. Visual design system
7. Dashboard implementation
8. Conceptual IoT layer
9. Data transparency
10. Testing
11. Portfolio screenshots
12. Deployment

Do not implement the complete dashboard in one large Codex request.

Each stage should be tested before moving to the next.

---

## 17. Current Project Status

Completed stages:

* Stage 1 — Data Discovery: Oodi identified in Nuuka; four utility groups confirmed; CORS confirmed.
* Stage 2 — Data Foundation: runtime Nuuka integration; normalized data structures; loading, error, empty, partial and snapshot states.
* Stage 3 — Weather Integration: Open-Meteo forecast API; independent weather timestamp; CC BY 4.0 attribution.
* Stage 4 — Information Architecture: navigation, routing, page shell, responsive layout, sidebar.
* Stage 5 — Visual Design System: design tokens, shared components, DataStatus, ClassificationBadge, DisclosureBar, chart visual language.
* Stage 6 — Resource Performance: four utility views; 24h, 30d, 12m periods; SVG charts; KPI metrics; provenance attribution.
* Stage 7 — Building Intelligence: cutaway illustration; deterministic conceptual IoT dataset; zone/layer/level selection; conceptual disclosures throughout.
* Stage 8 — Insights and Data Transparency: deterministic rule-based Insights; Priority Insights with two-card Data Notice cap; Data Quality & Coverage section; compact Latest Available Readings; independent Weather Context; Data Transparency information architecture; source classifications, methodology, limitations and AI-assisted image credits.
* Stage 9 — Final Quality Assurance: 124/124 tests pass; typecheck, lint and build pass; all six routes verified; responsive layouts confirmed at four viewports; keyboard focus and reduced-motion confirmed; no High or Medium defects; Nuuka 404 fallback behaviour documented as known limitation.

**MVP complete.**
