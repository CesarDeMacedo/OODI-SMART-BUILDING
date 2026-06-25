# Oodi Smart Building Intelligence — Screenshot Shot List

All screenshots captured at 1920×1080 unless otherwise noted.  
Output directory: `portfolio-assets/screenshots/`  
Capture script: `e2e/portfolio-screenshots.spec.ts`

---

## Desktop Screenshots

### 01 — Opening

| Field | Value |
|---|---|
| Filename | `01-opening-desktop.png` |
| Route | `/` (hash: `/#/`) |
| Viewport | 1920×1080 |
| Selected state | Default on load |
| Expected content | Full hero with Oodi building visual; live weather context panel (temperature, humidity, wind); primary CTA button ("Explore Building Intelligence" or equivalent); project title and subtitle |

---

### 02 — Overview

| Field | Value |
|---|---|
| Filename | `02-overview-desktop.png` |
| Route | `/overview` (hash: `/#/overview`) |
| Viewport | 1920×1080 |
| Selected state | Default on load |
| Expected content | Complete executive overview; utility summary cards for all four utilities (Electricity, Heat, Water, District Cooling); active insights panel; weather context; route previews or navigation hints |

---

### 03 — Resource Performance — Electricity

| Field | Value |
|---|---|
| Filename | `03-resource-electricity-desktop.png` |
| Route | `/resource-performance` (hash: `/#/resource-performance`) |
| Viewport | 1920×1080 |
| Selected state | Electricity utility selected; default period (30d or most recent available) |
| Expected content | Gold/amber utility overlay; SVG area chart with data points; KPI metrics (average, peak, latest); period selector; source timestamp; fallback label if applicable |

---

### 04 — Resource Performance — Water

| Field | Value |
|---|---|
| Filename | `04-resource-water-desktop.png` |
| Route | `/resource-performance` (hash: `/#/resource-performance`) |
| Viewport | 1920×1080 |
| Selected state | Water utility selected; default period |
| Expected content | Blue organic utility overlay; SVG chart or zero-state explanation if no data available for the selected period; KPI metrics or empty state; source timestamp |

---

### 05 — Building Intelligence

| Field | Value |
|---|---|
| Filename | `05-building-intelligence-desktop.png` |
| Route | `/building-intelligence` (hash: `/#/building-intelligence`) |
| Viewport | 1920×1080 |
| Selected state | Level 2 selected; Occupancy intelligence layer active; at least one zone hotspot selected |
| Expected content | Oodi cutaway illustration; visible level region band for Level 2; zone hotspots; active zone insight panel with conceptual IoT disclosure (ClassificationBadge, DisclosureBar); layer tabs |

---

### 06 — Insights

| Field | Value |
|---|---|
| Filename | `06-insights-desktop.png` |
| Route | `/insights` (hash: `/#/insights`) |
| Viewport | 1920×1080 |
| Selected state | Default on load |
| Expected content | Priority Insights section (maximum two Data Notice cards); Latest Available Readings (per-utility compact cards); Weather Context panel with Open-Meteo attribution; Data Quality & Coverage section |

---

### 07 — Data Transparency

| Field | Value |
|---|---|
| Filename | `07-data-transparency-desktop.png` |
| Route | `/data-transparency` (hash: `/#/data-transparency`) |
| Viewport | 1920×1080 |
| Selected state | Default on load; scroll to top |
| Expected content | Source classifications (Public Building Data, Current Public Weather Data, Conceptual IoT Layer) with ClassificationBadge; Methodology section; Project authorship and Technology stack section visible |

---

## Mobile Screenshots

### 08 — Overview (Mobile)

| Field | Value |
|---|---|
| Filename | `08-overview-mobile.png` |
| Route | `/overview` (hash: `/#/overview`) |
| Viewport | 390×844 |
| Selected state | Default on load; scroll to top |
| Expected content | Mobile layout of the Overview page; stacked utility summary cards; navigation visible; no horizontal overflow |

---

### 09 — Resource Performance (Mobile)

| Field | Value |
|---|---|
| Filename | `09-resource-mobile.png` |
| Route | `/resource-performance` (hash: `/#/resource-performance`) |
| Viewport | 390×844 |
| Selected state | Electricity utility selected; default period; scroll to top |
| Expected content | Mobile layout; utility selector visible; chart scaled to mobile width; KPIs stacked; no horizontal overflow |

---

### 10 — Building Intelligence (Mobile)

| Field | Value |
|---|---|
| Filename | `10-building-intelligence-mobile.png` |
| Route | `/building-intelligence` (hash: `/#/building-intelligence`) |
| Viewport | 390×844 |
| Selected state | Default on load (All Levels, Occupancy layer); scroll to top |
| Expected content | Mobile layout of the Building Intelligence page; cutaway image scaled to mobile width; level and layer selectors visible; conceptual IoT disclosure present; no horizontal overflow |

---

## Additional Desktop Screenshots

### 11 — Project Authorship and Technology Stack

| Field | Value |
|---|---|
| Filename | `11-authorship-technology-stack-desktop.png` |
| Route | `/data-transparency` (hash: `/#/data-transparency`) |
| Viewport | 1920×1080 |
| Selected state | Default on load; scrolled so `#dt-authorship-heading` is ~80 px from top of viewport |
| Expected content | "Project authorship" section heading; authorship description (Cesar De Macedo, self-initiated prototype); role and contribution summary; independent-study disclaimer; "View Portfolio" and "Connect on LinkedIn" CTAs; "Technology stack" column with FRONTEND, RUNTIME DATA, PUBLIC DATA, TESTING & QA, DEPLOYMENT and AI TOOLS rows; AI-development-only disclosure note; global footer attribution |
| Framing | `#dt-authorship-heading` scrolled into view via `scrollIntoViewIfNeeded`, then nudged so the heading sits 80 px from top; excludes bulk of upper methodology content |
