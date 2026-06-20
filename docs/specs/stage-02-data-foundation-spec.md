# Oodi Smart Building Intelligence
## Stage 2 — Data Foundation Technical Specification

**Document type:** Stage Implementation Specification  
**Version:** 1.0  
**Status:** Proposed for review  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 2 — Data Foundation  
**Implementation status:** Data discovery completed; implementation not yet started  
**Primary implementation agent:** Codex  
**Primary reviewer:** Project owner  
**Date:** 2026-06-20  

---

## 1. Purpose

This specification defines the technical contract for Stage 2 of the Oodi Smart Building Intelligence MVP.

Stage 2 shall create a reliable, testable and presentation-ready data foundation for the four confirmed Nuuka utility groups associated with Helsinki Central Library Oodi:

- Electricity
- Heat
- Water
- District Cooling

The implementation shall retrieve real public data from the Nuuka Open API, validate and normalize the returned records, determine the latest available reading independently for each utility, support the approved product time windows, expose transparent metadata, and provide controlled fallback behaviour without fabricating values.

This document defines **how Stage 2 shall be implemented and validated**. The approved MVP PRD remains the source of truth for the complete product.

---

## 2. Source-of-truth hierarchy

When sources differ, use the following order of precedence:

1. Actual Nuuka API responses observed during implementation
2. `nuuka-discovery-report.md`
3. Approved MVP PRD
4. This Stage 2 specification
5. Existing temporary discovery-page implementation
6. General project-context documents

Any material discrepancy between the live API response and the discovery report shall be documented before implementation assumptions are changed.

---

## 3. Confirmed Oodi identity

The Stage 2 implementation shall use the following verified identity:

| Field | Value |
|---|---|
| Public name | Helsinki Central Library Oodi |
| Nuuka property name | `4669 Oodi Helsingin keskustakirjasto` |
| Property code | `091-002-0014-0005` |
| Building code | `103534449X` |
| Purpose of use | `G kirjasto` |
| Building type | `LibraryMuseumExhibitionHall` |
| Year of introduction | `2018-01-01T00:00:00` |
| Total area | `39817` |
| Heated area | `14643` |
| Volume | `108260` |
| Property latitude | `60.1738` |
| Property longitude | `24.9381` |

The property name and identifiers shall be defined once in project configuration and must not be duplicated as untracked string literals throughout the codebase.

---

## 4. Stage objective

At completion, the application shall have one internal data interface capable of returning a normalized `UtilitySeries` for any supported utility and approved time window.

The interface shall hide Nuuka-specific response details from future UI components while preserving all metadata required for technical honesty:

- source
- utility
- unit
- requested period
- effective period
- requested granularity
- effective granularity
- latest available timestamp
- retrieval timestamp
- fallback status
- fallback reason
- cache status
- data-quality notices
- normalized points

Future dashboard components shall consume this internal contract rather than calling the Nuuka API directly.

---

## 5. Scope

### 5.1 Included

Stage 2 includes:

1. Central Oodi property configuration
2. Nuuka API configuration and URL construction
3. Supported utility and period definitions
4. Raw response typing at the external boundary
5. Runtime validation of unknown API payloads
6. Normalization into internal data types
7. Unit normalization
8. Timestamp normalization and ordering
9. Duplicate handling
10. Latest-reading logic per utility and series
11. Requested versus effective period metadata
12. Approved fallback behaviour
13. In-memory caching
14. Concurrent-request deduplication
15. Manual refresh support
16. Request timeout and abort handling
17. Optional versioned local snapshots for last-resort portfolio resilience
18. Explicit loading, empty, partial, stale and error result states
19. Unit tests
20. API-contract fixture tests
21. Minimal integration verification
22. Developer documentation
23. Removal or isolation of temporary discovery logic that would conflict with the new architecture

### 5.2 Excluded

Stage 2 shall not implement:

- final dashboard UI
- final charts
- weather integration
- weather-to-energy correlation
- conceptual IoT values
- simulated sensors
- 3D or spatial visualization
- final navigation
- insights or anomaly claims
- predictive analytics
- authentication
- database persistence
- backend or proxy infrastructure
- service workers or offline-first architecture
- multi-property support
- operational controls
- BMS integration
- official Oodi, Helsinki, Nuuka or WSP branding
- a production digital twin

A temporary developer-facing verification view is permitted only when necessary to inspect Stage 2 outputs. It must not be treated as the final product interface.

---

## 6. Technical constraints

1. The project remains a Vite + React + TypeScript browser application.
2. Nuuka access shall remain browser-side unless implementation evidence proves that CORS or reliability makes this impossible.
3. No API key or secret is required for Nuuka.
4. No database shall be introduced.
5. No dependency shall be added unless it provides clear value over a small local implementation.
6. Runtime validation is required because TypeScript types alone do not validate external JSON.
7. The implementation must pass existing project checks:
   - typecheck
   - lint
   - tests
   - production build
