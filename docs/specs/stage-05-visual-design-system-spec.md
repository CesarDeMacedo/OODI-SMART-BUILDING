# Oodi Smart Building Intelligence
## Stage 5 — Visual Design System Technical Specification

**Document type:** Stage Implementation Specification  
**Version:** 1.0  
**Status:** Implemented and approved  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 5 — Visual Design System  
**Implementation:** Complete  
**Validation:** Deployed and verified across multiple monitors and browsers  
**Primary implementation agent:** Codex  
**Primary reviewer:** Project owner  
**Date:** 2026-06-21  
**Closed:** 2026-06-23  

---

## 1. Purpose

This specification defines the technical and visual contract for **Stage 5 — Visual Design System** of the Oodi Smart Building Intelligence MVP.

Stage 4 established the page hierarchy, routing, reusable layout structure, responsive behavior, media-slot architecture, and data-honest module boundaries.

Stage 5 shall refine that structure into a coherent, reusable, premium visual system that is:

- consistent across Opening, Overview, Resource Performance, and the remaining page shells;
- aligned with the approved Stage 4 visual references;
- suitable for a Digital Advisory portfolio;
- technically honest about public utility data, current public weather, and conceptual information;
- accessible and readable;
- responsive;
- maintainable through design tokens and reusable component variants;
- restrained enough to avoid looking like a false operational BMS or control-room interface.

Stage 5 is not a complete Resource Performance implementation stage and must not absorb Stage 6 functionality.

---

## 2. Source-of-truth hierarchy

When sources differ, apply this order:

1. Approved PRD
2. Completed Stage 2 and Stage 3 implementation reality
3. Completed Stage 4 architecture and route structure
4. This Stage 5 specification
5. Approved Stage 4 visual references
6. Existing repository conventions

Stage 5 must not change completed data contracts merely to simplify styling.

---

## 3. Stage objective

At completion, the application shall have a reusable visual design system covering:

- typography;
- color palette;
- surface hierarchy;
- spacing and layout rhythm;
- radii and borders;
- shadows, backlighting, and depth;
- buttons and interactive controls;
- navigation treatments;
- cards;
- media treatments;
- data-classification badges;
- status treatments;
- chart visual language;
- overlays;
- attribution treatments;
- loading, partial, empty, error, cached, and conceptual states;
- responsive design behavior;
- reduced-motion and contrast considerations.

The design system should make Stage 6 implementation faster and reduce visual rework.

---

## 4. Approved visual direction

The approved direction is based on the three Stage 4 reference pages:

- `docs/references/stage-04/Introduction.png`
- `docs/references/stage-04/Overview.png`
- `docs/references/stage-04/RP_Energy.png`

These references define the preferred visual family:

- deep charcoal-blue and muted navy background;
- low-saturation cinematic atmosphere;
- refined blue-gray gradients;
- restrained red accent for active navigation;
- selective utility-specific accent colors;
- soft backlighting behind cards;
- subtle dimensional depth;
- glass-like but readable surfaces;
- architectural hero imagery;
- clean modern typography;
- generous spacing;
- minimal visual noise;
- premium portfolio presentation.

The references are design targets, not pixel-perfect requirements.

---

## 5. Core visual principles

### 5.1 Premium, not flashy

The UI should feel refined and modern.

Avoid:

- excessive neon;
- oversaturated electric blue;
- strong bloom around every card;
- arcade-like gradients;
- gaming-HUD styling;
- constant motion;
- dense control-room appearance.

### 5.2 Architectural hierarchy

Oodi imagery should remain a major visual anchor.

The interface should frame architecture and data together, rather than covering the building with excessive UI.

### 5.3 Data honesty through visual distinction

Measured public data, current public weather, cached data, and conceptual data must have distinct visual treatments.

### 5.4 Consistent but not uniform density

The design system must support:

- low-density Opening page;
- information-rich Overview;
- focused analytical Resource Performance page;
- honest structural shells for later pages.

### 5.5 Readability before decoration

All decorative effects must preserve:

- contrast;
- scanability;
- timestamp legibility;
- status clarity;
- responsive behavior.

---

## 6. Scope

### 6.1 Included

Stage 5 includes:

