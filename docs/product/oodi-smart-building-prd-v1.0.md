# Oodi Smart Building Intelligence

## MVP Product Requirements Document

**Document type:** MVP Product Requirements Document  
**Version:** 1.0  
**Status:** Approved for staged implementation  
**Project type:** Self-initiated portfolio prototype  
**Primary audience:** WSP Digital Advisory and Property & Buildings professionals  
**Implementation status:** Data discovery completed. Stage 2 — Data Foundation approved.

---

## 1. Executive Summary

Oodi Smart Building Intelligence is a browser-based interactive experience centred on Helsinki Central Library Oodi.

The application will combine:

1. verified public utility-consumption data from the Helsinki Nuuka Open API;
2. current public weather information from a selected weather provider;
3. verified architectural and building context from authoritative sources;
4. a clearly identified conceptual IoT layer demonstrating how additional operational information could be communicated in a smart-building experience.

The product is not intended to be an operational digital twin, building-management system or official Oodi application.

It is a technically honest digital experience prototype demonstrating how public building data, environmental context and spatial storytelling can be transformed into an accessible client-facing interface.

The project will support Cesar De Macedo’s positioning as a digital experience and real-time visualization specialist who can complement advisory, engineering, BIM, building-performance and digital-delivery teams.

---

## 2. Product Vision

### Vision statement

Create a polished, credible and transparent smart-building experience that helps technical and non-technical stakeholders understand how a prominent public building consumes resources and how building information could be communicated through a digital advisory interface.

### Product proposition

> A browser-based smart-building experience combining real public energy data, current weather context and a clearly identified conceptual IoT layer.

### Portfolio proposition

The project should demonstrate the ability to:

- connect to real public APIs;
- normalize and communicate building-performance data;
- design executive-level digital experiences;
- translate technical information into understandable visual narratives;
- integrate architectural context with data visualization;
- prototype smart-building and digital-twin-inspired experiences;
- use AI-assisted development responsibly;
- preserve data provenance and avoid misleading operational claims.

---

## 3. Strategic Context

The project is intended for presentation to professionals working across:

- Digital Advisory;
- Property & Buildings;
- smart buildings;
- asset management;
- building performance;
- BIM and digital delivery;
- data visualization;
- digital twins;
- sustainability;
- stakeholder and client communication.

The project should align conceptually with advisory work involving digital, sustainable and people-centred places.

It should show how smart-building data can support:

- clearer stakeholder understanding;
- operational awareness;
- sustainability communication;
- executive reporting;
- building-performance discussions;
- client-facing decision support;
- future digital-twin planning.

The product must not suggest that Cesar is independently providing engineering analysis, certified energy consulting or operational building controls.

---

## 4. Product Integrity Statement

Oodi Smart Building Intelligence is:

- a working interactive prototype;
- a portfolio project;
- an independent concept study;
- based partly on verified public data;
- supported by current public weather information;
- enhanced with clearly marked simulated operational indicators.

Oodi Smart Building Intelligence is not:

- an official Oodi application;
- an official City of Helsinki application;
- a Nuuka product;
- a WSP product;
- a building-management system;
- an operational digital twin;
- a real-time representation of Oodi’s private systems;
- a source of engineering or facilities-management instructions.

The interface must include a visible project disclaimer.

### Recommended disclaimer

> Independent portfolio prototype. Not affiliated with Oodi, the City of Helsinki, Nuuka or WSP. Public utility data is retrieved from the Helsinki Nuuka Open API. Current weather information comes from a public weather provider. Operational and IoT indicators are simulated and are not connected to Oodi’s building systems.

---

## 5. Building Subject

### Public name

Helsinki Central Library Oodi

### Nuuka property name

4669 Oodi Helsingin keskustakirjasto

### Property code

091-002-0014-0005

### Building code

103534449X

### Address

Töölönlahdenkatu 4, Helsinki, Finland

### Purpose of use

G kirjasto

### Nuuka building type

LibraryMuseumExhibitionHall

### Year of introduction

2018

### Nuuka property attributes

- Nuuka property-level total area: 39,817 m²
- Nuuka heated area: 14,643 m²
- Nuuka property volume: 108,260 m³
- Property coordinates: approximately 60.1738, 24.9381
- Associated-building coordinates: approximately 60.17424, 24.93803

These values originate from the Nuuka property record and must be treated as property-level dataset attributes.

They must not automatically be presented as definitive architectural measurements of the publicly accessible Oodi building.

The application must not interpret the difference between total area and heated area unless that interpretation is supported by an authoritative architectural or municipal source.

---

## 6. Why Oodi

Oodi is appropriate for the prototype because it is:

- a prominent contemporary public building;
- architecturally distinctive;
- highly people-centred;
- publicly accessible;
- associated with energy-efficient design;
- composed of multiple functional environments;
- suitable for spatial and systems-based storytelling;
- supported by publicly accessible utility data;
- relevant to Property & Buildings and Digital Advisory discussions.

Its three-floor architectural concept also provides a strong framework for a future spatial intelligence demonstration:

- ground floor: active and fast-moving public environment;
- second floor: work, learning, activities and interaction;
- third floor: quieter reading and relaxation environment.

This floor-based structure may inform the conceptual IoT visualization, but no simulated floor-level values may be presented as measured Oodi data.

---

## 7. Problem Statement

Public building-consumption datasets are often technically accessible but difficult for non-specialists to interpret.

Raw API responses do not readily communicate:

- what is happening in the building;
- how recently the information was updated;
- whether values are hourly, daily or monthly;
- how electricity, heat, cooling and water differ;
- how weather may relate to consumption;
- which information is measured and which is illustrative;
- what operational conclusions can or cannot be made.

The product should transform this fragmented information into a clear, visually engaging and trustworthy experience without overstating the precision or operational meaning of the data.

---

## 8. Product Goals

### Primary goals