8. The data layer shall remain framework-light and independently testable.
9. React components must not contain Nuuka endpoint construction, fallback logic or normalization logic.
10. All date calculations shall be deterministic and testable through an injected or explicit reference time where needed.

---

## 7. Data classification

All Stage 2 values are classified as:

```ts
type DataClassification = 'real-public-building-data';
```

Stage 2 shall not create conceptual IoT data.

The data-source descriptor shall identify Nuuka as public building data and shall not use the word `live`.

Recommended human-readable source label:

```text
Nuuka Open API — Helsinki public building data
```

Recommended status language for later UI use:

```text
Latest available building data
```

---

## 8. Supported utilities

```ts
export type UtilityId =
  | 'electricity'
  | 'heat'
  | 'water'
  | 'districtCooling';

export type NuukaReportingGroup =
  | 'Electricity'
  | 'Heat'
  | 'Water'
  | 'DistrictCooling';

export type UtilityUnit = 'kWh' | 'm3';
```

Required utility configuration:

```ts
export interface UtilityDefinition {
  id: UtilityId;
  reportingGroup: NuukaReportingGroup;
  displayName: string;
  canonicalUnit: UtilityUnit;
  sourceUnitAliases: readonly string[];
}
```

Expected mapping:

| Internal ID | Nuuka reporting group | Display name | Canonical unit |
|---|---|---|---|
| `electricity` | `Electricity` | Electricity | `kWh` |
| `heat` | `Heat` | Heat | `kWh` |
| `water` | `Water` | Water | `m3` |
| `districtCooling` | `DistrictCooling` | District Cooling | `kWh` |

Nuuka unit aliases shall be normalized case-insensitively:

- `kWh`, `KWH`, and equivalent casing → `kWh`
- `M3`, `m3`, `m³` → `m3`

The data layer shall retain the canonical machine unit. Presentation code may render `m3` as `m³`.

---

## 9. Product periods and granularities

```ts
export type ProductPeriod = '24h' | '30d' | '12m';
export type Granularity = 'hourly' | 'daily' | 'monthly';
```

Required mapping:

| Product period | Intended view | Requested granularity | Intended duration |
|---|---|---|---|
| `24h` | Operational | `hourly` | 24 hours |
| `30d` | Trend | `daily` | 30 days |
| `12m` | Historical | `monthly` | 12 months |

The period is a product concept. The effective records may come from an earlier date range when current Nuuka data is absent.

The implementation must never change the requested product period silently.

---

## 10. Proposed module structure

Codex shall first inspect the current repository. The following structure is the preferred target, but equivalent naming is acceptable when the existing project already has a coherent convention.

```text
src/
  config/
    oodi.ts

  data/
    nuuka/
      nuukaClient.ts
      nuukaEndpoints.ts
      nuukaSchemas.ts
      nuukaTypes.ts
      normalizeNuukaSeries.ts
      fetchNuukaSeries.ts
      nuukaFallback.ts
      nuukaCache.ts
      nuukaSnapshots.ts
      fixtures/
        *.json

    utilities/
      utilityDefinitions.ts
      utilityPeriods.ts
      utilitySeries.ts
      utilityRepository.ts

  test/
    ...

public/
  data/
    nuuka/
      snapshots/
        manifest.json
        ...

docs/
  product/
    oodi-smart-building-prd-v1.0.md
  specs/
    stage-02-data-foundation-spec.md
  decisions/
    ADR-001-nuuka-data-strategy.md
```

If the project uses path aliases, the new modules shall follow the existing alias convention.

---

## 11. Public internal API

The preferred application-facing API is:

```ts
export interface UtilitySeriesRequest {
  utility: UtilityId;
  period: ProductPeriod;
  end?: Date;
  refresh?: 'default' | 'force';
  signal?: AbortSignal;
}

export interface UtilityRepository {
  getSeries(request: UtilitySeriesRequest): Promise<UtilitySeriesResult>;
  invalidate(request?: Partial<Pick<UtilitySeriesRequest, 'utility' | 'period'>>): void;
}
```

React code shall depend on `UtilityRepository` or a thin hook built over it.

No React component shall import Nuuka raw-response types.

---

## 12. Core normalized contracts

### 12.1 Data point

```ts
export interface UtilityDataPoint {
  timestamp: string;       // ISO 8601
  value: number;
}
```

Rules:

- `timestamp` must be a valid ISO 8601 string.
- `value` must be finite.
- Points must be sorted ascending.
- Invalid records must not enter the normalized series.
- Zero is valid and must not be removed.
- Negative values must be retained only if accepted by the validated source contract; otherwise they must be rejected and reported as a quality notice. The implementation shall not silently clamp values.

### 12.2 Requested and effective windows

```ts
export interface TimeWindow {
  start: string;
  end: string;
}

export interface PeriodResolution {
  requestedPeriod: ProductPeriod;
  requestedGranularity: Granularity;
  requestedWindow: TimeWindow;
  effectiveGranularity: Granularity;
  effectiveWindow: TimeWindow | null;
  isFallback: boolean;
  fallbackReason: FallbackReason | null;
}
```