1. Design-token architecture
2. Global color system
3. Semantic color roles
4. Typography system
5. Spacing scale
6. Radius scale
7. Border system
8. Surface hierarchy
9. Shadow and backlight system
10. Shared page background treatment
11. Navigation visual treatment
12. Button variants
13. Tab and segmented-control variants
14. Card variants
15. Metric-card variants
16. Data-status badges
17. Data-classification badges
18. Disclosure treatments
19. Attribution treatment
20. Media-slot visual treatment
21. Image overlay treatment
22. Chart visual language
23. Loading skeleton style
24. Partial, empty, error, cached, and conceptual state styling
25. Focus, hover, selected, disabled states
26. Responsive design-system behavior
27. Basic reduced-motion support
28. Visual regression-oriented review assets if useful
29. Design-system documentation
30. Tests for important visual semantics where practical

### 6.2 Excluded

Stage 5 shall not implement:

- new utility calculations;
- new repository logic;
- new weather logic;
- final Stage 6 chart interactions;
- final utility comparison logic;
- final deterministic insights;
- final Building Intelligence interactions;
- final conceptual IoT dataset;
- production video assets;
- complex animation choreography;
- WebGL or 3D rendering;
- operational control functionality;
- final deployment packaging.

---

## 7. Design-token architecture

The implementation shall centralize visual values as semantic tokens.

A recommended structure:

```text
src/styles/
  tokens.css
  foundations.css
  components.css
  utilities.css
```

Equivalent organization is acceptable.

### 7.1 Token categories

Required token groups:

- background
- surface
- text
- border
- accent
- data classification
- utility category
- status
- spacing
- typography
- radius
- shadow
- backlight
- transition
- z-index

### 7.2 Token naming principle

Prefer semantic names such as:

```css
--color-bg-app
--color-bg-elevated
--color-surface-primary
--color-text-primary
--color-text-secondary
--color-border-subtle
--color-accent-active
--color-data-public
--color-data-weather
--color-data-conceptual
--color-status-success
--color-status-warning
--color-status-error
```

Avoid relying only on palette names such as `--blue-500` inside page components.

---

## 8. Color system

### 8.1 Base palette direction

The palette should be based on:

- deep charcoal-blue;
- muted navy;
- blue-gray;
- cool neutral text;
- subtle steel-blue highlights;
- restrained warm accents.

The app background should use layered gradients rather than a flat black surface.

### 8.2 Background layers

Recommended visual hierarchy:

1. **App background**  
   Deep navy/charcoal gradient.

2. **Ambient backlight layer**  
   Soft radial gradients positioned behind major groups of cards.

3. **Primary surface**  
   Dark blue-gray semi-opaque surface.

4. **Elevated surface**  
   Slightly lighter and more luminous than primary surface.

5. **Interactive selected surface**  
   Subtle accent edge and local glow.

### 8.3 Saturation rule

Accent saturation should be controlled.

The approved Opening reference is the target for overall saturation.

### 8.4 Utility accent roles

Utilities may use distinct accents:

- Electricity: warm gold / muted yellow
- Heat: warm orange / muted red-orange
- Water: cool blue
- District Cooling: cyan / icy blue

These accents should appear primarily in:

- icons;
- selected borders;
- chart lines;
- small highlights;
- badges.

They should not dominate large backgrounds.

### 8.5 Navigation accent

Active top navigation should use a restrained red or warm-red underline consistent with approved references.

### 8.6 Conceptual-data accent

Conceptual content should use muted violet/purple.

It must remain distinct from public and weather data.

---

## 9. Data-classification visual system

Required classifications:

### Public Utility Data
Suggested treatment:
- cool neutral or blue data badge;
- database/source icon where useful;
- label such as `Public Utility Data`.

### Current Public Weather
Suggested treatment:
- soft sky-blue badge;
- cloud/weather icon;
- `Current Public Weather` or equivalent honest language.

### Cached Public Data Snapshot
Suggested treatment:
- amber/neutral badge;
- explicit cached label;
- original source timestamp remains visible.

### Conceptual / Illustrative Data
Suggested treatment:
- violet/purple badge;
- permanent `Conceptual` or `Illustrative` label;
- never use green “live” language.

### Unavailable / Error
Suggested treatment:
- muted red;
- concise error label;
- local module treatment.

These classifications must not rely on color alone.

---

## 10. Typography

### 10.1 Font strategy

Use a modern system or repository-compatible sans-serif stack.

Do not add a paid or externally hosted font dependency unless specifically approved.

Recommended characteristics:

- clean;
- contemporary;
- high legibility;
- strong numeric rendering;
- professional;
- suitable for dashboards and architectural presentation.

### 10.2 Type scale

Define semantic roles:

- Display / hero title
- Page title
- Section title
- Card title
- Metric value
- Metric unit
- Body
- Supporting text
- Label
- Caption / timestamp
- Badge text

### 10.3 Numeric styling

Metrics should use:

- tabular numerals where available;
- clear separation between value and unit;
- restrained tracking;
- consistent decimal precision treatment.

### 10.4 Timestamp treatment

Timestamps are critical trust information and must remain readable.

Use a consistent caption style with sufficient contrast.

---

## 11. Spacing and layout rhythm

Create a consistent spacing scale, for example:

```text
4, 8, 12, 16, 24, 32, 48, 64
```

Equivalent scale is acceptable.

Apply the scale consistently to:

- page gutters;
- card padding;
- grid gaps;
- section spacing;
- label/value spacing;
- icon spacing.

The Opening page should use more negative space than Overview.

---

## 12. Surface hierarchy and card system

### 12.1 Card families

Required variants:

- Hero card
- Primary panel
- Secondary panel
- Utility summary card
- Metric card
- Insight card
- Transparency row/card
- Disclosure bar
- Placeholder/fallback card
- Conceptual module card

### 12.2 Card depth

Use soft dimensionality created through:

- subtle gradient;
- fine border highlight;
- restrained shadow;
- low-opacity backlight behind grouped cards.

Avoid thick glowing outlines.

### 12.3 Backlighting

Cards may have local ambient light behind them.

Rules:

- use selectively;
- keep blur soft;
- keep opacity low;
- do not reduce text contrast;
- use utility color only for selected or category-specific modules;
- preserve a neutral background around dense content.

### 12.4 Selected state

Selected cards should use:

- slightly stronger border;
- subtle local glow;
- selected badge or active marker;
- no large-scale pulsing animation.

---

## 13. Navigation design

The shared top navigation must visually support:

- brand area;
- independent-prototype badge;
- page links;
- active state;
- hover state;
- focus-visible state;
- compact responsive mode.

Active page treatment should use:

- restrained warm-red underline;
- stronger text contrast;
- no oversized filled tab.

---

## 14. Buttons and controls

Required variants:

- Primary CTA
- Secondary CTA
- Ghost/text action
- Utility selector
- Period selector
- Icon button
- Disabled button

### Primary CTA

Use a restrained steel-blue or muted blue fill.

### Secondary CTA

Use a subtle border or transparent surface.

### Utility selector

Use category color only in icon/highlight and selected state.

### Period selector

Use a compact segmented control or tab treatment.

Controls must have clear hover, active, focus, and disabled states.

---

## 15. Media-slot visual treatment

Stage 4 established semantic media slots.

Stage 5 shall define their visual treatment.

Required media presentation rules:

- consistent aspect ratio;
- rounded corners aligned with surface tokens;
- dark gradient overlays for text readability;
- optional vignette;
- predictable object-position behavior;
- poster treatment for videos;
- visible fallback style;
- optional overlay layer.

### 15.1 Opening hero

The media should dominate visually.

Text remains outside or overlaid with strong contrast and enough breathing room.

### 15.2 Overview hero

The image remains important but shares space with Building Context.

### 15.3 Resource Performance hero

The Oodi image remains prominent.

Analytical overlays must remain subtle and must not cover the building with multiple cards.

### 15.4 Future video behavior

The visual system should support:

- poster-first display;
- muted autoplay if later approved;
- reduced-motion fallback;
- readable overlay content;
- no required audio.

---

## 16. Architectural image strategy

Approved principles:

- cinematic Oodi imagery;
- blue-hour or dusk atmosphere;
- low-saturation treatment;
- warm interior lighting;
- cool exterior environment;
- image integrated with interface gradients;
- no excessive HUD layers;
- no false sensor-location precision.

The current Stage 4 screenshots are temporary runtime media.

Stage 5 may improve the way they are cropped and framed, but should not create final production media unless explicitly authorized.

---

## 17. Overlay design language

Resource Performance must support subtle system overlays.

For Electricity:

- warm gold energy path;
- thin line;
- small nodes;
- restrained glow;
- limited number of markers;
- optional utility icon;
- no floating chart card over the building.

Other utilities may later use distinct overlays.

The overlay is analytical visualization, not a real building-system map.

A visible disclosure must remain available.

---

## 18. Chart visual language

Stage 5 defines chart appearance, not the full Stage 6 chart feature set.

### 18.1 Chart foundations

Define:

- gridline style;
- axis typography;
- tooltip style;
- line width;
- area-fill opacity;
- selected point;
- peak marker;
- empty-state chart;
- partial-data notice placement;
- legend treatment.

### 18.2 Utility chart colors

- Electricity: warm gold
- Heat: orange
- Water: blue
- District Cooling: cyan

### 18.3 Chart restraint

Avoid:

- excessive gradients;
- multiple competing glows;
- animated particle effects;
- hard-to-read thin labels;
- decorative 3D charts.

### 18.4 Trust metadata

The chart container must visually preserve space for:

- source;
- source timestamp;
- requested period;
- effective period;
- granularity;
- fallback/partial status.

---

## 19. Status and state treatments

Required visual states:

### Loading
- subtle skeleton;
- no aggressive shimmer;
- preserve layout.

### Success
- normal content;
- optional small availability indicator.

### Partial
- amber or neutral notice;
- content remains available;
- explain reduced coverage.

### Empty
- local empty-state message;
- no fabricated graph.

### Error
- local error panel;
- concise action/retry if available;
- preserve rest of page.

### Memory cache
- visually neutral provenance badge;
- do not imply live data.

### Cached Public Data Snapshot
- explicit cached label;
- original source timestamp visible.

### Conceptual
- violet/purple;
- permanent illustrative label.

---

## 20. Attribution treatment

Attribution must be visible but not visually dominant.

Required sources include:

- Helsinki Nuuka Open API
- Open-Meteo
- architectural image credits where required

Attribution should appear:

- near relevant data;
- in Data Transparency;
- in media captions or methodology where required.

Do not hide attribution only in a footer.

---

## 21. Page-specific visual requirements

### 21.1 Opening / Landing

Target:
- cinematic;
- low-density;
- strong hero;
- three clear actions;
- minimal bottom summary band.

Must avoid:
- full dashboard density;
- multiple charts;
- excessive status cards.

### 21.2 Overview

Target:
- executive summary;
- structured density;
- visible hero;
- clear utility cards;
- dominant primary analysis panel;
- concise insights;
- transparency and conceptual modules.

Must preserve:
- clear section hierarchy;
- utility-specific timestamps;
- classification labels.

### 21.3 Resource Performance

Target:
- focused analytical experience;
- strong Oodi hero presence;
- subtle utility overlay;
- utility selector;
- period selector;
- chart and metrics;
- period/timestamp metadata.

Must avoid:
- many cards over the building image;
- excessive overlays;
- command-center appearance.

### 21.4 Remaining pages

Building Intelligence, Insights, and Data Transparency should receive consistent shell styling but remain structurally honest.

Do not fabricate final Stage 7 or Stage 8 capability.

---

## 22. Responsive visual behavior

### Desktop

- preserve approved widescreen composition;
- use layered card depth;
- maintain readable gutters;
- hero imagery remains prominent.

### Tablet

- reduce glow intensity;
- stack two-column areas;
- preserve navigation usability;
- maintain minimum card sizes.

### Mobile

- use single-column flow;
- reduce hero height;
- simplify ambient backlighting;
- keep text outside critical image areas;
- preserve badges and disclosures;
- avoid horizontal scrolling.

---

## 23. Accessibility and usability

Stage 5 must include:

- sufficient text contrast;
- focus-visible styling;
- non-color indicators for status;
- readable font sizes;
- touch-friendly controls;
- reduced-motion consideration;
- alt text preservation through MediaSlot;
- no essential information only in image overlays.

Where visual-reference style conflicts with readability, readability wins.

---

## 24. Motion guidance

Stage 5 may define minimal transition tokens.

Allowed:

- subtle hover transitions;
- soft card elevation;
- short tab/selection transitions;
- gentle media fade.

Not allowed in this stage:

- large animated backgrounds;
- auto-running chart animation;
- complex parallax;
- 3D camera movement;
- motion that hides state changes;
- video production.

---

## 25. Implementation constraints

- preserve Stage 2 and Stage 3 repositories;
- preserve Stage 4 route hierarchy;
- avoid new dependencies unless clearly justified;
- avoid rewriting page architecture;
- do not embed design values repeatedly in page components;
- do not replace honest labels with marketing language;
- do not imply real-time operational capability;
- do not begin Stage 6 analytical implementation.

---

## 26. Recommended implementation structure

Illustrative:

```text
src/
  styles/
    tokens.css
    foundations.css
    components.css

  components/
    design-system/
      Badge.tsx
      Button.tsx
      Card.tsx
      Metric.tsx
      StatusIndicator.tsx
      SegmentedControl.tsx
      Disclosure.tsx

  components/
    layout/
      AppShell.tsx
      TopNavigation.tsx
      MediaSlot.tsx

  components/
    charts/
      ChartFrame.tsx
      ChartLegend.tsx
      ChartTooltip.tsx
```

Equivalent structure is acceptable.

---

## 27. Testing expectations

Add or update tests where practical for:

- semantic badge variants;
- selected navigation state;
- utility selector state;
- period selector state;
- media fallback;
- conceptual label presence;
- source/attribution presence;
- loading/partial/empty/error variants;
- reduced-motion branch where testable;
- component class/variant output;
- responsive structure where practical.

Do not use brittle pixel-value unit tests.

Visual review may use browser screenshots under ignored review artifacts.

---

## 28. Validation commands

Required:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

Browser review should cover:

- Opening
- Overview
- Resource Performance
- Building Intelligence shell
- Insights shell
- Data Transparency shell
- desktop
- tablet
- mobile
- focus states
- media fallback
- state variants
- browser console

---

## 29. Acceptance criteria

### Foundations

1. Visual tokens are centralized.
2. Page components do not rely on widespread repeated hardcoded visual values.
3. Typography roles are defined.
4. Spacing, radius, border, shadow, and transition scales are defined.
5. App background uses the approved low-saturation dark gradient direction.

### Components

6. Shared card variants exist.
7. Shared button/control variants exist.
8. Shared badge/status variants exist.
9. Shared disclosure/attribution treatments exist.
10. Focus-visible states exist.
11. Loading, partial, empty, error, cached, and conceptual treatments exist.

### Data honesty

12. Public utility data has a distinct treatment.
13. Current public weather has a distinct treatment.
14. Cached data is not presented as live.
15. Conceptual data has a permanent distinct treatment.
16. Resource Performance overlay remains disclosed as analytical visualization.

### Pages

17. Opening page is visually refined and low-density.
18. Overview is visually refined and remains the executive summary.
19. Resource Performance is visually refined and focused.
20. Remaining page shells use the shared system without pretending to be complete.
21. Top navigation is consistent across pages.

### Media and charts

22. Media slots follow consistent framing and fallback treatments.
23. Resource Performance supports subtle energy overlay styling.
24. Chart visual language is defined.
25. Chart trust metadata remains readable.

### Responsive and accessibility

26. Desktop, tablet, and mobile remain usable.
27. No unintended horizontal overflow exists.
28. Contrast and focus states are acceptable.
29. Essential content is not embedded only in images.
30. Reduced-motion behavior is respected where applicable.

### Quality

31. Stage 2, Stage 3, and Stage 4 tests remain green.
32. Typecheck, lint, and build pass.
33. No Stage 6 functionality is improperly added.
34. No false operational/BMS behavior is introduced.

---

## 30. Definition of done

Stage 5 is complete when:

- the visual system is tokenized;
- the approved palette and low-saturation style are implemented;
- typography and spacing are coherent;
- cards and controls use shared variants;
- data classifications and states have consistent treatments;
- media and chart foundations are visually defined;
- Opening, Overview, and Resource Performance reflect the approved visual family;
- remaining pages use the system honestly;
- responsive and focus behavior are verified;
- tests, typecheck, lint, and build pass;
- no Stage 6 functionality has been started.

Suggested commit message:

```text
feat(design): implement Stage 5 visual design system
```

---

## 31. Instructions for Codex

Before editing:

1. Read the PRD.
2. Read Stage 4 and this Stage 5 specification.
3. Review the approved Stage 4 visual references.
4. Inspect current Stage 4 component and CSS structure.
5. Run baseline checks.
6. Produce a concise implementation plan.
7. Stop for approval.

During implementation:

- centralize tokens;
- preserve route and data architecture;
- refine visual language without expanding scope;
- use approved references as direction, not page screenshots to copy pixel-for-pixel;
- keep data honesty visible;
- keep images/videos replaceable through media slots;
- avoid excessive glow and saturation.

After implementation:

- run full validation;
- perform browser review;
- provide changed files and visual-system summary;
- wait for approval before commit.

---

## 32. Approval

**Specification status:** Proposed for review  
**Implementation authorization:** Not yet granted  

Approval of this specification authorizes **Stage 5 Planning Mode only**.

Code changes require a separate explicit instruction after the plan is reviewed.