1. Integrate and display verified Nuuka data for Oodi.
2. Show current Helsinki weather and relevant forecast context, including the source observation or model timestamp.
3. Clearly distinguish real, current, delayed, cached and simulated information.
4. Provide understandable short-, medium- and long-term consumption views.
5. Produce an executive-quality digital experience suitable for a professional portfolio.
6. Demonstrate how spatial visualization could complement building data.
7. Generate strong screenshots and a short interactive demonstration.

### Secondary goals

- demonstrate frontend data integration;
- demonstrate loading, error, empty and cached-fallback state design;
- communicate data provenance directly in the interface;
- provide automatically calculated, rule-based observations;
- establish a foundation for future spatial or 3D development.

### Non-goals

The MVP will not attempt to:

- optimize Oodi’s operations;
- diagnose equipment;
- calculate official energy performance;
- prove causal relationships between weather and consumption;
- predict utility usage;
- control building systems;
- monitor individual occupants;
- replace a BMS, IWMS, CMMS or digital-twin platform.

---

## 9. Target Users

### Primary persona: Digital Advisory leader

Needs to quickly understand:

- the product idea;
- the data sources;
- the technical credibility;
- the decision-support potential;
- the distinction between prototype and operational system;
- Cesar’s contribution to a multidisciplinary project.

### Secondary persona: Property and Buildings professional

Needs to explore:

- utility trends;
- latest available readings;
- periods of elevated or reduced consumption;
- weather context;
- data quality and update dates.

### Secondary persona: Client or executive stakeholder

Needs:

- plain-language summaries;
- strong visual hierarchy;
- minimal technical friction;
- clear explanations;
- confidence in the source and limitations of the data.

### Secondary persona: BIM or digital-delivery professional

Needs to understand:

- how data could be connected to building context;
- how the spatial layer differs from the verified utility layer;
- how the prototype could evolve without being mistaken for a production digital twin.

---

## 10. Data Classification Model

Every displayed metric must belong to one of the following visible classes.

### Class A — Real Public Building Data

Source: Helsinki Nuuka Open API.

Includes:

- electricity;
- heat;
- water;
- district cooling;
- historical utility trends;
- latest available utility readings.

Required visual label:

**Public Building Data**

Alternative compact label:

**Nuuka Public Data**

### Class B — Current Public Weather Data

Source: selected public weather API.

May include:

- current outdoor temperature;
- apparent temperature;
- relative humidity;
- wind speed;
- precipitation;
- current conditions;
- short forecast;
- heating or cooling context.

Required primary visual label:

**Current Weather**

Required classification label:

**Current Public Weather Data**

The term **Live Weather** may only be used if the selected provider returns a sufficiently recent observation with a reliable observation timestamp.

The interface must always display the weather observation or model timestamp.

Weather data that is forecast, modelled or delayed must be described accordingly.

### Class C — Conceptual IoT Data

Source: locally generated simulation or static prototype configuration.

May include:

- illustrative occupancy;
- indoor temperature;
- CO₂;
- indoor air quality;
- HVAC operating state;
- asset status;
- comfort indicator;
- illustrative zone conditions.

Required visual label:

**Conceptual IoT Layer**

Supporting description:

> Simulated indicators for experience-prototyping purposes. Not connected to Oodi’s operational systems.

Conceptual data must never be visually indistinguishable from measured public data.

### Class D — Cached Public Data Snapshot

Source: previously retrieved authentic Nuuka API responses retained for demonstration resilience.

Required visual label:

**Cached Public Data Snapshot**

Supporting description:

> The public data service is currently unavailable. This view uses a previously retrieved Nuuka dataset and displays its original source timestamps.

Cached public data must:

- preserve the original utility values;
- preserve original source timestamps;
- preserve source metadata, unit and granularity;
- remain clearly distinct from current API responses;
- remain clearly separate from conceptual IoT data;
- never be described as current, live, newly updated or real-time.

---

## 11. Verified Nuuka Data Scope

The following reporting groups are confirmed:

| Reporting group | Product label | Unit |
|---|---|---:|
| Electricity | Electricity | kWh |
| Heat | Heat | kWh |
| Water | Water | m³ |
| DistrictCooling | District Cooling | kWh |

`DistrictCooling` is the exact Nuuka reporting-group value and must be used in API requests.

The application may display the user-facing title “District Cooling.”

`OtherMeasurements` is listed on the property but is not included in the MVP because useful and verified measurement content has not yet been established.

---

## 12. Data Availability Constraints

The utilities do not share a single common latest timestamp.

At discovery time:

- electricity hourly and daily data required a fallback window around its latest monthly data;
- electricity data was older than the newest water data;
- heat and district-cooling data ended at a different date;
- water contained the most recent records;
- monthly historical electricity data extended back to approximately the end of 2018.

Therefore, the application must not show a single global “building data updated” timestamp as though it applied equally to every utility.

Every utility must show its own:

- latest available timestamp;
- requested time window;
- effective returned time window;
- granularity;
- aggregation period where applicable;
- unit;
- source;
- data status;
- cache or snapshot status where applicable.

A global summary may say:

> Utility datasets update independently. See each metric for its latest available reading.

---

## 13. Time-Window Strategy

The MVP will expose three principal user-facing views.

### 13.1 Operational View

**User-facing label:** 24 Hours  
**Preferred source:** Hourly Nuuka data  
**Purpose:** Show recent variation and intra-day consumption patterns.

#### Required behaviour

1. Request the most recent practical period.
2. Determine the latest timestamp actually returned.
3. Display the latest 24 data hours ending at or before that timestamp.
4. Do not require those hours to correspond to the current date.
5. Clearly display the actual date range.

Example:

> Latest 24 available hours · May 16–17, 2026

The UI must not describe older hourly data as “today.”

### 13.2 Trend View

**User-facing label:** 30 Days  
**Preferred source:** Daily Nuuka data  
**Purpose:** Show recent trends, peaks, lows and period comparisons.

#### Required behaviour

- use the latest 30 available daily records when possible;
- display the actual date interval;
- allow partial datasets;
- avoid inventing missing days;
- visually indicate meaningful data gaps.

### 13.3 Historical View

