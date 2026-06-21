# Oodi Smart Building Intelligence
## Stage 4 — Information Architecture Technical Specification

**Document type:** Stage Implementation Specification  
**Version:** 1.0  
**Status:** Proposed for review  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 4 — Information Architecture  
**Implementation authorization:** Not yet granted  
**Primary implementation agent:** Codex  
**Primary reviewer:** Project owner  
**Date:** 2026-06-21  

---

## 1. Purpose

This specification defines the technical contract for **Stage 4 — Information Architecture** of the Oodi Smart Building Intelligence MVP.

Stage 4 shall transform the completed data foundations from Stages 2 and 3 into an implementable application structure with clear page hierarchy, content grouping, navigation, layout logic, media-slot strategy, page responsibilities, module responsibilities, responsive behavior, and interface states.

This stage is **not** the final visual design stage. It establishes the structural system that later visual refinement will use.

The implementation shall:

- define the top-level page architecture of the MVP;
- implement a coherent navigation model;
- structure page-level content according to the approved visual references;
- introduce reusable page sections and layout regions;
- implement semantic **media slots** that support both images and videos;
- preserve transparency of data source classification;
- preserve technical honesty around public utility data, current public weather, and conceptual data;
- support later asset replacement without layout refactoring;
- support later Stage 5 visual refinement without structural rework.

The approved PRD remains the product source of truth.

---

## 2. Source-of-truth hierarchy

When sources differ, use this order:

1. Approved PRD  
2. Approved Stage 2 and Stage 3 implementation reality  
3. Approved Stage 2 and Stage 3 specifications  
4. This Stage 4 specification  
5. Approved visual reference pages discussed for Stage 4  
6. Existing repository conventions  

Any structural contradiction with the PRD must be reported before implementation changes are made.

---

## 3. Stage objective

At completion, the application shall have a coherent front-end information architecture with:

- a clear opening page;
- an overview page;
- a detailed resource-performance page;
- top navigation shared across the core experience;
- a stable content hierarchy;
- reusable layout primitives;
- reusable module containers;
- media slots that support image or video assets;
- clear placement for public utility data, weather context, insights, transparency, and conceptual building intelligence;
- desktop-first responsive logic with defined tablet/mobile fallback behavior.

This stage should make the app structurally ready for:

- Stage 5 — Visual Design System
- Stage 6 — Resource Performance refinement
- Stage 7 — Building Intelligence
- Stage 8 — Insights and Transparency

---

## 4. Scope

### 4.1 Included

Stage 4 includes:

1. Page hierarchy
2. Route or page structure
3. Global navigation model
4. Shared header/top bar structure
5. Page section architecture
6. Content grouping and module boundaries
7. Reusable layout primitives
8. Desktop-first page composition
9. Tablet and mobile reflow rules
10. Interaction hierarchy
11. Utility selection placement rules
12. Hero-section structure
13. Overview information grouping
14. Resource Performance page structure
15. Placeholders / media-slot system
16. Image/video asset abstraction
17. Empty/loading/error/partial state placement
18. Disclosure and transparency placement
19. Conceptual-layer labeling placement
20. Information density rules by page
21. Content escalation rules from summary pages to detail pages
22. Structural accessibility considerations
23. Stage 4 developer implementation notes
24. Acceptance criteria

### 4.2 Excluded

Stage 4 shall not implement:

- final polished visual design system;
- final chart design language;
- deep motion design;
- animation choreography;
- final icon system refinement;
- final typography tuning;
- final color-token refinement;
- video content production;
- new data-provider integrations;
- Stage 5 aesthetic detailing;
- Stage 6 analytical enhancements;
- Stage 7 conceptual system expansion;
- Stage 8 insight logic changes;
- Stage 9 QA packaging;
- Stage 10 portfolio packaging.

This stage is structural, not final-art-direction implementation.

---

## 5. Approved visual-reference basis