### 12.3 Provenance

```ts
export type SeriesOrigin = 'network' | 'memory-cache' | 'snapshot';

export interface UtilityProvenance {
  classification: 'real-public-building-data';
  provider: 'Nuuka';
  dataset: 'Helsinki public building energy data';
  endpoint: string | null;
  retrievedAt: string;
  origin: SeriesOrigin;
  snapshotGeneratedAt?: string;
}
```

### 12.4 Quality notices

```ts
export type DataQualityNoticeCode =
  | 'EMPTY_REQUESTED_WINDOW'
  | 'FALLBACK_WINDOW_USED'
  | 'SNAPSHOT_USED'
  | 'INVALID_ROWS_DROPPED'
  | 'DUPLICATES_RESOLVED'
  | 'UNIT_ALIAS_NORMALIZED'
  | 'UNEXPECTED_UNIT'
  | 'PARTIAL_WINDOW'
  | 'DELAYED_SOURCE_DATA'
  | 'NON_HOURLY_TIMESTAMP'
  | 'SOURCE_SCHEMA_VARIATION';

export interface DataQualityNotice {
  code: DataQualityNoticeCode;
  message: string;
  count?: number;
}
```

### 12.5 Utility series

```ts
export interface UtilitySeries {
  utility: UtilityId;
  reportingGroup: NuukaReportingGroup;
  displayName: string;
  unit: UtilityUnit;
  points: UtilityDataPoint[];
  latestReading: UtilityDataPoint | null;
  period: PeriodResolution;
  provenance: UtilityProvenance;
  qualityNotices: DataQualityNotice[];
}
```

### 12.6 Result union

```ts
export type UtilitySeriesResult =
  | {
      status: 'success';
      series: UtilitySeries;
    }
  | {
      status: 'empty';
      series: UtilitySeries;
      message: string;
    }
  | {
      status: 'error';
      error: UtilityDataError;
      previousSeries?: UtilitySeries;
    };
```

An empty valid response is not the same as a request error.

### 12.7 Errors

```ts
export type UtilityDataErrorCode =
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'UNEXPECTED_UNIT'
  | 'NO_DATA_AVAILABLE'
  | 'SNAPSHOT_INVALID'
  | 'UNKNOWN';

export interface UtilityDataError {
  code: UtilityDataErrorCode;
  message: string;
  retryable: boolean;
  statusCode?: number;
  cause?: unknown;
}
```

User-facing code must not display raw stack traces or unprocessed API payloads.

---

## 13. Nuuka endpoint construction

Base URL:

```text
https://helsinki-openapi.nuuka.cloud/api/v1.0
```

Energy endpoint pattern:

```text
/EnergyData/{Hourly|Daily|Monthly}/ListByProperty
```

Required query parameters:

```text
Record=LocationName
SearchString=4669 Oodi Helsingin keskustakirjasto
ReportingGroup={Electricity|Heat|Water|DistrictCooling}
StartTime=YYYY-MM-DD
EndTime=YYYY-MM-DD
```

For monthly requests, include:

```text
Normalization=false
```

The URL shall be created with `URL` and `URLSearchParams`, not manual string concatenation.

Endpoint builders shall be pure functions and unit tested.

The implementation shall not rely on the order of query parameters.

---

## 14. Raw response validation

The API response must be treated as `unknown`.

Codex shall inspect actual response fixtures and implement explicit runtime validation for:

- top-level response shape
- row collection
- timestamp field
- numeric value field
- unit field
- optional metadata fields

A lightweight custom validator is acceptable. A schema library is also acceptable if already installed or justified.

Validation must tolerate known harmless schema variation while rejecting unusable rows.

Required behaviour:

1. Reject a payload when no row collection can be identified.
2. Drop individual invalid rows when valid rows remain.
3. Record the number of dropped rows.
4. Return `INVALID_SCHEMA` when the payload cannot be interpreted safely.
5. Preserve a raw fixture for each confirmed response shape used by tests.
6. Do not spread unknown raw objects into normalized application types.

---

## 15. Timestamp strategy

### 15.1 Canonical representation

All normalized timestamps shall be stored as ISO 8601 strings.

### 15.2 Source interpretation

Nuuka timestamps that omit an explicit timezone must not be falsely relabelled as UTC.

The implementation shall:

- preserve the source wall-clock value;
- parse it consistently;
- document the interpretation in `ADR-001-nuuka-data-strategy.md`;
- avoid adding a `Z` suffix unless the source explicitly provides UTC;
- use a deterministic comparison method.

For this MVP, the data layer may compare normalized source timestamps lexicographically only after validating a uniform ISO-compatible format, or compare parsed date parts through a timezone-safe utility.

### 15.3 Precision

The implementation must preserve minute-level timestamps where present. Water discovery data includes timestamps such as `02:40`, so the normalizer must not round every reading to the hour.

### 15.4 Ordering