**User-facing label:** 12 Months  
**Preferred source:** Monthly Nuuka data  
**Purpose:** Show seasonality and executive-level context.

#### Required behaviour

- use the latest 12 available monthly records;
- display fewer months when 12 are unavailable;
- clearly show month labels and actual values;
- do not interpolate absent months without a visible methodological explanation.

---

## 14. Fallback Strategy

Fallbacks must retrieve real data rather than fabricate values.

### Required fallback hierarchy

For each utility and requested granularity:

1. request the target calendar window;
2. inspect whether valid records were returned;
3. when empty, query monthly history to identify the most recent available period;
4. request the same target granularity around that period;
5. return the most recent available records;
6. clearly communicate the effective period to the user;
7. only after a current request fails for technical reasons, permit use of the authentic cached demonstration snapshot defined in FR-19.

### Fallback status language

Preferred:

- Latest available period
- Recent data unavailable
- Showing most recent available records
- Data delayed at source
- Partial period
- No records returned for this period
- Cached Public Data Snapshot

Avoid:

- Live energy
- Current building load
- Real-time electricity
- Today’s consumption

unless the returned timestamp genuinely supports the claim.

---

## 15. Proposed Information Architecture

The MVP will use a focused single-building experience with five principal sections.

### 15.1 Overview

Purpose: establish the building, current context and trust model.

Content:

- Oodi identity;
- architectural hero image or approved visualization;
- location;
- concise building description;
- current Helsinki weather with observation or model timestamp;
- high-level utility summary;
- individual utility freshness indicators;
- visible real-versus-cached-versus-conceptual legend;
- navigation to deeper sections.

### 15.2 Resource Performance

Purpose: explore measured public utility data.

Content:

- Electricity;
- Heat;
- District Cooling;
- Water;
- 24-hour, 30-day and 12-month controls;
- time-series visualization;
- totals and averages;
- peak value;
- latest available reading;
- comparison with preceding equivalent period where sufficient data exists;
- data-source and timestamp details.

This section replaces separate Energy and Water pages in the initial MVP to keep navigation focused.

### 15.3 Building Intelligence

Purpose: demonstrate spatial and operational communication possibilities.

Content:

- simplified visual representation of Oodi;
- its three distinct floors or functional environments;
- selectable conceptual zones;
- simulated occupancy or comfort indicators;
- conceptual system-status overlays;
- prominent “Conceptual IoT Layer” label;
- explanatory text separating the spatial prototype from Nuuka data.

### 15.4 Insights

Purpose: translate data into understandable observations.

Content:

- rule-based observations;
- peak and low periods;
- period-over-period change;
- heat and cooling context;
- weather-aligned observations;
- data-quality notes;
- plain-language explanations.

Insights must describe correlation or context, not unsupported causation.

### 15.5 Data Transparency

Purpose: explain sources, limitations and methodology.

Content:

- Nuuka Open API;
- weather provider;
- property identifiers;
- utilities and units;
- per-utility latest timestamps;
- requested versus effective periods;
- data-classification legend;
- fallback methodology;
- cached-snapshot status and original source timestamps;
- conceptual-IoT disclaimer;
- project independence disclaimer;
- image credits and attribution where required;
- links to authoritative public references.

---

## 16. Core User Journey

### Primary journey

1. User opens the application.
2. User immediately understands that the project concerns Oodi.
3. User sees current Helsinki weather with its observation or model timestamp.
4. User sees summary indicators for four utilities.
5. User notices that each utility has its own update status and explicit granularity or aggregation period.
6. User selects a utility.
7. User switches between 24-hour, 30-day and 12-month views.
8. User receives clear information about the actual displayed period.
9. User reviews automatically calculated observations.
10. User enters Building Intelligence.
11. User understands that the operational indicators are simulated.
12. User opens Data Transparency and verifies the methodology and sources.
13. If the Nuuka API is unavailable, the user sees a clearly labelled Cached Public Data Snapshot with original source timestamps.

### Desired final impression

> This is a thoughtfully designed, technically credible digital advisory prototype that communicates building data clearly without pretending to be an operational system.

---

## 17. Functional Requirements

### FR-01 — Property configuration

The application must use a centralized Oodi property configuration containing:

- public building name;
- exact Nuuka location name;
- property code;
- building code;
- coordinates;
- address;
- supported reporting groups;
- source URLs;
- disclaimer text.

No identifiers should be duplicated across unrelated components.

### FR-02 — Nuuka API integration

The application must retrieve data directly from the Nuuka Open API.

Requirements:

- no API key;
- no secrets in the client;
- configurable request timeout;
- valid URL encoding;
- support for hourly, daily and monthly endpoints;
- support for all four included reporting groups;
- validation of HTTP status;
- validation of response shape;
- handling of empty responses;
- cancellation or protection against stale requests.

### FR-03 — Data normalization

All utility responses must be converted into a shared internal structure.

Suggested structure:

```ts
type UtilityType =
  | "electricity"
  | "heat"
  | "water"
  | "districtCooling";

type DataGranularity =
  | "hourly"
  | "daily"
  | "monthly";

interface UtilityDataPoint {
  timestamp: string;
  value: number;
}

interface UtilitySeries {
  utility: UtilityType;
  reportingGroup: string;
  unit: "kWh" | "m³";
  granularity: DataGranularity;
  aggregationLabel: string;
  requestedStart: string;
  requestedEnd: string;
  effectiveStart: string | null;
  effectiveEnd: string | null;
  latestTimestamp: string | null;
  dataPoints: UtilityDataPoint[];
  source: "Nuuka Open API";
  isFallback: boolean;
  isCachedSnapshot: boolean;
  status: "success" | "partial" | "empty" | "error" | "cached";
  statusMessage?: string;
}
```

The final types may change during Stage 2 technical planning, but the separation of requested and effective periods, explicit granularity and source status is mandatory.

### FR-04 — Latest-reading logic

Each utility must calculate its latest valid reading independently.

The application must not assume that:

- the API array is sorted;
- the last array item is the newest;
- all utilities end on the same date.

### FR-05 — Time-window controls

