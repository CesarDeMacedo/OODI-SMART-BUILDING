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

The final app should generate strong screenshots and a credible demonstration that can be presented to a Digital Advisory Lead.

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

Completed:

* Vite + React + TypeScript project initialized;
* Oodi identified in Nuuka;
* identifiers confirmed;
* four utility groups confirmed;
* units confirmed;
* hourly, daily and monthly data tested;
* CORS confirmed;
* discovery report created;
* temporary API discovery page created;
* typecheck, lint and build passed.

Next action:

> Create and approve the MVP Product Requirements Document before starting the second implementation phase.