Stage 4 is grounded on **three approved reference-page directions**:

### Page 01 — Opening / Landing
Role:
- presentation page
- emotional entry point
- low information density
- strong Oodi hero image
- premium visual tone
- initial app orientation

### Page 02 — Overview
Role:
- executive summary page
- highest information density
- integrated public utility data, current public weather, conceptual layer, insights, and data transparency
- system-wide summary

### Page 03 — Resource Performance
Role:
- detailed analytical page
- one selected utility at a time
- stronger data focus than Opening page
- stronger visual building presence than a generic dashboard
- subtle system overlay over Oodi imagery to support analytical understanding

These references define **architecture and module hierarchy**, not pixel-perfect reproduction requirements.

---

## 6. Core product-page hierarchy

The Stage 4 architecture shall define at least the following primary pages:

1. **Opening / Landing**
2. **Overview**
3. **Resource Performance**
4. **Building Intelligence**
5. **Insights**
6. **Data Transparency**

Only the first three require strong structural implementation guidance in this stage. The latter three may initially exist as route shells, placeholders, or partial structural pages if they are not yet fully implemented.

### 6.1 Ordered user journey

Preferred initial journey:

```text
Opening / Landing
→ Overview
→ Resource Performance
→ Building Intelligence / Insights / Data Transparency
```

The app must not require the user to start on a dense dashboard.

---

## 7. Global navigation model

### 7.1 Primary navigation

The app shall use a **shared top horizontal navigation bar** across the main experience.

Required items:

- Overview
- Resource Performance
- Building Intelligence
- Insights
- Data Transparency

Optional global utility items:

- theme or display toggle icon
- expand or presentation-mode style icon
- language selector only if already justified

### 7.2 No sidebar at this stage

Stage 4 shall **not** implement a primary left sidebar as the default navigation model.

Reasoning:

- the approved direction uses a premium widescreen layout;
- sidebar reduces available hero and analytical width;
- current MVP scope does not require dense enterprise navigation.

### 7.3 Header content

The shared top bar should preserve:

- OODI mark / wordmark
- “Smart Building Intelligence”
- “Independent Prototype” badge
- navigation items
- minimal global action icons

---

## 8. Information-density strategy by page

The Stage 4 architecture must intentionally vary density by page.

### 8.1 Opening / Landing
Low density:
- emotional
- explanatory
- orienting
- invite to enter the system

### 8.2 Overview
High density:
- executive summary
- multiple modules visible at once
- one-page summary of the full MVP

### 8.3 Resource Performance
Medium density:
- focused analysis
- selected utility
- periods
- metrics
- hero + analysis balance

This density strategy is a formal design rule and must guide layout decisions.

---

## 9. Page 01 — Opening / Landing architecture

### 9.1 Purpose

The Opening page introduces the product without overwhelming the user with dashboard complexity.

### 9.2 Required content blocks

1. Shared top navigation/header
2. Large left-aligned or split hero title/content block
3. Strong Oodi hero media area
4. Three entry/action cards
5. Bottom summary information band

### 9.3 Required content themes

Opening page messaging shall include:

- product name;
- Oodi / Helsinki context;
- concise product statement;
- independent-prototype framing;
- public-data positioning;
- conceptual-IoT framing where relevant;
- quick entry actions such as:
  - Enter Overview
  - Explore Resource Performance
  - View Methodology

### 9.4 Bottom summary band

A lower information band may include compact summaries of:

- public utility data availability;
- current weather summary;
- conceptual IoT note;
- prototype disclaimer.

### 9.5 Structural rule

The Opening page must **not** attempt to present the whole dashboard.

Its purpose is presentation and orientation.

---

## 10. Page 02 — Overview architecture

### 10.1 Purpose

The Overview page shall function as a complete executive summary of the MVP.

### 10.2 Required section order

Preferred desktop order:

1. Shared top navigation/header
2. Main hero/context row
3. Utility summary-card row
4. Main analytical row
5. Lower context / intelligence row
6. Footer or bottom disclosure

### 10.3 Section definitions

#### A. Hero and Building Context row
Two major panels:

- **Hero / Oodi summary panel**
- **Building Context panel**

The Hero panel includes:
- Oodi name
- location
- concise description
- hero media
- badges for:
  - Public Utility Data Available
  - Conceptual IoT Layer

The Building Context panel includes:
- location/type
- current weather from Open-Meteo
- observation timestamp
- weather summary
- reminder that utility datasets update independently

#### B. Utility summary row
Four summary cards:

- Electricity
- Heat
- Water
- District Cooling

Each card must structurally support:
- utility name
- latest value
- unit
- latest timestamp
- source
- availability/provenance cue
- granularity badge

These remain summary cards, not full analysis modules.

#### C. Main analytical row
Two major panels:

- **Resource Performance summary panel**
- **Insights panel**

Resource Performance summary must include:
- selected utility label
- period selector
- chart area
- key metrics (average / peak / latest)
- requested/effective/source timestamp metadata

Insights panel must include:
- 1 primary insight
- up to 2 secondary insights
- short explainable language
- clear source/context framing

#### D. Lower contextual row
Two panels:

- **Building Intelligence panel**
- **Data Transparency panel**

Building Intelligence panel must clearly show:
- conceptual-layer labeling
- HVAC Systems
- Indoor Comfort
- Occupancy
- Asset Health

Data Transparency panel must summarize:
- Public Data
- Current Weather
- Conceptual Data
- timestamps
- status labels
- route to deeper methodology

### 10.4 Structural rule

The Overview must be information-rich, but it must not replace all detail pages. It is a summary surface.

---

## 11. Page 03 — Resource Performance architecture

### 11.1 Purpose

The Resource Performance page provides deeper utility analysis while preserving the Oodi building as a strong visual anchor.

### 11.2 Required content blocks

1. Shared top navigation/header
2. Left explanatory intro block
3. Main hero/media analysis area
4. Utility selector row
5. Main chart and analysis band
6. Supporting metric cards
7. Timestamp and period metadata section
8. Disclosure note

### 11.3 Required resource controls

The page must structurally support utility selection for:

- Electricity
- Heat
- Water
- District Cooling

Period selection must structurally support:

- 24 Hours
- 30 Days
- 12 Months

### 11.4 Hero/media area requirements

The Oodi image must remain visually strong.

However:

- the building image must not be covered by many UI cards;
- the analytical overlay must remain subtle;
- the overlay should feel like an explanatory system layer, not a noisy interface collage.

### 11.5 Overlay strategy

The main building media should support a **subtle energy-system overlay**.  
For Stage 4 structure, this means the architecture must reserve a hero-media container capable of supporting:

- a base image or video;
- an optional overlay graphic layer;
- optional utility-specific overlay states;
- later animation enhancement without changing layout.

### 11.6 Supporting analysis modules

Below or beside the hero/media zone, the page should support:

- main chart
- period tabs
- key metric cards
- selected-utility detail cards
- requested/effective/source timestamp block
- small related utility cards if needed

### 11.7 Structural rule

The Resource Performance page should be less dense than Overview but more analytical than Opening.

---

## 12. Media-slot and placeholder architecture

This is a required Stage 4 structural decision.

### 12.1 Rationale

The app uses important visual assets. These must be replaceable later without layout refactoring.

The architecture shall therefore use **semantic media slots**, not hardcoded final-image assumptions.

### 12.2 General rule

Do not build page layout around one specific final image file.  
Build page layout around named, structured media slots.

### 12.3 Media-slot model

A recommended contract:

```ts
export type MediaAssetType = 'image' | 'video'

export interface MediaAsset {
  type: MediaAssetType
  src: string
  alt: string
  poster?: string
  caption?: string
}
```