Users must be able to choose:

- 24 Hours;
- 30 Days;
- 12 Months.

The selected control must map to:

- hourly;
- daily;
- monthly;

respectively.

Unsupported or incomplete views must remain available only when the interface can explain the fallback or partial result.

### FR-06 — Utility summary

The Overview must show four utility summary metrics.

Each summary must include:

- utility name;
- value;
- explicit measurement period or granularity;
- unit;
- latest source timestamp;
- freshness or availability state;
- cached-snapshot state where applicable;
- access to the detailed utility view.

Each summary value must explicitly identify whether it represents:

- a latest hourly value;
- a latest daily total;
- a latest monthly total;
- or another clearly defined aggregation.

The interface must never display an isolated value without identifying what period or measurement interval it represents.

Avoid:

> Electricity — 143 kWh

Prefer:

> Latest hourly electricity value — 143 kWh  
> May 17, 2026 · 02:00

or:

> Latest daily electricity total — 3,420 kWh  
> May 17, 2026

The initial Overview should use the most recent clearly interpretable summary available for each utility.

Different granularities may be used across utilities only when each card states its granularity clearly.

Period totals, averages and comparisons should remain available in the detailed Resource Performance view.

### FR-07 — Charts

Charts must support:

- line or area time series;
- readable axes;
- unit labels;
- tooltips;
- empty-state replacement;
- partial-period messaging;
- responsive resizing;
- accessible data summaries.

Charts must not imply continuous data across large gaps.

### FR-08 — Weather integration

The application must retrieve current public weather information for Oodi’s location.

Minimum weather fields:

- observation or model timestamp;
- temperature;
- apparent temperature when available;
- relative humidity;
- wind speed;
- precipitation or condition;
- short forecast or next-period context.

The weather provider must:

- permit browser use;
- provide clear timestamps;
- have acceptable usage limits;
- require no exposed secret, or be used through an appropriate secure approach;
- provide clear licensing or attribution requirements.

Open-Meteo should be evaluated first because it can support a lightweight public portfolio prototype without unnecessary backend infrastructure.

Final provider selection belongs to the weather-integration technical task.

The interface should use **Current Weather** as its default user-facing label.

The label **Live Weather** may only be introduced after confirming that the provider supplies sufficiently recent observations with reliable timestamps.

FR-08 is not included in Stage 2.

### FR-09 — Weather and utility context

The application may display contextual statements such as:

- Lower outdoor temperatures coincide with higher heat consumption in the displayed period.
- District cooling was highest during the warmest portion of the selected period.
- The available utility data predates current weather conditions.

Statements must be based on actual timestamps.

Current weather must not be directly compared with old utility data as though both were simultaneous.

The interface must not use the word “current” for a comparison that combines present-day weather with older utility records.

When timestamps do not align, the application should communicate them separately.

Example:

> Current outdoor temperature: 18°C  
> Latest available heat dataset: May 20–31, 2026

FR-09 is not included in Stage 2.

### FR-10 — Conceptual IoT layer

The Building Intelligence section must include at least one polished interactive experience.

Recommended MVP concept:

- simplified three-level Oodi representation;
- selectable floor or functional layer;
- simulated occupancy;
- simulated comfort status;
- simulated indoor environment indicator;
- conceptual HVAC or system status;
- contextual explanation panel.

Every conceptual metric must include visual and textual identification as simulated.

FR-10 is not included in Stage 2.

### FR-11 — Insights engine

The MVP insights engine must use deterministic calculations rather than generative AI.

Supported observations may include:

- highest value in period;
- lowest value in period;
- average value;
- total consumption;
- change from previous comparable period;
- weekday versus weekend comparison where timestamps permit;
- heat/cooling relationship with historical weather where aligned data exists;
- data delay or gap;
- partial-period warning.

An insight must not be generated when the data is insufficient.

FR-11 is not included in Stage 2.

### FR-12 — Data transparency drawer or page

Users must be able to inspect:

- data class;
- source;
- requested period;
- actual returned period;
- granularity;
- aggregation period;
- unit;
- latest timestamp;
- fallback state;
- cached-snapshot state;
- API or source reference;
- methodological notes.

### FR-13 — Loading state

Each data module must show a localized loading state.

The complete page should not become unusable while one utility loads.

### FR-14 — Error state

Errors must distinguish between:

- network failure;
- API response error;
- parsing error;
- empty dataset;
- timeout;
- weather failure;
- unavailable conceptual asset.

The interface must provide a retry action where appropriate.

### FR-15 — Empty and partial states

Empty data must produce explanatory UI rather than a zero value.

Zero must only be shown when zero is an actual returned measurement.

### FR-16 — Responsive behaviour

The MVP must support:

- desktop portfolio presentation;
- laptop;
- tablet;
- mobile review.

Desktop is the primary presentation format.

The experience should remain understandable on mobile, although complex spatial interaction may simplify to a vertical floor selector.

### FR-17 — Source links

The Data Transparency section should provide external references for:

- official Oodi information;
- Oodi architecture;
- Nuuka API;
- Helsinki public-building energy dataset;
- selected weather provider;
- ALA Architects’ Oodi project reference.

WSP links may be documented in the project case study but should not make the interface appear to be endorsed by or produced for WSP.

### FR-18 — API response caching

Successfully retrieved Nuuka and weather API responses should be cached in memory for the current application session.

The application should reuse a valid cached response when:

- the user returns to a previously viewed section;
- the user reselects the same utility and period;
- an identical request has already completed successfully;
- a duplicate request is already in progress.

The caching strategy must:

- prevent unnecessary repeated calls;
- preserve source timestamps;
- distinguish data by utility, granularity and requested date range;
- deduplicate identical in-flight requests;
- allow manual refresh where appropriate;
- avoid presenting stale data as newly retrieved.

Optional short-lived browser storage caching may be evaluated during technical planning.

No database is required for the MVP.

Only the Nuuka portion of FR-18 is included in Stage 2. Weather caching is deferred until weather integration.

### FR-19 — Resilient demonstration mode