Normalized points shall be sorted ascending by timestamp after validation and deduplication.

---

## 16. Deduplication

Duplicate timestamps may appear due to API behaviour, overlapping fetches or fixture composition.

Deduplication key:

```text
utility + effective granularity + canonical timestamp
```

Within a single normalized response, timestamp is sufficient because utility and granularity are fixed by request.

Resolution rules:

1. Identical timestamp and identical value: keep one.
2. Identical timestamp and conflicting finite values:
   - prefer the last valid occurrence in the source response;
   - add `DUPLICATES_RESOLVED`;
   - do not average or sum.
3. Never merge data from different granularities into one series.
4. Never deduplicate merely by calendar date for hourly data.

The number of removed or resolved duplicates shall be testable.

---

## 17. Latest-reading logic

`latestReading` shall be calculated from the final normalized points, not from the final raw array item.

Algorithm:

1. Validate rows.
2. Normalize timestamps and values.
3. Deduplicate.
4. Sort ascending.
5. Select the point with the maximum valid timestamp.

Rules:

- Compute latest reading independently for every utility and requested series.
- Do not use a single global “last updated” timestamp.
- Do not assume that electricity, heat, water and district cooling have equal recency.
- A cached or snapshot series retains the latest source reading timestamp from its data.
- `retrievedAt` is not the latest reading timestamp.
- Empty series use `latestReading: null`.

A later aggregate overview may compute a separate “data coverage” summary, but Stage 2 shall not invent one shared update date.

---

## 18. Requested window calculation

All requests shall accept an explicit `end` reference or default to the current date at execution.

Suggested calculations:

| Period | Requested start | Requested end |
|---|---|---|
| `24h` | end minus 24 hours | end |
| `30d` | end minus 30 calendar days | end |
| `12m` | end minus 12 calendar months | end |

Because the Nuuka endpoint uses date query parameters, the request builder shall convert boundaries to `YYYY-MM-DD`.

The exact request dates must be included in `requestedWindow`.

Tests shall use fixed dates, not the actual clock.

---

## 19. Requested versus effective periods

The implementation must preserve both concepts.

### Requested period

What the product or user requested:

```text
24h / hourly
30d / daily
12m / monthly
```

### Effective period

What was actually returned after fallback and normalization.

Examples:

- A `24h` request may return the most recent available 24 hourly points from an earlier month.
- A `30d` request may return 30 daily points ending at the latest known Nuuka date.
- A `12m` request may return the latest 12 monthly records, even when they do not end in the current month.

Required metadata:

- requested period
- requested granularity
- requested start and end
- effective granularity
- earliest returned timestamp
- latest returned timestamp
- whether fallback was used
- why fallback was used

The product period remains `24h`, `30d` or `12m`; fallback changes the effective source window, not the user’s original request.

---

## 20. Fallback strategy

### 20.1 Principles

Fallback exists to show the most recent genuine public data available.

Fallback shall never:

- fabricate values;
- interpolate missing readings;
- copy another utility;
- substitute a different unit;
- silently change granularity;
- imply that old data is current;
- label Nuuka data as live.

### 20.2 Fallback reasons

```ts
export type FallbackReason =
  | 'requested-window-empty'
  | 'requested-window-partial'
  | 'network-unavailable-snapshot-used'
  | 'api-error-snapshot-used'
  | null;
```

### 20.3 Required sequence

For each utility and product period:

#### Attempt 1 — Requested window

Request the approved granularity for the requested dates.

When sufficient records are returned, normalize and return them.

#### Attempt 2 — Discover latest available anchor

When the requested window is empty:

1. Query monthly historical data using a bounded discovery range.
2. Identify the latest valid monthly timestamp for that utility.
3. Use that timestamp as the anchor for a second request at the original requested granularity.

The initial bounded discovery range shall be:

```text
2018-01-01 to requested end date
```

This is justified by the confirmed Oodi introduction date and the discovery results.

#### Attempt 3 — Same-granularity fallback window

Using the discovered latest anchor:

- `24h`: request a bounded hourly range ending around the anchor, then select the latest 24 valid hourly points.
- `30d`: request a bounded daily range ending around the anchor, then select the latest 30 valid daily points.
- `12m`: use monthly historical data and select the latest 12 valid monthly points.

The fetch range may be larger than the final number of points to accommodate gaps:

| Period | Suggested fallback fetch range |
|---|---|
| `24h` | 7 calendar days before anchor through 1 day after |
| `30d` | 45 calendar days before anchor through 1 day after |
| `12m` | 18 calendar months before anchor through 1 month after |

These are implementation defaults, not product claims. Codex may adjust them with tests and documentation if actual Nuuka behaviour requires it.

#### Attempt 4 — Snapshot fallback

Use a validated local snapshot only when:

- the network request fails;
- the API returns an error;
- CORS fails in the deployed portfolio environment; or
- all live fallback attempts fail because the API is unavailable.

A snapshot must not automatically replace a successful empty live response unless the project explicitly determines that the empty response is caused by a temporary API defect.

