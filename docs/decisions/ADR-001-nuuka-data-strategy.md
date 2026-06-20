# ADR-001: Nuuka Data Strategy

**Status:** Accepted  
**Date:** 2026-06-20  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 2 - Data Foundation

## Context

Stage 2 creates the data foundation for Helsinki Central Library Oodi using verified public data from the Helsinki Nuuka Open API. The discovery report confirmed the Oodi Nuuka identity as `4669 Oodi Helsingin keskustakirjasto`, property code `091-002-0014-0005`, and the reporting groups `Electricity`, `Heat`, `Water`, and `DistrictCooling`.

Nuuka data is public building data. It can be delayed, sparse, utility-specific, or temporarily unavailable. The product must not imply operational access, real-time building telemetry, engineering diagnosis, or a connection to Oodi private systems.

## Decision

### Browser-side Nuuka access

The application retains browser-side Nuuka access for Stage 2 because the public API requires no secret and discovery found CORS headers allowing direct browser requests. A backend or serverless proxy remains a future option only if reliability, CORS, rate limits, or product requirements justify it.

### Normalized internal contract

The app uses a typed internal `UtilitySeriesResult` contract instead of exposing raw Nuuka payloads to React components. Runtime validation treats remote JSON as `unknown`, drops unusable rows when safe, and records data-quality notices.

### Per-utility latest timestamps

Each utility computes its own `latestReading` after validation, deduplication, sorting, and timestamp canonicalization. No single global building-data timestamp is assumed because Nuuka utility groups update independently.

### Requested and effective periods

Requested period and effective returned period remain separate. A user or product request may ask for `24h`, `30d`, or `12m`, while Nuuka may only have valid data for an earlier effective window. The result exposes both windows and both granularities.

### Same-granularity fallback

Fallback preserves the requested granularity. If a current requested window is empty, the implementation uses a monthly historical probe only to find the latest available anchor, then requests the original hourly, daily, or monthly granularity around that anchor. It never substitutes a different utility or fabricates values.

Nuuka may return HTTP 404 for a confirmed Oodi energy endpoint when no records exist for the requested window. The observed browser-visible payload is `MissingSettingsException` with an error note stating that no data was found; some tooling may surface the body as empty. Stage 2 classifies this narrowly as an empty row result only when the URL matches the Nuuka energy endpoint pattern, the verified Oodi location query, a supported reporting group, valid date query parameters, and either the confirmed no-data payload or an empty body. Unrelated 404 responses remain typed HTTP errors.

### No interpolation or fabricated values

Missing utility values are not interpolated, extrapolated, cloned from another period, or filled with placeholders. Empty valid API responses remain empty. Snapshot files must contain authentic Nuuka-derived data only.

### Cache identity

The completed-cache key includes:

- provider;
- property code;
- utility;
- product period;
- requested granularity;
- requested start;
- requested end;
- fallback-strategy version.

Refresh mode may distinguish in-flight forced requests, but it is not part of the completed-cache identity. This lets force refresh bypass completed cache without changing the identity of a successfully completed data product.

### In-memory cache

Stage 2 uses in-memory cache and in-flight request deduplication because the MVP has no backend, no database, and no authentication. The cache is a session resilience and performance mechanism, not a persistence layer.

### Snapshots

Snapshots are permitted only as labelled fallback for technical failures according to the approved policy:

| Error class | Snapshot permitted |
|---|---|
| `NETWORK` | Yes |
| `TIMEOUT` | Yes |
| Retryable `HTTP` | Yes |
| `INVALID_JSON` | Yes |
| `INVALID_SCHEMA` | Yes, retaining schema diagnostics |
| `UNEXPECTED_UNIT` | Yes, after rejecting the current payload and recording the reason |
| `ABORTED` | No |
| Valid empty API response | No |

Snapshot provenance must use `origin: "snapshot"`, include `SNAPSHOT_USED`, preserve original source timestamps, and never imply current or live data.

### Timestamp interpretation

Nuuka timestamps are treated as Helsinki source wall time when they do not include an explicit timezone. Normalized point timestamps use a fixed sortable local format:

```text
YYYY-MM-DDTHH:mm:ss
```

The implementation does not append `Z`. The original Nuuka timestamp is preserved on each point as `sourceTimestamp` for provenance and debugging.

The point contract is intentionally simple:

```ts
interface UtilityDataPoint {
  timestamp: string;
  sourceTimestamp: string;
  value: number;
}
```

Series-level metadata documents the source and interpretation, avoiding repeated timezone and precision objects on every point.

### Negative values

Finite negative values are preserved unless authentic Nuuka documentation or fixtures prove they are invalid. When present, the normalizer emits `NEGATIVE_VALUE_PRESENT` and does not clamp, reinterpret, or discard the value. Negative values may represent source corrections or adjustments.

### Helsinki civil-date arithmetic

Nuuka endpoints accept calendar dates. Requested windows therefore derive the Helsinki civil date first, then subtract calendar days or months, returning `YYYY-MM-DD`. Fixed millisecond subtraction is avoided for product windows so daylight-saving transitions do not distort request dates.

### Validation approach

Stage 2 uses small custom runtime validators instead of adding a schema-validation dependency. This keeps dependencies minimal while still validating top-level payloads, row fields, timestamps, finite numbers, units, and known Nuuka error payloads.

## Consequences

- Future UI work consumes normalized utility data instead of raw Nuuka payloads.
- Data provenance, quality notices, requested windows, effective windows, and origin remain available for transparent presentation.
- The app remains frontend-only for Stage 2.
- Delayed or cached Nuuka data must be labelled honestly.
- Snapshot and cache behavior is bounded and testable.
- Weather, final dashboard UI, charts, Building Intelligence, conceptual IoT, insights, and backend infrastructure remain outside Stage 2.