### 12.4 Required media-slot naming

At minimum, Stage 4 should reserve slots equivalent to:

- `openingHeroMedia`
- `overviewHeroMedia`
- `resourcePerformanceHeroMedia`
- `resourcePerformanceOverlayMedia`
- `buildingIntelligenceIllustration`
- `dataTransparencySupportMedia` (optional)

### 12.5 Centralized registry

Media-slot references should be centralized in one configuration/content module, for example:

```text
src/content/mediaAssets.ts
```

or

```text
src/config/mediaAssets.ts
```

### 12.6 Layout stability requirements

Media slots must be implemented with stable containers that define:

- expected aspect ratio;
- width behavior;
- height behavior;
- corner radius;
- crop/cover behavior;
- fallback styling if media is missing.

### 12.7 Fallback behavior

If an asset is missing, the app should not visually break.

Fallbacks may use:
- gradient placeholder;
- dark placeholder block;
- subtle “media placeholder” label if appropriate;
- no broken-image icon.

### 12.8 Text separation rule

Important UI text must remain in interface components, **not embedded into the media itself**.

### 12.9 Future video support

Media slots must support later replacement of images by videos without layout refactoring.

Required assumptions for future video usage:

- poster support;
- muted autoplay only if later used;
- `playsInline`;
- graceful fallback to poster/image;
- respect for reduced-motion preferences where feasible.

Stage 4 does **not** need to implement final video behavior, but it must keep the structure ready.

---

## 13. Reusable layout primitives

Stage 4 should introduce reusable page-level primitives or equivalent layout patterns.

Recommended primitives:

- `AppShell`
- `TopNavigation`
- `PageHero`
- `InfoPanel`
- `CardGrid`
- `MetricCard`
- `SummaryCard`
- `SectionPanel`
- `MediaSlot`
- `DisclosureBar`
- `StatusBadge`

Equivalent naming is acceptable.

These primitives should support reuse rather than page-specific one-off layout hacks.

---

## 14. Module responsibility map

The architecture should conceptually separate the following module types.

### 14.1 Presentation modules
Examples:
- Opening hero
- Intro copy
- Page heading blocks

### 14.2 Summary modules
Examples:
- utility summary cards
- building context
- transparency summary

### 14.3 Analytical modules
Examples:
- resource performance chart section
- period selectors
- metric groups

### 14.4 Disclosure modules
Examples:
- independent update warning
- conceptual layer disclaimer
- academic prototype disclaimer

### 14.5 Navigation modules
Examples:
- top navigation
- page entry cards
- method/transparency link surfaces

This separation helps later stages evolve without structural confusion.

---

## 15. Data-classification placement rules

The architecture must visibly protect data honesty.

The app currently works with at least three categories:

1. Public utility data
2. Current public weather
3. Conceptual / illustrative data

These classifications must be structurally visible where relevant.

### Required placement rules

- Overview hero may show high-level classification badges.
- Data Transparency must explicitly list classifications.
- Building Intelligence must clearly indicate conceptual status.
- Weather must not be presented as a building sensor system.
- Utility datasets must be visibly allowed to update independently.

The architecture shall make room for these disclosures; it must not hide them as afterthoughts.

---

## 16. State architecture

Stage 4 must define how layout handles interface states, even when not every state is fully styled yet.

### 16.1 Required state types

Each major data-driven module should be able to structurally show:

- loading
- success
- partial
- empty
- error

### 16.2 Where states must be supported

At minimum:

- weather summary panel
- utility summary cards
- Resource Performance summary/chart area
- Insights panel
- Data Transparency panel

### 16.3 State-display rule

States should appear within the module container they affect.  
A local failure should not structurally destroy the whole page layout.

---

## 17. Responsive architecture

Stage 4 must define how the app reflows, not just how it looks on a widescreen desktop.

### 17.1 Desktop-first principle