### 20.4 Granularity rule

Fallback must stay at the requested granularity whenever that granularity has confirmed data.

Stage 2 shall not automatically show monthly values in a `24h` view.

If no same-granularity values exist, return an honest empty result with metadata. Do not manufacture a chart.

### 20.5 Partial data

A requested series may contain fewer than the intended number of points.

It may still return `success` when at least one valid point exists, but must include `PARTIAL_WINDOW`.

“Partial” is determined against expected point counts:

- `24h`: fewer than 24 normalized points
- `30d`: fewer than 30 normalized points
- `12m`: fewer than 12 normalized points

This is a coverage notice, not proof of a data-quality failure.

---

## 21. Record selection

After fallback retrieval:

- `24h`: select the latest 24 valid hourly points
- `30d`: select the latest 30 valid daily points
- `12m`: select the latest 12 valid monthly points

Selection occurs after normalization, deduplication and sorting.

Do not assume one row per expected interval. Preserve actual timestamps and gaps.

Do not fill gaps in Stage 2.

---

## 22. Cache

### 22.1 Scope

Use an in-memory cache only.

Browser storage persistence is not required for Stage 2.

### 22.2 Cache key

The cache key must include every input that changes the series result:

```text
provider
property identity
utility
product period
requested granularity
requested end date bucket
fallback-strategy version
```

Suggested key:

```ts
type CacheKey =
  `nuuka:${string}:${UtilityId}:${ProductPeriod}:${Granularity}:${string}:v1`;
```

The date component shall use a stable bucket appropriate to the source request, such as `YYYY-MM-DD`.

### 22.3 Cache entry

```ts
export interface CacheEntry<T> {
  value: T;
  storedAt: number;
  expiresAt: number;
}
```

### 22.4 TTL

Recommended initial TTL:

```text
15 minutes
```

The TTL affects network refresh frequency, not the source-data timestamp.

A cached response must retain:

- original source endpoint
- original source latest timestamp
- original retrieval time
- an origin of `memory-cache` on the returned copy

### 22.5 Stale data

Expired entries shall not be returned as fresh cache hits.

An expired successful entry may be supplied as `previousSeries` when a refresh fails, allowing future UI to preserve the last known valid state while displaying an error. It must not be silently presented as a new successful network response.

### 22.6 Invalidation

The repository shall support:

- invalidating one utility and period;
- invalidating all periods for one utility;
- invalidating the complete Nuuka cache.

---

## 23. Concurrent-request deduplication

Identical in-flight requests must share one promise.

Required behaviour:

1. Before starting fetch, check the in-flight request map by cache key.
2. Return the existing promise when present.
3. Remove the in-flight entry in `finally`.
4. Cache successful and valid empty results according to the chosen policy.
5. Do not permanently cache transient errors.

This prevents React rerenders or multiple components from causing duplicate Nuuka calls.

Abort behaviour must be documented. A caller-provided signal shall not accidentally abort a shared request needed by another caller. Preferred options:

- use an internal request controller and treat caller abort as abandoning only that caller; or
- do not share requests carrying caller-specific abort signals.

Codex shall choose one explicit strategy and test it.

---

## 24. Refresh

`refresh: 'force'` shall:

- bypass an unexpired cache entry;
- reuse an identical already-running forced request where safe;
- fetch from Nuuka;
- update cache on success;
- retain the previous valid series for error recovery;
- not modify the requested period.

A force refresh shall not disable the approved fallback sequence.

---

## 25. Timeouts, retry and abort

### 25.1 Timeout

Each HTTP request shall have a finite timeout.

Recommended default:

```text
10 seconds
```

### 25.2 Retry

Do not implement broad automatic retry loops.

One retry is permitted only for clearly transient failures such as:

- network interruption
- HTTP 429
- HTTP 502
- HTTP 503
- HTTP 504

Retry rules:

- maximum one retry per endpoint attempt;
- use a short delay;
- respect abort;
- do not retry validation failures or normal 4xx errors;
- fallback requests are separate logical attempts, not retries.

### 25.3 Abort

Aborted work returns `ABORTED` and shall not trigger snapshot fallback unless the implementation explicitly distinguishes internal timeout from user navigation abort.

---

## 26. Snapshots

### 26.1 Purpose

Snapshots are a resilience mechanism for a portfolio prototype, not the primary data source.

### 26.2 Location

Preferred location:

```text
public/data/nuuka/snapshots/
```

### 26.3 Contents

A snapshot file shall contain normalized or validated source-derived data plus manifest metadata.

Recommended manifest:

```ts
export interface NuukaSnapshotManifestEntry {
  id: string;
  utility: UtilityId;
  granularity: Granularity;
  propertyCode: string;
  generatedAt: string;
  sourceLatestTimestamp: string | null;
  unit: UtilityUnit;
  file: string;
  pointCount: number;
  checksum?: string;
}
```

### 26.4 Required snapshot coverage

For each utility, maintain one snapshot per approved granularity when actual data is available:

- hourly
- daily
- monthly

A missing granularity must be documented rather than simulated.

### 26.5 Snapshot generation

Snapshot updates shall be performed by an explicit developer script or documented manual command.

The runtime application shall not overwrite repository snapshots.

### 26.6 Snapshot use

When used:

- `origin` must be `snapshot`;
- include `SNAPSHOT_USED`;
- include snapshot generation timestamp;
- preserve the source latest timestamp;
- expose a fallback reason;
- do not claim that the snapshot is current;
- validate the snapshot before returning it.

### 26.7 Security and integrity

Snapshots must contain public data only.

No secret, token, local path or personal information shall be included.

---

## 27. Empty, error and degraded states

The data layer shall distinguish:

### Success

One or more valid points are available.

### Empty

The API and approved fallback sequence completed without a technical failure, but no valid points were found.

### Error

The request failed technically and no valid fallback result was available.

### Degraded success

A valid series is available from:

- an earlier effective window;
- a partial window;
- memory cache;
- snapshot.

Degraded success remains `status: 'success'` with explicit provenance and quality notices.

Suggested developer messages:

| Condition | Message |
|---|---|
| Empty current window | No readings were returned for the requested dates. |
| Earlier data used | The most recent available readings are from an earlier period. |
| Snapshot used | The public API was unavailable; a versioned public-data snapshot is being shown. |
| Partial series | Fewer readings were available than the selected period normally contains. |

---

## 28. Nuuka data recency

Stage 2 shall not assign one freshness threshold to every utility as a factual promise.

It may calculate a descriptive age:

```ts
export interface DataAge {
  latestTimestamp: string | null;
  ageInHours: number | null;
}
```

A later UI may label data as delayed based on product policy.

For Stage 2, add `DELAYED_SOURCE_DATA` only when a documented threshold is introduced in configuration and tests. Do not hard-code unsupported operational expectations.

The discovery evidence demonstrates that utility timestamps can differ materially; this variance is expected and must be preserved.

---

## 29. Calculations explicitly deferred

Stage 2 shall not calculate or claim:

- efficiency
- energy performance
- benchmark compliance
- carbon emissions
- cost savings
- anomalies
- causation
- occupancy relationships
- weather causation
- engineering diagnostics

Safe Stage 2 calculations:

- latest value
- minimum and maximum timestamp
- point count
- finite sum for a selected series when technically needed
- arithmetic average when technically needed
- data coverage count
- age since latest timestamp

Any sum or average helper must preserve unit and be clearly separate from engineering interpretation.

---

## 30. Testing requirements

### 30.1 Unit tests

Required unit-test groups:

1. Utility configuration mapping
2. Endpoint URL creation
3. Date-window calculation
4. Unit alias normalization
5. Raw-row validation
6. Timestamp normalization
7. Numeric parsing
8. Invalid-row dropping
9. Sorting
10. Duplicate resolution
11. Latest-reading selection
12. Latest reading with unsorted input
13. Latest reading with minute-level timestamps
14. Empty series
15. Partial-window notice
16. Requested/effective metadata
17. Cache key stability
18. TTL expiry
19. Cache invalidation
20. In-flight promise deduplication
21. Force refresh
22. Error mapping
23. Snapshot validation
24. Snapshot provenance
25. Same-granularity fallback selection

### 30.2 Fixtures

Include sanitized fixtures derived from actual Nuuka responses for:

- Electricity hourly
- Electricity daily
- Electricity monthly
- Heat hourly or daily
- Water hourly containing minute-level timestamps
- District Cooling monthly or daily
- empty response
- malformed row
- duplicate timestamps
- conflicting duplicate values
- unexpected unit
- invalid top-level schema

Fixtures must remain small enough for source control while preserving relevant response structure.

### 30.3 Integration tests

At least one integration-style test shall exercise:

```text
request definition
→ endpoint builder
→ mocked fetch response
→ runtime validation
→ normalization
→ fallback metadata
→ UtilitySeriesResult
```

Network-dependent tests shall not be required for the normal test suite.

### 30.4 Optional live smoke test

Provide a manual or explicitly opt-in live smoke test that:

- requests one confirmed Oodi series;
- verifies HTTP success;
- validates at least one returned row when available;
- prints no secrets;
- does not run during normal CI or offline testing.

### 30.5 Existing project checks

Completion requires:

```text
typecheck passes
lint passes
tests pass
production build passes
```

No check shall be disabled to obtain a passing result.

---

## 31. Developer verification output

Before the final dashboard stage, a minimal developer verification page or console-safe inspection utility may expose:

- utility
- requested period
- requested window
- effective window
- point count
- latest reading
- unit
- origin
- fallback status
- quality notices
- error state

It shall avoid polished dashboard work.

This view exists only to prove the Stage 2 contract and may later be removed.

---

## 32. Logging

Development logging may include:

- endpoint path without sensitive information
- request utility and period
- response status
- normalized point count
- invalid-row count
- fallback activation
- cache hit or miss
- snapshot use