The application may include a clearly labelled demonstration fallback created from previously retrieved, authentic Nuuka API responses.

This fallback may be used when:

- the public API is unavailable;
- a network request times out;
- browser connectivity is unavailable during a presentation;
- the API returns an unexpected temporary failure.

The fallback must:

- contain only data previously retrieved from the public Nuuka API;
- preserve the original values and source timestamps;
- preserve the original endpoint, utility, unit and granularity;
- identify when the snapshot was captured;
- preserve the requested period and effective returned period;
- remain visually distinct from a successful current API response;
- never replace a valid API response silently;
- remain technically and visually separate from conceptual IoT data.

Required label:

**Cached Public Data Snapshot**

Supporting message:

> The public data service is currently unavailable. This view uses a previously retrieved Nuuka dataset and displays its original source timestamps.

The demonstration snapshot must not be described as:

- current;
- live;
- newly updated;
- real-time.

Conceptual IoT values must not be used as a fallback for missing public utility data.

The snapshot should be refreshed intentionally during development or portfolio preparation rather than generated automatically on every page load.

#### Recommended Stage 2 snapshot structure

```text
data/demo-snapshots/
  electricity-hourly.json
  electricity-daily.json
  heat-daily.json
  water-daily.json
  district-cooling-daily.json
  snapshot-metadata.json
```

The metadata should preserve:

- snapshot capture date;
- endpoint;
- utility;
- granularity;
- requested period;
- effective returned period;
- latest original source timestamp;
- unit;
- Nuuka source identification.

This structure is a recommendation for Stage 2 and must not be treated as an immutable implementation detail if technical review identifies a better typed structure.

### FR-20 — Architectural image rights and attribution

All architectural images used in the application or portfolio presentation must be:

- original work created for the project;
- properly licensed;
- generated specifically for the concept study;
- sourced from an asset library with appropriate usage rights;
- or used with explicit and appropriate attribution where permitted.

Official Oodi, architect, contractor or municipal project imagery must not be redistributed without confirming its usage rights.

The application must not assume that publicly accessible website images are automatically available for reuse.

Where attribution is required, it should be included in:

- the Data Transparency section;
- an image caption;
- the project credits;
- or the portfolio case study.

Screenshots of the completed application may be used in Cesar De Macedo’s portfolio, provided that all embedded assets also meet their respective licensing requirements.

AI-generated or independently created architectural concept images should not be presented as documentary photographs of actual Oodi conditions.

---

## 18. Content Requirements

### Building-description tone

The content should describe Oodi as:

- a public meeting place;
- a central library;
- a contemporary civic building;
- a building with three distinct functional levels;
- an energy-efficient architectural project.

Avoid unsupported superlatives and promotional language.

### Data language

Preferred terms:

- Public Building Data
- Nuuka Public Data
- Latest available reading
- Most recent available period
- Data updated independently
- Current Weather
- Current Public Weather Data
- Weather observation time
- Weather model timestamp
- Forecast conditions
- Latest weather update
- Conceptual IoT Layer
- Simulated operational indicator
- Illustrative sensor data
- Cached Public Data Snapshot
- Partial period
- Source delay

Restricted terms:

- Live Weather
- live energy
- real-time BMS
- real occupancy
- actual indoor air quality
- predictive maintenance alert
- digital twin of Oodi
- operational command centre

“Live Weather” may only be used after the selected weather provider and timestamp behaviour have been technically verified.

“Digital twin-inspired” may be used in descriptive portfolio content, but the app should primarily call itself a smart-building experience or interactive prototype.

---

## 19. UX Principles

### 19.1 Trust before spectacle

Source, timestamp, granularity and data type must be apparent without requiring technical investigation.

### 19.2 Architecture plus data

The building should not be reduced to a generic collection of dashboard cards.

Architectural identity must provide context and visual hierarchy.

### 19.3 Progressive disclosure

The initial screen should communicate the essential story quickly.

Detailed methodology should be available without dominating the experience.

### 19.4 Independent freshness

Every utility must communicate its own recency.

### 19.5 No false precision

Do not display excessive decimal places.

Recommended formatting:

- kWh: whole values or one decimal depending on scale;
- m³: up to two decimals when useful;
- percentages: whole percentage or one decimal;
- temperatures: one decimal;
- comparison change: one decimal.

### 19.6 Explain gaps

Missing information must be explained rather than hidden.

### 19.7 Executive readability

A viewer should understand the product’s purpose and principal findings within approximately one minute.

### 19.8 Visible fallback status

Cached public data must never appear identical to a successful current API response.

---

## 20. Visual Direction

### Desired qualities

- sophisticated;
- architectural;
- calm;
- contemporary;
- technical;
- premium;
- credible;
- human-centred;
- suitable for an advisory presentation.

### Recommended visual approach

- large architectural hero area;
- restrained neutral palette;
- warm timber-inspired accent;
- subtle Helsinki sky or cool environmental tones;
- clear typography;
- thin data lines and precise labels;
- generous spacing;
- limited card use;
- contextual overlays rather than dense dashboard grids;
- clear badges for data classification.

### Avoid

- generic admin-dashboard layout;
- excessive small cards;
- neon science-fiction styling;
- holographic effects;
- fake control-room visuals;
- animated data without meaning;
- unsupported system schematics;
- red alerts implying actual building faults;
- official Oodi, City of Helsinki or WSP brand imitation.

---

## 21. Conceptual Screen Structure

### Screen 1 — Opening Overview

- architectural image or visualization;
- title and subtitle;
- building identity;
- current Helsinki weather with observation or model timestamp;
- four utility status summaries with explicit granularity or aggregation period;
- data classification legend;
- cached snapshot status when applicable;
- “Explore building performance” action.

### Screen 2 — Resource Performance

- utility selector;
- period selector;
- primary time-series chart;
- total, average, peak and latest reading;
- period comparison;
- actual data range;
- utility-specific update state;
- contextual insight.

### Screen 3 — Building Intelligence

- simplified building representation;
- floor selector;
- conceptual indicators;
- systems or environmental overlay;
- explanatory detail panel;
- permanent simulated-data label.