The approved visual references are desktop-oriented.

The Stage 4 implementation may be desktop-first, but it must include responsive rules.

### 17.2 Tablet behavior

For tablet widths:

- top navigation may wrap or compress;
- hero/context rows may stack;
- utility cards may wrap to two-per-row;
- analytical two-column rows may stack vertically.

### 17.3 Mobile behavior

For smaller widths:

- Opening page stacks hero and cards vertically;
- Overview becomes a vertical reading flow:
  - hero/context
  - utilities
  - performance
  - insights
  - building intelligence
  - transparency
- Resource Performance stacks:
  - intro
  - hero media
  - selectors
  - chart
  - metrics
  - metadata

### 17.4 Priority rule

Do not attempt to preserve desktop side-by-side density on small screens.

Readability and order outrank visual mimicry.

---

## 18. Accessibility and structural clarity

Stage 4 is not a full accessibility pass, but it must avoid structural problems.

Required considerations:

- logical heading hierarchy;
- clickable elements as real controls;
- media with alt text placeholders;
- clear grouping for navigation;
- keyboard-friendly interactive structure where practical;
- visible text not embedded only in decorative imagery.

---

## 19. Interaction hierarchy

Stage 4 must define what the user can primarily do from each page.

### Opening / Landing
Primary actions:
- enter Overview
- explore Resource Performance
- view Methodology / Data Transparency

### Overview
Primary actions:
- inspect top-level conditions
- compare utilities
- inspect one highlighted performance summary
- access transparency and deeper pages

### Resource Performance
Primary actions:
- switch utility
- switch period
- inspect chart
- inspect metrics and timestamps
- understand building-visual overlay relationship

The architecture should make these actions obvious without clutter.

---

## 20. Page-to-page relationship rules

### 20.1 Opening to Overview
Opening introduces the experience.

### 20.2 Overview to Resource Performance
Overview summarizes; Resource Performance expands the selected analytical thread.

### 20.3 Overview to Building Intelligence
Overview previews conceptual modules; Building Intelligence deepens them later.

### 20.4 Overview to Insights / Data Transparency
Overview previews these areas; the later pages deepen their content.

This establishes a consistent rule:
**summary page → detail page**.

---

## 21. Out-of-scope navigation caution

Stage 4 shall avoid introducing false enterprise complexity such as:

- Alerts
- Reports
- Settings
- Operations control
- BMS-style control-room behaviors

These are out of scope and would weaken technical honesty.

---

## 22. Proposed file structure direction

Equivalent structure is acceptable, but Stage 4 should likely introduce or evolve files in the spirit of:

```text
src/
  app/
    routes/
      OpeningPage.tsx
      OverviewPage.tsx
      ResourcePerformancePage.tsx
      BuildingIntelligencePage.tsx
      InsightsPage.tsx
      DataTransparencyPage.tsx

  components/
    layout/
      AppShell.tsx
      TopNavigation.tsx
      PageSection.tsx
      MediaSlot.tsx
      DisclosureBar.tsx

    cards/
      UtilitySummaryCard.tsx
      MetricCard.tsx
      SummaryCard.tsx
      InsightCard.tsx
      TransparencyRow.tsx

    sections/
      OpeningHeroSection.tsx
      OverviewHeroSection.tsx
      BuildingContextSection.tsx
      ResourcePerformanceSection.tsx
      InsightsSection.tsx
      BuildingIntelligenceSection.tsx
      DataTransparencySection.tsx

  content/
    mediaAssets.ts
    pageMeta.ts

  config/
    oodi.ts
```

This is illustrative, not mandatory.

---

## 23. Stage 4 constraints

Implementation must respect the following:

- do not weaken Stage 2 or Stage 3 logic;
- do not rewrite weather or utility repositories unless structurally required;
- do not add new providers;
- do not add new secrets or backend services;
- do not fake operational capability;
- do not embed final image assumptions directly in page code;
- do not create a sidebar-driven enterprise shell;
- do not hide public/conceptual distinctions;
- do not implement final polished design-system refinements yet;
- do not start Stage 5 visual-detail work beyond what Stage 4 structurally requires.

