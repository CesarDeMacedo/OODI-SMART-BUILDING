# Oodi Smart Building Intelligence — Case Study Content

## Project Title

Oodi Smart Building Intelligence

## Project Type

Self-initiated Digital Advisory portfolio prototype

## One-Line Summary

A browser-based smart-building experience that transforms public utility data from Helsinki Central Library Oodi, current Open-Meteo weather context and clearly labelled deterministic conceptual IoT information into an accessible building-intelligence interface — demonstrating how fragmented public building data can be structured, contextualized and communicated to an executive or advisory audience.

---

## Challenge

Public building data is often technically available but fragmented, difficult to interpret and disconnected from spatial or executive context.

Helsinki Central Library Oodi publishes utility consumption data through the Nuuka Open API. That data — electricity, heat, water and district cooling — is real and publicly accessible, but it arrives as raw timestamped readings with no narrative, no spatial context and no comparison to weather or operational conditions.

The challenge was to evaluate whether that data could be meaningfully structured, visualized and contextualized without fabricating results, overstating capabilities or implying an operational connection that does not exist.

---

## Approach

The project combined six elements:

**1. Real public building data (Nuuka)**  
Electricity, heat, water and district cooling readings for Oodi (property 4669, Helsinki). Data is fetched at runtime, normalized to consistent structures and displayed with source timestamps, granularity disclosure and fallback labelling when live hourly data is unavailable.

**2. Current public weather context (Open-Meteo)**  
Temperature, humidity, wind speed and weather code are fetched independently from Open-Meteo and displayed alongside building data. Weather is never implied to causally explain utility readings — it is presented as independent context with its own source attribution and CC BY 4.0 licence credit.

**3. Normalized repositories and fallback logic**  
Each utility has its own normalized data repository. When a finer-grained period is unavailable (for example, today's hourly data returns a 404 from the Nuuka API), the application falls back to the next available granularity and labels the fallback explicitly in the UI. No values are interpolated or synthesized.

**4. Deterministic insight rules**  
The Insights page generates rule-based observations from the data — for example, identifying the highest-consumption period or noting data quality conditions. No runtime generative AI is used. All insights are deterministic functions of the fetched data.

**5. Conceptual building-intelligence layers**  
The Building Intelligence page presents a deterministic dataset of 45 records across 9 building zones and 5 intelligence layers (Occupancy, Indoor Comfort, Air Quality, HVAC, Asset Health). This dataset is explicitly labelled as conceptual prototype data throughout the interface via ClassificationBadge components and a persistent DisclosureBar. There is no BMS connection and no real sensor data.

**6. Transparent source classification and responsive UX**  
Every data source is visually classified using colour-coded badges (Public Building Data, Current Public Weather Data, Conceptual IoT Layer). A dedicated Data Transparency page documents sources, methodology, limitations and non-affiliation. The application is responsive across desktop and mobile viewports.

---

## Solution

The completed application delivers six routes:

**Opening** (`/`)  
Hero landing page with live weather context, building summary and a primary call-to-action introducing the experience.

**Overview** (`/overview`)  
Executive summary combining utility summaries, active insights, weather context and previews of all four utility groups in a single scannable view.

**Resource Performance** (`/resource-performance`)  
Utility-specific deep-dive views for Electricity, Heat, Water and District Cooling. Each view includes an SVG chart, KPI metrics (average, peak, latest), period controls (24h, 30d, 12m), source timestamps and fallback labelling. Each utility has a distinct visual overlay communicating its character.

**Building Intelligence** (`/building-intelligence`)  
Interactive Oodi cutaway illustration with level and intelligence-layer selection. Four level views and five intelligence layers produce 20 unique insight panels. A deterministic conceptual dataset drives all displayed values — consistently labelled as prototype data.

**Insights** (`/insights`)  
Priority Insights (capped at two Data Notice cards), Latest Available Readings (per-utility compact cards with independent timestamps), Weather Context (independently attributed) and Data Quality & Coverage observations.

**Data Transparency** (`/data-transparency`)  
Full disclosure of all data sources, source classifications, methodology, data limitations, non-affiliation disclaimer and technology stack. AI-assisted image credits are included.

---

## My Role

- Product strategy — defined the MVP scope, data honesty principles and portfolio positioning
- Information architecture — designed the six-route structure, navigation model and content hierarchy
- UX/UI direction — established the visual design system, design tokens, chart language and responsive layout
- Data-source evaluation — identified Nuuka and Open-Meteo as appropriate public sources; confirmed Oodi property code and API behaviour
- Technical visualization — implemented SVG charts, utility overlays, conceptual IoT hotspot system and level/layer interaction
- AI-assisted application development — used ChatGPT, Claude Code and Codex to accelerate planning, design decisions and implementation
- QA and portfolio packaging — conducted staged validation, resolved all High and Medium defects, and produced this portfolio documentation

---

## Data Honesty

This project uses three distinct data types. These are visually distinguished throughout the application and explained fully on the Data Transparency page.

**Nuuka utility data** — real, publicly available property-level consumption readings from the Helsinki Nuuka Open API. Data is fetched at runtime, displayed with source timestamps and subject to the API's own update schedule (typically daily). This is not private or internal Nuuka data.

**Open-Meteo weather data** — real, current public weather data from the Open-Meteo forecast API, licensed under CC BY 4.0. Displayed independently from utility data with its own attribution.

**Conceptual IoT data** — a deterministic prototype dataset created for the Building Intelligence experience. It represents illustrative operational indicators for 9 zones across 5 intelligence layers. It is not connected to any BMS, sensor network or operational system. It contains no live timestamps and no random values. It is labelled as conceptual prototype data in every view where it appears.

**No operational BMS connection exists.**  
**No runtime generative AI is used in the deployed application.**  
**This project is not affiliated with Oodi, the City of Helsinki, Nuuka, Open-Meteo or WSP.**

---

## Results

The following results are verified by repository documentation and commit history. No business ROI, energy savings or user metrics are claimed.

- Completed staged MVP across 10 development stages
- Six functional routes delivered and validated
- 124/124 automated tests pass (Vitest + Playwright, Stage 9 QA commit `33ebb85`)
- TypeScript typecheck, ESLint and production build all pass
- Responsive layouts confirmed at 390×844, 430×932, 1366×768, 1536×864 and 1920×1080
- Stage 9 QA recommendation: **PASS**
- High defects: 0 · Medium defects: 0 · Low defects: 1 (documented Nuuka API 404 fallback — expected server-side behaviour, correctly handled by the application)
- Desktop and mobile validation complete
- All data-source classifications, fallback labels and conceptual IoT disclosures verified in the deployed application

---

## Links

- **Live application:** [https://cesardemacedo.github.io/OODI-SMART-BUILDING/](https://cesardemacedo.github.io/OODI-SMART-BUILDING/)
- **Portfolio:** [https://blacklabvisuals.com/](https://blacklabvisuals.com/)
- **LinkedIn:** [https://www.linkedin.com/in/cesar-de-macedo-3b4a5a51/](https://www.linkedin.com/in/cesar-de-macedo-3b4a5a51/)