### Screen 4 — Insights

- key calculated observations;
- utility comparison;
- weather context;
- data-quality observation;
- plain-language methodology.

### Screen 5 — Data Transparency

- source overview;
- data type legend;
- utility metadata;
- latest timestamps;
- fallback explanation;
- cached snapshot metadata;
- project disclaimer;
- image attribution and credits;
- external references.

The final UX may implement these as scroll sections, routed screens or a hybrid experience. This decision belongs to the information-architecture stage.

---

## 22. Non-Functional Requirements

### Performance

- initial shell should render quickly;
- data requests should run in parallel where appropriate;
- architectural media must be optimized;
- charts should remain responsive;
- no unnecessary 3D engine should be introduced into the MVP;
- target a strong Lighthouse result without compromising the visual experience;
- successfully retrieved responses should be cached for the current session;
- duplicate requests should be deduplicated;
- changing sections should not automatically repeat identical API calls;
- manual refresh should be available where appropriate;
- the application should remain demonstrable using an authentic cached public-data snapshot when the external API is temporarily unavailable.

### Accessibility

- semantic page structure;
- keyboard-accessible controls;
- visible focus states;
- sufficient text contrast;
- non-colour indicators for data classification;
- chart summaries available as text;
- respect reduced-motion preferences;
- descriptive alternative text for architectural imagery.

### Reliability

- one API failure must not collapse the entire application;
- loading and error states must be isolated by source;
- unexpected response fields must fail safely;
- date parsing must be timezone-aware;
- values must be validated as finite numbers;
- a clearly identified cached public-data snapshot may be used as a demonstration fallback;
- cached snapshots must preserve original timestamps and source metadata;
- fallback activation must be visible to the user;
- cached public data and conceptual IoT data must remain separate;
- a cached snapshot must never silently override a valid API response.

### Security

- no secrets in source code;
- no authentication in MVP;
- no user personal data;
- no storage of sensitive data;
- no production database;
- external links should follow safe browser behaviour.

### Maintainability

- centralized source configuration;
- typed API adapters;
- reusable chart and status components;
- separation between data retrieval and presentation;
- separate real, cached and simulated data modules;
- documented fallback logic;
- automated formatting, lint and type checks.

### Intellectual property and attribution

- architectural assets must have documented usage rights;
- required credits must be visible or accessible;
- official website imagery must not be treated as reusable merely because it is publicly accessible;
- generated concept imagery must be identified when it could otherwise be mistaken for documentary photography;
- portfolio screenshots are permitted only when all embedded assets meet their licensing or attribution requirements.

---

## 23. Technical Direction

### Existing stack

- Vite;
- React;
- TypeScript.

### Recommended supporting categories

- lightweight chart library;
- date utility with timezone support;
- schema validation for external responses;
- native fetch or a small request abstraction;
- CSS system already established in the project;
- local JSON or TypeScript configuration for conceptual IoT data.

Specific dependencies should be selected only during the corresponding implementation stage.

### Architecture principles

```text
External APIs
├── Nuuka public API
└── Weather API

Data adapters
├── Nuuka client
├── Weather client
├── Response validation
├── Normalization
├── Fallback resolution
├── Session cache
└── Demo snapshot loader

Application domain
├── Utility series
├── Weather context
├── Insights
├── Data provenance
├── Cached public snapshot metadata
└── Conceptual IoT model

Experience layer
├── Overview
├── Resource Performance
├── Building Intelligence
├── Insights
└── Data Transparency
```

The conceptual IoT module must never import, reuse or masquerade as a Nuuka response or cached public snapshot.

---

## 24. Timezone and Date Handling

Oodi is located in Helsinki.

The application must:

- interpret and display building data in Helsinki local time where appropriate;
- account for daylight-saving transitions;
- preserve source timestamps;
- avoid silently treating local API timestamps as UTC;
- display timezone information in detailed metadata;
- compare periods only after consistent normalization;
- preserve original timestamps unchanged in cached demonstration snapshots.

A dedicated date-handling test should cover daylight-saving changes.

---

## 25. Metrics and Calculations

### Permitted MVP calculations

- sum;
- arithmetic mean;
- minimum;
- maximum;
- timestamp of minimum and maximum;
- change in absolute value;
- percentage change;
- latest reading;
- number of records;
- number of missing expected intervals;
- utility data age;
- basic aligned weather correlation or comparison.

### Calculation constraints

- do not compare incomplete periods without identifying them as partial;
- do not divide by zero;
- do not calculate percentages from absent baselines;
- do not normalize by floor area in MVP unless the metric and selected area basis are explicitly defined;
- do not combine water and energy values into a single numerical performance score;
- do not label an observation an anomaly without a defined rule;
- do not treat a cached snapshot capture date as the source measurement date.

### Recommended terminology

Use “notable peak” or “unusually high within the selected period” rather than “anomaly” until a formal anomaly method is implemented.

---

## 26. Conceptual IoT Dataset Requirements

The local simulated dataset should include metadata that makes its status explicit.

Suggested structure:

```ts
interface ConceptualIoTMetric {
  id: string;
  floor: "ground" | "second" | "third";
  label: string;
  value: number | string;
  unit?: string;
  status: "good" | "attention" | "neutral";
  classification: "conceptual";
  simulated: true;
  description: string;
}
```

The simulated values should be plausible but must not be described as representative of actual Oodi performance.

Avoid simulated emergencies, failures or serious indoor-environment problems.

The purpose is experience demonstration, not fictional building diagnosis.

Conceptual IoT implementation is not included in Stage 2.

---

## 27. Acceptance Criteria

The MVP is accepted when all of the following are true.

### Data