Production logging shall be minimal.

Do not log entire large payloads by default.

No log message shall describe Nuuka data as live.

---

## 33. Accessibility and future UI readiness

Although Stage 2 is not a UI stage, returned metadata must support accessible future presentation:

- unambiguous utility names
- canonical units
- machine-readable timestamps
- human-readable status messages
- explicit source and origin
- explicit fallback state
- no reliance on colour to communicate data quality

---

## 34. Performance expectations

Stage 2 is acceptable when:

- identical concurrent requests produce one network execution;
- unexpired cache hits avoid network calls;
- normalization is linear in the number of raw rows;
- large historical monthly queries do not freeze the UI;
- a failed endpoint resolves through bounded timeout and fallback;
- no unbounded polling is introduced;
- no background refresh loop is introduced.

---

## 35. Security and privacy

- Use HTTPS only.
- Do not introduce credentials.
- Do not collect user data.
- Do not add analytics in Stage 2.
- Do not expose internal stack traces to the UI.
- Treat all remote JSON as untrusted.
- Avoid dynamic code execution.
- Do not proxy the API through an unreviewed third-party service.

---

## 36. Files allowed to change

Codex may change or add:

- Stage 2 data-layer files
- Stage 2 tests and fixtures
- central Oodi configuration
- package configuration when a justified test or validation dependency is required
- temporary developer verification UI
- documentation under `docs/`
- snapshot-generation scripts
- versioned public snapshots

Codex shall avoid unrelated changes to:

- final visual design
- global styling
- unrelated components
- asset pipelines
- deployment configuration
- future weather modules
- conceptual IoT modules

Before implementation, Codex shall provide the proposed file-change list.

---

## 37. ADR requirement

Create:

```text
docs/decisions/ADR-001-nuuka-data-strategy.md
```

The ADR shall record:

1. Why browser-side Nuuka access is retained
2. Why normalized internal contracts are used
3. Why each utility owns its latest timestamp
4. Why requested and effective periods are separate
5. Why fallback preserves granularity
6. Why no interpolation is allowed
7. Why in-memory caching is sufficient for the MVP
8. Why snapshots are permitted only as labelled fallback
9. How timezone-less Nuuka timestamps are interpreted
10. Which runtime-validation approach was selected

The ADR status shall initially be `Accepted` once the Stage 2 implementation is approved.

---

## 38. Implementation sequence

Codex shall implement Stage 2 in small reviewable steps.

### Step 1 — Repository assessment

- Read the approved PRD.
- Read this specification.
- Read `nuuka-discovery-report.md`.
- Inspect current project structure.
- Inspect existing discovery logic.
- Run baseline typecheck, lint and build.
- Report existing failures before making changes.

### Step 2 — Plan only

Before editing code, provide:

- proposed module map;
- files to add;
- files to modify;
- dependency changes;
- raw Nuuka schema findings;
- test plan;
- ambiguities or deviations.

No code changes shall be made during this planning step.

### Step 3 — Core contracts and configuration

Implement:

- Oodi identity configuration
- utility definitions
- periods
- normalized types
- errors
- provenance contracts

### Step 4 — API boundary

Implement:

- endpoint builder
- timeout-aware client
- response validation
- fixtures
- error mapping

### Step 5 — Normalization

Implement:

- units
- timestamps
- numeric values
- row filtering
- sorting
- deduplication
- latest-reading logic

### Step 6 — Period resolution and fallback

Implement:

- requested windows
- latest-anchor discovery
- same-granularity fallback
- record trimming
- partial metadata
- effective windows

### Step 7 — Cache and concurrency

Implement:

- cache keys
- TTL
- invalidation
- in-flight deduplication
- forced refresh
- previous-series error recovery

### Step 8 — Snapshots

Implement:

- manifest
- validation
- loading
- provenance
- generation/update documentation

### Step 9 — Repository integration

Implement:

- `UtilityRepository`
- minimal verification integration
- removal or isolation of superseded discovery code

### Step 10 — Validation

Run:

- tests
- typecheck
- lint
- build
- optional manual live smoke test

### Step 11 — Review report

Provide:

- changed files
- test results
- known limitations
- deviations from spec
- screenshot or text output from developer verification
- proposed commit message

---

## 39. Acceptance criteria

Stage 2 is complete only when all criteria below are satisfied.

### AC-01 — Verified property configuration

The application has one central configuration containing the confirmed Oodi property and building identifiers, including total area, heated area and volume.

### AC-02 — Four supported utilities

Electricity, heat, water and district cooling are represented through typed definitions and correct Nuuka reporting groups.

### AC-03 — Runtime validation

Nuuka responses are validated at runtime before entering application state.

### AC-04 — Normalized contract

Every successful or empty request resolves through the defined `UtilitySeriesResult` contract or an approved equivalent containing all required metadata.

### AC-05 — Correct units

Electricity, heat and district cooling use canonical `kWh`; water uses canonical `m3`.

