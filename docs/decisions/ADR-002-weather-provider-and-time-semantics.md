# ADR-002: Weather Provider and Time Semantics

**Status:** Accepted  
**Date:** 2026-06-21  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 3 - Weather Integration

## Context

Stage 3 adds public weather context for Helsinki Central Library Oodi without
changing the Stage 2 Nuuka data foundation. The MVP remains a frontend-only,
independent, non-commercial portfolio prototype. It does not claim access to
Oodi sensors, private systems, operational telemetry, or measured weather at
the building.

Open-Meteo provides a no-secret forecast API with browser-accessible CORS. Its
current weather block, hourly forecast, and daily forecast are provider data for
the requested coordinates and timezone. They must be labelled as current public
weather data, not live operational data and not an Oodi measurement.

## Decision

### Provider

The application uses Open-Meteo's forecast endpoint for Stage 3 weather
context. The request uses the central Oodi coordinates from `oodiConfig`, not a
separate duplicated coordinate configuration.

The request uses:

- `forecast_days=3`;
- `timezone=Europe/Helsinki`;
- current weather fields for the current provider context;
- hourly fields needed for the next 24 hours;
- daily fields needed for up to 3 days.

### Attribution and licensing boundary

The developer verification view shows visible Open-Meteo attribution. This
implementation is for an independent, non-commercial portfolio prototype.
Provider terms, attribution requirements, and commercial-use requirements must
be reviewed again before any future commercial deployment, production client
use, or broader redistribution.

### Time semantics

Stage 3 keeps the following timestamps separate:

- current weather source timestamp from the Open-Meteo current weather block;
- hourly forecast timestamps from the Open-Meteo hourly block;
- daily forecast dates and sunrise/sunset timestamps from the Open-Meteo daily
  block;
- application retrieval timestamp recorded by the repository;
- provider response-generation duration from `generationtime_ms`.

`generationtime_ms` is treated only as provider processing duration. It is not a
weather timestamp, source timestamp, model timestamp, retrieval timestamp, or
freshness signal.

Open-Meteo timestamps are requested in `Europe/Helsinki` and normalized to the
same sortable local timestamp format already used by the app:

```text
YYYY-MM-DDTHH:mm:ss
```

The implementation preserves original provider timestamps on weather points for
verification.

### Current weather semantics

The application uses the phrase "Current Weather" and avoids live-status
wording. Current weather is labelled as model-derived public weather context and
receives the `CURRENT_IS_MODELLED_CONTEXT` quality notice. It is never described
as measured at Oodi.

### Forecast array safety

Hourly and daily forecast arrays are validated by required field and array
length. The normalizer constructs each point only from values at the same
validated index. Misaligned arrays produce partial quality notices. Unsafe
points may be dropped only when the remaining index-aligned points are valid;
coverage reduction returns a partial result.

### Cache and refresh

Weather uses an independent in-memory cache and in-flight request deduplication.
The cache key includes provider, coordinates, timezone, forecast horizon,
requested variables, and strategy version. Force refresh bypasses completed
cache but does not change completed-cache identity.

Weather has no persistent snapshot fallback in Stage 3. On refresh failure, the
repository returns a typed weather error and preserves the previous successful
weather package separately for verification continuity.

### Error isolation

Weather errors remain isolated from Nuuka utility data. Nuuka repository results
must remain usable when the weather provider fails, times out, returns invalid
parameters, or produces invalid schema.

## Consequences

- Weather consumers use a typed normalized `WeatherResult` contract rather than
  raw Open-Meteo JSON.
- Open-Meteo response metadata, response coordinates, timezone abbreviation, UTC
  offset, attribution, provider processing duration, and origin remain visible
  for Stage 3 verification.
- Weather cache state and Nuuka cache state are independent.
- Stage 3 does not add historical weather, utility-weather correlation, charts,
  final dashboard UI, conceptual IoT, backend infrastructure, secrets, or new
  dependencies.