- Oodi is identified using the confirmed Nuuka property name.
- Electricity, Heat, Water and DistrictCooling requests work.
- Hourly, daily and monthly data are supported.
- Each utility has independent latest-reading logic.
- Empty recent electricity windows use a documented real-data fallback.
- No fabricated utility values are displayed.
- Units are correct.
- Requested and effective periods are available to the UI.
- Each utility summary identifies whether its value is hourly, daily, monthly or otherwise aggregated.
- No utility card displays an unexplained kWh or m³ value.
- Identical successful requests are reused from the in-memory session cache where valid.
- Identical in-flight requests are deduplicated.
- Manual refresh is available where appropriate without hiding the original source timestamp.

### Weather

- current public weather information loads for Oodi’s coordinates;
- weather observation or model time is displayed;
- weather errors do not block building data;
- provider attribution is included;
- the primary label is “Current Weather”;
- “Live Weather” is only used if technically justified by the provider’s timestamp behaviour.

### UX

- Overview, Resource Performance, Building Intelligence, Insights and Data Transparency are present;
- user can change utility and time window;
- actual date ranges are visible;
- real, cached and simulated information are visually distinct;
- desktop and mobile layouts are functional;
- loading, error, empty, partial and cached states are implemented.

### Conceptual layer

- at least one spatially engaging interaction is complete;
- simulated data is permanently labelled;
- no UI suggests connection to Oodi’s private systems;
- cached public data is never used as conceptual IoT data and conceptual IoT data is never used as a public-data fallback.

### Demonstration resilience

- a previously captured authentic Nuuka response can be loaded when the public API is unavailable;
- the fallback is labelled “Cached Public Data Snapshot”;
- original source timestamps remain visible;
- source endpoint, utility, unit, granularity, requested period and effective returned period are preserved;
- the snapshot capture date is recorded separately from source measurement timestamps;
- the fallback is never represented as current or live;
- conceptual IoT data is never substituted for public utility data;
- the fallback never silently replaces a valid API response.

### Integrity

- independent-project disclaimer is visible;
- sources are documented;
- timestamps are utility-specific;
- no official endorsement is implied;
- the experience does not call itself an operational digital twin;
- all architectural assets have appropriate usage rights or attribution;
- generated concept imagery is not presented as verified documentary imagery.

### Quality

- typecheck passes;
- lint passes;
- production build passes;
- critical flows are manually tested;
- automated tests cover the confirmed Nuuka response and fallback behaviours;
- portfolio-quality screenshots can be captured;
- interface contains no obvious placeholder content.

---

## 28. Out of Scope

The following are excluded from the MVP:

- user accounts;
- authentication;
- databases;
- private Nuuka access;
- paid data services unless essential;
- private BMS data;
- real occupancy;
- occupant tracking;
- individual device data;
- equipment control;
- maintenance workflow;
- work-order management;
- predictive analytics;
- machine-learning forecasting;
- formal anomaly detection;
- carbon accounting;
- cost or tariff modelling;
- energy benchmarking against other buildings;
- multi-building portfolios;
- complete BIM model;
- photorealistic real-time 3D walkthrough;
- Unreal Engine integration;
- VR integration;
- production cloud infrastructure;
- an administrative content-management system;
- official Oodi, Helsinki or WSP branding.

The following are specifically excluded from Stage 2:

- weather integration;
- final dashboard UI;
- charts;
- information architecture;
- final visual design;
- conceptual IoT implementation;
- Building Intelligence;
- complete application implementation.

---

## 29. Risks and Mitigations

### Risk: Nuuka data freshness varies

**Mitigation:** Per-utility timestamps, fallback logic and explicit freshness labels.

### Risk: Users interpret delayed energy data as live

**Mitigation:** Reserve “live” for weather only when justified and use “latest available” for Nuuka.

### Risk: Current weather is displayed alongside older utility records

**Mitigation:** Compare datasets only when timestamps align; otherwise explain the temporal difference.

### Risk: Conceptual data is mistaken for actual Oodi data

**Mitigation:** Persistent label, different visual treatment and repeated disclaimer.

### Risk: Cached public data is mistaken for a current API response

**Mitigation:** Require the “Cached Public Data Snapshot” label, original source timestamps, snapshot metadata and visibly different status treatment.

### Risk: External APIs fail during a portfolio presentation

**Mitigation:** Maintain a clearly labelled cached snapshot created from authentic Nuuka responses, preserving all original timestamps and source metadata.

### Risk: Utility cards display values without enough context

**Mitigation:** Require every summary value to state its granularity or aggregation period.

### Risk: “Live Weather” overstates the provider’s freshness

**Mitigation:** Use “Current Weather” by default and only introduce “Live Weather” after verifying observation recency and timestamp reliability.

### Risk: Architectural imagery is used without confirmed rights

**Mitigation:** Use original, licensed or generated assets and record attribution requirements before publication.

### Risk: Product becomes a generic dashboard

**Mitigation:** Use Oodi’s architecture and three-level spatial structure as the narrative framework.

### Risk: Scope grows into a full digital twin

**Mitigation:** Keep one building, four utilities, one weather source and one conceptual spatial interaction.

### Risk: External API changes

**Mitigation:** Typed adapters, schema validation, graceful errors and centralized endpoint configuration.

### Risk: Portfolio presentation implies affiliation

**Mitigation:** Visible independent-project statement and no imitation of corporate brand systems.

### Risk: Insights overstate engineering meaning

**Mitigation:** Deterministic rules, cautious language and no prescriptive recommendations.

### Risk: Cache obscures freshness or returns stale data unexpectedly

**Mitigation:** Cache keys must include utility, granularity and requested date range; source timestamps remain visible; manual refresh is available where appropriate.

---

## 30. Success Measures

Because this is a portfolio prototype, success should be measured through product quality rather than commercial usage.

### Product success

- all four public utility groups load successfully;
- data limitations are communicated accurately;
- users can understand the public, weather, cached and conceptual data classes;
- the principal experience works without a backend;
- the product remains stable during a live demonstration;
- external API failure does not destroy the demonstration experience.

### Communication success

A reviewer should be able to answer:

1. What building is being shown?
2. Which data is real public data?
3. Which weather information is current, forecast or modelled?
4. Which data is simulated?
5. Which data is a cached public snapshot?
6. When was each utility last updated?
7. What granularity or aggregation period does each summary value represent?
8. What does the selected chart period represent?
9. Why is this relevant to Digital Advisory?