### AC-06 — Independent timestamps

Every utility series calculates its own latest available timestamp. No global utility timestamp is assumed.

### AC-07 — Supported periods

The repository accepts `24h`, `30d` and `12m` and maps them to hourly, daily and monthly data respectively.

### AC-08 — Requested/effective transparency

The result exposes requested and effective windows, granularities and fallback state.

### AC-09 — Honest fallback

Empty current windows may resolve to earlier genuine Nuuka data through the documented same-granularity fallback. No value is fabricated or interpolated.

### AC-10 — Partial coverage

Series with fewer than the intended point count remain usable and expose a partial-window notice.

### AC-11 — Latest-reading correctness

Latest readings are selected after validation, deduplication and chronological sorting.

### AC-12 — Water timestamp precision

Minute-level water timestamps are preserved and tested.

### AC-13 — Deduplication

Duplicate timestamps are resolved deterministically and conflicting duplicates produce a quality notice.

### AC-14 — Cache

Identical requests use a stable in-memory cache with finite TTL.

### AC-15 — Concurrent requests

Identical concurrent calls share one in-flight operation.

### AC-16 — Refresh

A force refresh bypasses completed cache entries without disabling fallback.

### AC-17 — Controlled errors

Timeout, abort, HTTP, network, invalid JSON and invalid-schema failures map to typed errors.

### AC-18 — Snapshot integrity

Snapshot fallback is validated, versioned, visibly identified and never represented as a fresh network response.

### AC-19 — No direct UI API coupling

React UI code does not construct Nuuka URLs or normalize Nuuka records.

### AC-20 — Test coverage

Required unit and integration tests pass using local fixtures.

### AC-21 — Build health

Typecheck, lint, tests and production build pass without disabling existing checks.

### AC-22 — Technical honesty

No Stage 2 copy or metadata describes delayed Nuuka utility data as live.

### AC-23 — No scope expansion

Weather, conceptual IoT, final dashboard design and engineering insights are not implemented.

### AC-24 — Documentation

`ADR-001-nuuka-data-strategy.md` and data-layer developer documentation are present and consistent with the implementation.

### AC-25 — Reviewability

Changes are presented as one bounded Stage 2 implementation with a clear file list and proposed commit message.

---

## 40. Definition of done

Stage 2 is done when:

- all acceptance criteria pass;
- the project owner has reviewed the implementation report;
- deviations are documented;
- no unresolved critical error remains;
- the data foundation can supply normalized series to a future UI;
- the app can communicate source, unit, latest timestamp, requested period, effective period and fallback status;
- a commit is created only after review approval.

Suggested commit message:

```text
feat(data): implement Stage 2 Nuuka data foundation
```

---

## 41. Instructions for Codex

Use this specification as the implementation contract.

Before editing code:

1. Read the PRD.
2. Read the Nuuka discovery report.
3. Inspect the repository.
4. Run baseline checks.
5. Produce a Stage 2 implementation plan and proposed file list.
6. Stop for review.

During implementation:

- work only within Stage 2 scope;
- prefer small, testable modules;
- preserve technical honesty;
- do not fabricate missing values;
- do not build the final dashboard;
- do not add weather or IoT;
- report any API-schema discrepancy;
- do not disable tests, lint or type safety;
- do not make unrelated refactors.

After implementation:

- run all checks;
- provide changed files and results;
- describe fallbacks with examples;
- disclose limitations;
- wait for review before committing.

---

## 42. Known discovery evidence informing this specification

The discovery report confirmed:

- Nuuka property lookup succeeds without authentication.
- Browser-side access is currently compatible with CORS.
- The four required reporting groups exist.
- Data availability and latest timestamps vary by utility.
- Electricity required an earlier-window fallback during discovery.
- Water contained readings with minute-level timestamps.
- Monthly historical electricity data extends back to approximately the Oodi opening period.
- Nuuka uses `DistrictCooling` as the official reporting-group name.
- Water source units may appear as `M3`.
- Empty recent windows do not prove that a utility has no historical data.

These observations are treated as implementation requirements, not assumptions that all future responses will have identical dates or row counts.

---

## 43. Open implementation decisions

The following may be resolved by Codex during planning, but must be documented before coding:

1. Exact raw Nuuka response schema names observed in fixtures
2. Custom validation versus a schema-validation dependency
3. Exact timestamp representation for timezone-less Nuuka values
4. Exact cache TTL constant location
5. Whether valid empty results are cached and for how long
6. Caller-abort behaviour for shared in-flight requests
7. Snapshot file format: normalized contract or validated source-shaped fixture
8. Test framework choice when the repository does not already include one
9. Whether the temporary discovery page is removed or converted into a Stage 2 verification page

None of these decisions may weaken the acceptance criteria.

---

## 44. Approval

**Specification status:** Proposed for review  
**Implementation authorization:** Not yet granted  

Approval of this document authorizes Codex to begin with **planning mode only**. Code implementation requires a separate explicit instruction after the plan is reviewed.