---

## 24. Acceptance criteria

### Page hierarchy
1. The app has a clear Opening / Landing page.
2. The app has a clear Overview page.
3. The app has a clear Resource Performance page.
4. The app has structural placeholders/routes for Building Intelligence, Insights, and Data Transparency if not fully implemented.

### Navigation
5. A shared top navigation exists across the main experience.
6. Navigation includes Overview, Resource Performance, Building Intelligence, Insights, and Data Transparency.
7. No primary left sidebar is introduced.

### Information architecture
8. Opening page is low-density and presentation-oriented.
9. Overview is executive-summary oriented and more information-dense.
10. Resource Performance is focused and analytical.
11. Overview presents utilities, weather, insights, transparency, and conceptual layer in structured modules.
12. Resource Performance structurally supports utility and period selection.

### Media-slot strategy
13. Semantic media slots are implemented or structurally defined.
14. Media-slot references are centralized.
15. The layout can accept image or video media later without structural refactoring.
16. Missing media does not break layout.
17. Important text remains outside media assets.

### Data honesty
18. Public utility data, current public weather, and conceptual data remain structurally distinguishable.
19. Building Intelligence remains clearly labeled conceptual where appropriate.
20. The architecture leaves visible room for timestamps and data-source disclosures.
21. Utility datasets updating independently can still be communicated clearly.

### Responsive behavior
22. Desktop layout is implemented coherently.
23. Tablet stacking/wrapping behavior is defined.
24. Mobile vertical reflow behavior is defined.

### Reuse and implementation health
25. Reusable layout primitives or equivalent reusable structures are introduced.
26. State containers can structurally display loading/success/partial/empty/error for major modules.
27. The stage does not introduce false operational/BMS complexity.
28. Existing Stage 2 and Stage 3 data behavior remains intact.
29. Tests, typecheck, lint, and build pass after implementation.
30. No Stage 5+ work is improperly bundled into Stage 4.

---

## 25. Definition of done

Stage 4 is done when:

- page hierarchy is implemented;
- top navigation is implemented;
- the three approved core pages are structurally represented;
- module boundaries are clear;
- media-slot architecture is in place;
- placeholders/fallback structure exists;
- responsive logic is defined and implemented at a structural level;
- data honesty remains explicit;
- Stage 2 and Stage 3 continue to work;
- implementation passes tests, typecheck, lint, and build;
- a review confirms the app structure aligns with the approved visual-reference direction.

Suggested future commit message:

```text
feat(ia): implement Stage 4 information architecture
```

---

## 26. Instructions for Codex

Before editing:

1. Read the PRD.
2. Read Stage 2, Stage 3, and this Stage 4 specification.
3. Review current implementation reality.
4. Review the approved reference images for:
   - Opening / Landing
   - Overview
   - Resource Performance
5. Inspect current routes/components structure.
6. Run baseline checks.
7. Produce a concise Stage 4 implementation plan.
8. Stop for approval.

During implementation:

- keep the stage structurally focused;
- preserve data honesty;
- introduce reusable page/layout structures;
- implement semantic media slots;
- keep image/video replacement easy;
- do not create false operational complexity;
- do not over-refine visual design prematurely.

After implementation:

- run tests, typecheck, lint, build;
- provide changed files;
- report route/page structure;
- report media-slot implementation;
- report responsive behavior;
- report any structural deviations from the spec;
- wait for approval before commit.

---

## 27. Approval

**Specification status:** Proposed for review  
**Implementation authorization:** Not yet granted  

Approval of this specification authorizes **Stage 4 Planning Mode only**.

Code changes require a separate explicit instruction after the Codex plan has been reviewed.