### Portfolio success

The finished project should produce:

- one strong hero screenshot;
- one utility-performance screenshot;
- one Building Intelligence screenshot;
- one Data Transparency screenshot;
- a short screen-recorded walkthrough;
- a concise case-study description;
- material for two portfolio sections:
  - Real-Time Data Web Experience;
  - Interactive Project Communication.

---

## 31. Recommended Delivery Stages

### Stage 1 — PRD approval

Deliverables:

- approved MVP scope;
- approved terminology;
- confirmed integrity rules;
- confirmed resilience and image-attribution requirements.

Data discovery and temporary technical validation have already been completed.

No further product implementation should begin before PRD approval.

**Status:** Completed and approved.

### Stage 2 — Data Foundation

Approved scope:

- centralized Oodi configuration;
- normalized Nuuka types;
- API adapter;
- latest-reading logic;
- requested versus effective period metadata;
- real-data fallback resolution;
- explicit utility granularity;
- in-memory session caching;
- duplicate-request protection;
- manual refresh support where appropriate at the data layer;
- authentic cached demonstration snapshot;
- automated tests for confirmed Nuuka behaviour.

Recommended deliverables:

- centralized Oodi configuration module;
- typed Nuuka API adapter;
- normalized utility-series model;
- latest-reading selector;
- requested/effective period metadata;
- same-granularity real-data fallback resolver;
- explicit aggregation labels;
- session cache and in-flight request deduplication;
- typed loader for authentic demo snapshots;
- snapshot metadata structure preserving source details;
- automated tests for confirmed Nuuka response, empty-window and fallback behaviour.

Stage 2 must not include:

- weather integration;
- final dashboard UI;
- charts;
- information architecture;
- final visual design;
- conceptual IoT implementation;
- Building Intelligence;
- complete application implementation.

### Stage 3 — Weather integration

Deliverables:

- provider decision;
- current conditions;
- observation or model timestamp;
- forecast context;
- attribution;
- independent loading and error states;
- timestamp-alignment rules;
- weather response caching.

### Stage 4 — Information architecture

Deliverables:

- page or section map;
- primary user journey;
- content hierarchy;
- mobile adaptation;
- low-fidelity wireframes.

### Stage 5 — Visual design system

Deliverables:

- typography;
- palette;
- spacing;
- data-classification badges;
- chart language;
- cards and overlays;
- status treatments;
- architectural image strategy;
- attribution treatment.

### Stage 6 — Resource Performance

Deliverables:

- four utility views;
- period switching;
- charts;
- metrics;
- comparisons;
- fallback messaging;
- localized error states.

### Stage 7 — Building Intelligence

Deliverables:

- simplified Oodi representation;
- floor interaction;
- conceptual IoT dataset;
- simulated overlays;
- persistent disclosure.

### Stage 8 — Insights and transparency

Deliverables:

- deterministic insights;
- data-quality notes;
- source details;
- methodological explanations;
- cached snapshot metadata;
- image credits;
- project disclaimer.

### Stage 9 — Quality assurance

Deliverables:

- responsive testing;
- accessibility review;
- date and timezone review;
- API failure testing;
- cache and deduplication testing;
- snapshot fallback testing;
- typecheck;
- lint;
- production build.

### Stage 10 — Portfolio packaging

Deliverables:

- final deployment;
- screenshots;
- short demo video;
- case-study copy;
- portfolio page assets;
- final asset-rights and attribution review.

Each stage should be implemented and reviewed separately. The complete application must not be requested from Codex in one large prompt.

---

## 32. MVP Release Definition

The MVP release is a publicly viewable browser experience that:

- retrieves real Oodi utility data from Nuuka;
- retrieves current Helsinki weather with observation or model timestamps;
- presents four utilities across meaningful time windows;
- communicates each utility’s true date range;
- identifies the granularity or aggregation period represented by every summary value;
- caches successful responses during the current session;
- deduplicates identical in-flight requests;
- allows manual refresh where appropriate;
- provides a clearly labelled authentic public-data snapshot for presentation resilience;
- uses the label “Cached Public Data Snapshot”;
- preserves original timestamps and source metadata in cached snapshots;
- keeps cached public data separate from conceptual IoT data;
- uses current-weather terminology consistent with the selected provider;
- includes one polished conceptual building-intelligence interaction;
- provides deterministic insights;
- includes clear methodology and disclaimers;
- uses only original, licensed, generated or appropriately attributed architectural assets;
- functions responsively;
- is visually suitable for a Digital Advisory portfolio.

The MVP does not require a production backend, authentication, a database or a complete 3D model.

---

## 33. Post-MVP Opportunities

These ideas must not delay the MVP:

- historical weather aligned with utility periods;
- deeper weather-consumption comparisons;
- floor-area normalization;
- annual energy-intensity views;
- carbon-emissions estimates with documented factors;
- CityGML or Helsinki 3D city-model context;
- richer spatial model;
- animated system flows;
- multi-building comparison;
- configurable advisory scenarios;
- downloadable executive report;
- natural-language exploration;
- WebGL building model;
- BIM-linked prototype;
- Unreal Engine or VR companion experience.

Each future feature would require a separate validation of data sources, methodology and claims.

---

## 34. Final Product Statement

> Oodi Smart Building Intelligence is an independent browser-based prototype that transforms verified public utility data, current weather and clearly identified simulated operational indicators into a transparent, architectural and stakeholder-friendly smart-building experience.

The project’s value lies not in claiming access to Oodi’s operational systems, but in demonstrating how multidisciplinary teams could communicate complex building information more clearly through thoughtful data integration, spatial visualization and digital experience design.

---

## 35. Stage 2 Source-of-Truth Status

This PRD is approved to serve as the product source of truth for Stage 2 — Data Foundation.

Stage 2 implementation must remain limited to the scope defined in Section 31 and must not begin work assigned to later stages.

Any proposed deviation from the approved Stage 2 scope must be documented as a product decision before implementation.
