# Oodi Smart Building Intelligence
## Stage 3 — Weather Integration Technical Specification

**Document type:** Stage Implementation Specification  
**Version:** 1.0  
**Status:** Proposed for review  
**Project:** Oodi Smart Building Intelligence  
**Stage:** 3 — Weather Integration  
**Implementation authorization:** Not yet granted  
**Primary implementation agent:** Codex  
**Primary reviewer:** Project owner  
**Date:** 2026-06-20  

---

## 1. Purpose

This specification defines the technical contract for Stage 3 of the Oodi Smart Building Intelligence MVP.

Stage 3 shall add current public weather information and short forecast context for Helsinki Central Library Oodi while preserving the product’s data-integrity model.

The implementation shall:

- retrieve weather data for Oodi’s verified coordinates;
- distinguish current conditions from forecast values;
- expose provider, model and timestamp metadata;
- normalize the provider response into an internal weather contract;
- cache and deduplicate requests;
- provide isolated loading, partial, empty and error states;
- preserve Stage 2 behaviour;
- avoid claiming that modelled weather is a direct building measurement;
- avoid combining current weather with older Nuuka utility periods as though they were simultaneous.

This specification defines how Stage 3 shall be planned, implemented and validated. The approved PRD remains the product source of truth.

---

## 2. Source-of-truth hierarchy

When sources differ, use this order:

1. Actual provider responses observed during implementation
2. Official provider API documentation and terms
3. Approved MVP PRD
4. This Stage 3 specification
5. Existing Stage 2 architecture and ADR
6. General project context

Any material provider-schema or licensing discrepancy must be documented before implementation assumptions are changed.

---

## 3. Stage objective

At completion, the application shall expose one internal weather repository capable of returning:

- current weather context for Oodi;
- a short hourly forecast;
- a compact daily forecast;
- provider, model and timestamp metadata;
- normalized units;
- cache provenance;
- typed errors;
- transparent freshness and classification information.

Future UI components shall consume this internal contract rather than calling the weather provider directly.

---

## 4. Provider decision

### 4.1 Selected provider

The preferred Stage 3 provider is:

**Open-Meteo Weather Forecast API**

Proposed endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

### 4.2 Why Open-Meteo is suitable

Open-Meteo is preferred because it supports:

- browser-friendly public API access;
- no client-side secret for the intended open-access use;
- current weather variables;
- hourly and daily forecast variables;
- explicit timezone selection;
- ISO-style timestamps;
- metric units suitable for Helsinki;
- attribution-compatible public portfolio use;
- a lightweight frontend-only implementation.

### 4.3 Provider limitations

Open-Meteo exposes weather-model data. The product must not imply that every “current” field is a physical sensor reading at Oodi.

Required wording:

- **Current Weather**
- **Current Public Weather Data**
- **Forecast**
- **Weather model timestamp**
- **Latest weather update**

Restricted wording until technically proven by response semantics:

- Live Weather
- Real-time weather sensor
- Weather measured at Oodi
- On-site weather
- Oodi weather station

### 4.4 Provider fallback

No second weather provider shall be implemented in Stage 3.

A provider abstraction may be used, but Stage 3 remains single-provider.

---

## 5. Oodi location configuration

Weather requests shall use the central Oodi configuration already created in Stage 2.

Preferred coordinates:

```text
latitude: 60.1738
longitude: 24.9381
timezone: Europe/Helsinki
```

The implementation shall not duplicate coordinates as unrelated literals.

The response grid-cell coordinates may differ slightly from the requested coordinates. The normalized metadata shall preserve both when the provider returns them.

---

## 6. Scope

### 6.1 Included

Stage 3 includes:

1. Open-Meteo endpoint configuration
2. Request construction
3. Current weather fields
4. Short hourly forecast
5. Compact daily forecast
6. Runtime response validation
7. Unit validation and normalization
8. Weather-code mapping
9. Timestamp and timezone handling
10. Model versus observation terminology
11. Weather repository
12. In-memory cache
13. In-flight request deduplication
14. Force refresh
15. Timeout, abort and typed errors
16. Localized developer verification UI
17. Independent loading and error handling
18. Provider attribution metadata
19. Tests and fixtures
20. Weather ADR
21. Stage 3 closure evidence

### 6.2 Excluded

Stage 3 shall not implement:

- final Overview design;
- final dashboard;
- final weather card styling;
- weather animations;
- charts;
- historical weather;
- utility-weather correlation;
- causal weather insights;
- heating-degree days;
- cooling-degree days;
- climate analysis;
- air quality;
- UV exposure analysis;
- pollen;
- severe-weather alerting;
- geolocation;
- user-selected cities;
- multi-building support;
- backend proxy;
- database;
- commercial provider failover;
- conceptual IoT;
- final Data Transparency page;
- Stage 4 information architecture.

A minimal developer verification section is permitted.

---

## 7. Data classification

All Stage 3 values must use:

```ts
type WeatherDataClassification = 'current-public-weather-data';
```

Forecast values must additionally be classified as forecast.

```ts
type WeatherTemporalClass = 'current' | 'hourly-forecast' | 'daily-forecast';
```

The interface must clearly distinguish:

- current/modelled weather context;
- future forecast;
- Nuuka public building data;
- cached public building snapshot;
- conceptual IoT data.

Weather data must never reuse the Nuuka classification.

---

## 8. Required weather fields

### 8.1 Current weather

Minimum required current variables:

```text
temperature_2m
apparent_temperature
relative_humidity_2m
precipitation
weather_code
cloud_cover
wind_speed_10m
wind_direction_10m
wind_gusts_10m
is_day
```

Optional:

```text
surface_pressure
```

### 8.2 Hourly forecast

Minimum hourly variables:

```text
temperature_2m
apparent_temperature
relative_humidity_2m
precipitation_probability
precipitation
weather_code
cloud_cover
wind_speed_10m
wind_gusts_10m
```

Required forecast horizon:

```text
next 24 hours
```

The request may retrieve more than 24 hours, but the repository shall select the next 24 valid hourly points from the effective current reference time.

### 8.3 Daily forecast

Minimum daily variables:

```text
weather_code
temperature_2m_max
temperature_2m_min
apparent_temperature_max
apparent_temperature_min
precipitation_sum
precipitation_probability_max
wind_speed_10m_max
wind_gusts_10m_max
sunrise
sunset
```

Required compact horizon:

```text
current day plus next 2 days
```

---

## 9. Proposed request

```text
GET https://api.open-meteo.com/v1/forecast
  ?latitude=60.1738
  &longitude=24.9381
  &current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day
  &hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m
  &daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset
  &timezone=Europe/Helsinki
  &forecast_days=3
```

Use `URL` and `URLSearchParams`.

---

## 10. Technical constraints

1. Remain a Vite + React + TypeScript browser application.
2. No API secret shall be introduced.
3. No backend shall be added unless browser access is proven impossible.
4. Reuse Stage 2 cache and repository principles where appropriate.
5. Weather failures must not break Nuuka utility data.
6. Nuuka failures must not block weather.
7. External JSON must be treated as `unknown`.
8. Runtime validation is mandatory.
9. No generic provider SDK is required.
10. Normal tests must remain network-independent.
11. Existing Stage 2 tests must continue to pass.
12. No Stage 2 contract may be weakened for weather integration.

---

## 11. Proposed module structure

```text
src/
  data/
    weather/
      weatherTypes.ts
      weatherDefinitions.ts
      weatherEndpoints.ts
      weatherClient.ts
      weatherValidation.ts
      normalizeWeather.ts
      weatherCode.ts
      weatherCache.ts
      weatherRepository.ts
      fixtures/
        openMeteo-success.json
        openMeteo-partial.json
        openMeteo-error.json
        openMeteo-invalid.json
      *.test.ts

docs/
  decisions/
    ADR-002-weather-provider-and-time-semantics.md

review-artifacts/
  stage3-closure/
```

Equivalent naming is acceptable if the repository has a stronger convention.

---

## 12. Internal repository API

```ts
export interface WeatherRequest {
  refresh?: 'default' | 'force';
  signal?: AbortSignal;
}

export interface WeatherRepository {
  getWeather(request?: WeatherRequest): Promise<WeatherResult>;
  invalidate(): void;
}
```

The application-facing layer must not import Open-Meteo raw-response types.

---

## 13. Core normalized contracts

```ts
export type TemperatureUnit = 'celsius';
export type WindSpeedUnit = 'km/h';
export type PrecipitationUnit = 'mm';
export type HumidityUnit = 'percent';
export type PressureUnit = 'hPa';
export type DirectionUnit = 'degree';

export interface CurrentWeather {
  timestamp: string;
  sourceTimestamp: string;
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  precipitationMm: number;
  weatherCode: number;
  condition: WeatherCondition;
  cloudCoverPercent: number;
  windSpeedKmh: number;
  windDirectionDegrees: number;
  windGustKmh: number;
  isDay: boolean;
}

export interface HourlyWeatherPoint {
  timestamp: string;
  sourceTimestamp: string;
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  precipitationProbabilityPercent: number | null;
  precipitationMm: number;
  weatherCode: number;
  condition: WeatherCondition;
  cloudCoverPercent: number;
  windSpeedKmh: number;
  windGustKmh: number;
}

export interface DailyWeatherPoint {
  date: string;
  sourceDate: string;
  weatherCode: number;
  condition: WeatherCondition;
  temperatureMaxC: number;
  temperatureMinC: number;
  apparentTemperatureMaxC: number;
  apparentTemperatureMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityMaxPercent: number | null;
  windSpeedMaxKmh: number;
  windGustMaxKmh: number;
  sunrise: string;
  sunset: string;
}
```

### 13.1 Weather condition

```ts
export type WeatherConditionId =
  | 'clear'
  | 'mainly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'rime-fog'
  | 'drizzle'
  | 'freezing-drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'snow-grains'
  | 'rain-showers'
  | 'snow-showers'
  | 'thunderstorm'
  | 'thunderstorm-hail'
  | 'unknown';

export interface WeatherCondition {
  id: WeatherConditionId;
  label: string;
}
```

### 13.2 Provider metadata

```ts
export type WeatherOrigin = 'network' | 'memory-cache';

export interface WeatherProviderMetadata {
  provider: 'Open-Meteo';
  endpoint: string;
  requestedLatitude: number;
  requestedLongitude: number;
  responseLatitude: number;
  responseLongitude: number;
  elevationMeters: number | null;
  timezone: 'Europe/Helsinki';
  timezoneAbbreviation: string | null;
  utcOffsetSeconds: number;
  generationTimeMs: number | null;
  retrievedAt: string;
  origin: WeatherOrigin;
  attributionLabel: string;
  attributionUrl: string;
}
```

### 13.3 Weather package

```ts
export interface WeatherPackage {
  classification: 'current-public-weather-data';
  current: CurrentWeather;
  hourly: HourlyWeatherPoint[];
  daily: DailyWeatherPoint[];
  provider: WeatherProviderMetadata;
  qualityNotices: WeatherQualityNotice[];
}

export type WeatherResult =
  | { status: 'success'; weather: WeatherPackage }
  | { status: 'partial'; weather: WeatherPackage; message: string }
  | { status: 'empty'; message: string; provider?: Partial<WeatherProviderMetadata> }
  | { status: 'error'; error: WeatherDataError; previousWeather?: WeatherPackage };
```

---

## 14. Errors and quality notices

```ts
export type WeatherDataErrorCode =
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'UNEXPECTED_UNIT'
  | 'MISSING_CURRENT'
  | 'MISSING_HOURLY'
  | 'MISSING_DAILY'
  | 'UNKNOWN';

export interface WeatherDataError {
  code: WeatherDataErrorCode;
  message: string;
  retryable: boolean;
  statusCode?: number;
  cause?: unknown;
}

export type WeatherQualityNoticeCode =
  | 'CURRENT_TIMESTAMP_DELAYED'
  | 'HOURLY_FORECAST_PARTIAL'
  | 'DAILY_FORECAST_PARTIAL'
  | 'UNKNOWN_WEATHER_CODE'
  | 'OPTIONAL_FIELD_MISSING'
  | 'RESPONSE_COORDINATE_DIFFERENCE'
  | 'UNEXPECTED_TIMEZONE'
  | 'UNIT_ALIAS_NORMALIZED'
  | 'CURRENT_IS_MODELLED_CONTEXT';

export interface WeatherQualityNotice {
  code: WeatherQualityNoticeCode;
  message: string;
  count?: number;
}
```

Unknown weather codes should degrade to `unknown` with a notice rather than fail the whole response.

---

## 15. Runtime validation

Treat the response as `unknown`.

Validate:

- top-level object;
- latitude and longitude;
- timezone and UTC offset;
- current object and units;
- hourly arrays and units;
- daily arrays and units;
- equal array lengths;
- finite numeric values;
- valid timestamps;
- nullable precipitation probability where applicable.

Rules:

1. Reject unusable top-level payloads.
2. Reject missing required current fields.
3. Permit partial hourly or daily data when current is valid.
4. Drop invalid forecast points individually where safe.
5. Record missing optional data.
6. Do not spread raw unknown objects into domain types.
7. Preserve sanitized fixtures from actual responses.
8. Do not accept unexpected units silently.

A lightweight local validator is preferred unless complexity clearly justifies another dependency.

---

## 16. Unit validation

Expected units:

| Field | Expected provider unit |
|---|---|
| temperature | °C |
| apparent temperature | °C |
| relative humidity | % |
| precipitation | mm |
| wind speed | km/h |
| wind direction | ° |
| pressure | hPa |

Unexpected units must not be silently reinterpreted.

---

## 17. Timestamp and timezone strategy

Always request:

```text
timezone=Europe/Helsinki
```

Canonical timestamps:

```text
YYYY-MM-DDTHH:mm:ss
```

Rules:

- do not append `Z` to Helsinki wall time;
- preserve the original value as `sourceTimestamp`;
- preserve timezone, abbreviation and UTC offset;
- distinguish provider timestamp from retrieval timestamp;
- do not describe provider current values as Oodi sensor readings;
- test spring-forward and autumn DST transitions.

Reuse Stage 2 time helpers where appropriate without forcing weather into Nuuka-specific abstractions.

---

## 18. Current versus forecast semantics

### Current

Provider-supplied current weather context associated with a provider timestamp.

### Hourly forecast

Future or near-current model points for the next 24 hours.

### Daily forecast

Aggregated model forecast for calendar days.

The current timestamp may align with the first hourly point. This does not make the entire hourly sequence current.

---

## 19. Weather-code mapping

Implement deterministic mapping of Open-Meteo/WMO codes.

Requirements:

- map documented codes;
- return a stable internal ID and English label;
- preserve the original code;
- map unknown codes to `unknown`;
- emit `UNKNOWN_WEATHER_CODE`;
- do not throw solely because a new code appears.

No animated icon library is required.

---

## 20. Forecast selection

### Hourly

Select the next 24 valid hourly points at or after the normalized current timestamp.

When fewer than 24 are available:

- return available points;
- return `partial`;
- add `HOURLY_FORECAST_PARTIAL`.

### Daily

Select up to 3 valid daily records beginning on the current Helsinki date.

When fewer than 3 are available:

- return available records;
- return `partial`;
- add `DAILY_FORECAST_PARTIAL`.

Do not interpolate or fabricate records.

---

## 21. Freshness

Preserve:

- provider current timestamp;
- retrieval timestamp.

```ts
export interface WeatherFreshness {
  sourceTimestamp: string;
  retrievedAt: string;
  ageMinutesAtRetrieval: number | null;
}
```

Default label:

```text
Current Weather
```

Do not use `Live Weather` in Stage 3 without a later explicit product decision.

---

## 22. Cache and concurrency

Use in-memory cache only.

### Cache identity

Include:

- provider;
- latitude;
- longitude;
- timezone;
- current variable-set version;
- hourly variable-set version;
- daily variable-set version;
- forecast horizon;
- strategy version.

Suggested strategy:

```text
open-meteo-v1-current-24h-3d
```

### TTL

Recommended:

```text
10 minutes
```

Valid empty result:

```text
2 minutes
```

### Provenance

First successful request:

```text
origin: network
```

Completed cache hit:

```text
origin: memory-cache
```

Preserve original source and retrieval timestamps.

### Concurrency

Identical active requests share one promise.

Caller abort must not terminate a shared request needed by another caller.

### Force refresh

Force refresh bypasses completed cache, preserves variable sets and horizon, and returns `network` on success.

---

## 23. Timeout, retry and abort

Timeout:

```text
10 seconds
```

Maximum one retry for:

- network failure;
- 429;
- 502;
- 503;
- 504.

Do not retry:

- invalid schema;
- invalid JSON;
- unit mismatch;
- normal 4xx;
- caller abort.

Caller abort returns `ABORTED`.

---

## 24. No persistent weather snapshot

Stage 3 shall not create a versioned weather snapshot.

Reasons:

- weather becomes obsolete quickly;
- old weather could be mistaken for current context;
- Nuuka snapshot resilience already protects the building-data demonstration;
- an honest weather-unavailable state is safer.

On failure:

- preserve Nuuka data;
- show weather error independently;
- optionally expose `previousWeather`;
- never present old weather as current.

---

## 25. Attribution

Required user-facing attribution:

```text
Weather data by Open-Meteo
```

Required target:

```text
https://open-meteo.com/
```

Developer verification must show:

- provider;
- attribution label;
- provider link.

Do not imply endorsement.

---

## 26. Independent source isolation

Weather and Nuuka require independent:

- repository calls;
- loading states;
- error states;
- cache entries;
- refresh actions;
- provenance;
- timestamps.

Weather failure must not activate Nuuka snapshot fallback or clear utility data.

Nuuka failure must not block weather.

---

## 27. Future alignment with Nuuka

Stage 3 shall not implement correlation.

It must expose:

- current weather timestamp;
- hourly forecast range;
- daily forecast range;
- timezone;
- retrieval timestamp.

Future UI must not compare current weather with old Nuuka values as though simultaneous.

---

## 28. Developer verification view

The Stage 3 verification section must display:

- provider;
- attribution;
- requested and response coordinates;
- timezone and UTC offset;
- retrieval timestamp;
- origin;
- current weather timestamp;
- current temperature;
- apparent temperature;
- humidity;
- precipitation;
- weather code and mapped condition;
- cloud cover;
- wind speed, direction and gust;
- day/night;
- hourly point count and range;
- daily point count and range;
- quality notices;
- loading, partial and error states;
- cache hit;
- force refresh.

Required labels:

```text
Stage 3 developer verification
Not the final dashboard
Current public weather data
```

Do not add final cards, charts, navigation, architectural hero, animations or insights.

---

## 29. Testing requirements

Required test groups:

1. Endpoint construction
2. Variable-set configuration
3. Oodi coordinate reuse
4. Top-level validation
5. Current validation
6. Unit validation
7. Hourly array-length validation
8. Daily array-length validation
9. Timestamp canonicalization
10. Helsinki timezone preservation
11. DST handling
12. Weather-code mapping
13. Unknown weather code
14. Current normalization
15. Hourly normalization
16. Daily normalization
17. Next-24-hour selection
18. Three-day selection
19. Partial hourly
20. Partial daily
21. Unexpected unit
22. Invalid JSON
23. Invalid schema
24. HTTP mapping
25. Timeout
26. Abort
27. Retry
28. Cache key stability
29. Cache TTL
30. Memory-cache provenance
31. Force-refresh provenance
32. In-flight deduplication
33. Previous weather on refresh failure
34. Valid empty response
35. Attribution metadata
36. Stage 2 regression

Fixtures shall be derived from authentic Open-Meteo responses and sanitized.

Normal tests must remain network-independent.

Optional live smoke test must be manual or opt-in.

---

## 30. ADR requirement

Create:

```text
docs/decisions/ADR-002-weather-provider-and-time-semantics.md
```

Record:

1. Why Open-Meteo was selected
2. Why browser-side access is retained
3. Why no secret is used
4. Why `Current Weather` is preferred over `Live Weather`
5. Why values are model/current context, not Oodi sensor readings
6. Why Helsinki timezone is explicit
7. Why provider and retrieval timestamps are separate
8. Why weather has independent cache/error state
9. Why no persistent weather snapshot is used
10. Why Stage 3 excludes correlation
11. Attribution and licensing obligations
12. Validation approach

---

## 31. Files allowed to change

Codex may add or modify:

- weather modules;
- weather tests and fixtures;
- Stage 3 developer verification UI;
- package scripts when needed;
- ADR-002;
- Stage 3 documentation.

Avoid unrelated changes to:

- Nuuka normalization;
- Nuuka fallback;
- Nuuka snapshots;
- final visual design;
- Stage 4 information architecture;
- conceptual IoT;
- final charts;
- deployment.

Any Stage 2 change requires justification and regression tests.

---

## 32. Implementation sequence

### Step 1 — Assessment

- read PRD;
- read Stage 2 and Stage 3 specs;
- read ADR-001;
- inspect repository;
- run baseline tests, typecheck, lint and build;
- confirm clean Git state.

### Step 2 — Provider verification

- verify official Open-Meteo parameters;
- run one manual Oodi request;
- confirm browser access;
- inspect units, timestamps, timezone and schema;
- save a sanitized fixture.

### Step 3 — Planning mode

Before editing, report:

- module map;
- file list;
- dependency changes;
- live response findings;
- timestamp semantics;
- cache design;
- tests;
- deviations.

Stop for review.

### Step 4 — Contracts and definitions

Implement weather types, units, conditions, notices, errors and metadata.

### Step 5 — Endpoint and client

Implement URL builder, timeout, retry, abort and error mapping.

### Step 6 — Validation

Implement current, hourly, daily, unit and metadata validators.

### Step 7 — Normalization

Implement timestamps, weather codes, forecast selection and notices.

### Step 8 — Cache and repository

Implement cache, TTL, dedupe, force refresh, previous weather and invalidation.

### Step 9 — Developer verification

Add a minimal verification section only.

### Step 10 — ADR

Create ADR-002 after decisions are confirmed.

### Step 11 — Validation

Run tests, typecheck, lint, build and optional smoke test.

### Step 12 — Closure review

Test network, cache, force refresh, provider failure, timeout, partial response, unknown code and Nuuka/weather independence.

---

## 33. Acceptance criteria

1. Open-Meteo is centralized.
2. Oodi coordinates and `Europe/Helsinki` are used.
3. Current conditions include required fields.
4. Next 24 hourly points are returned when available.
5. Up to 3 daily records are returned.
6. Provider JSON is validated.
7. Units are verified.
8. Helsinki timestamps are preserved without false UTC conversion.
9. Original timestamps are preserved.
10. Default label is `Current Weather`.
11. Weather is not represented as an Oodi sensor.
12. Attribution is present.
13. Weather codes degrade safely.
14. Weather state is independent from Nuuka.
15. Cache works.
16. Cache hits return `memory-cache`.
17. Force refresh returns `network` on success.
18. In-flight requests are deduplicated.
19. Errors are typed and isolated.
20. No stale persistent weather snapshot is used.
21. Partial forecast is explicit.
22. No utility-weather correlation is implemented.
23. Developer verification exposes the contract.
24. Offline tests pass.
25. Typecheck, lint and build pass.
26. Stage 2 remains green.
27. ADR-002 is present.
28. No Stage 4+ work is introduced.

---

## 34. Definition of done

Stage 3 is complete when:

- all acceptance criteria pass;
- Stage 2 remains green;
- current, hourly and daily contracts work;
- timestamps and provider semantics are transparent;
- cache, force refresh and error isolation are proven;
- attribution is included;
- no stale weather snapshot is used;
- closure review is approved;
- a separate Stage 3 commit is created only after review;
- push occurs only after explicit approval.

Suggested commit:

```text
feat(weather): implement Stage 3 Open-Meteo integration
```

---

## 35. Instructions for Codex

Before editing:

1. Read the PRD.
2. Read Stage 2 spec and ADR-001.
3. Read this spec.
4. Inspect the repository.
5. Run baseline checks.
6. Verify Open-Meteo.
7. Produce a plan.
8. Stop for review.

During implementation:

- do not weaken Stage 2;
- do not add a backend;
- do not introduce secrets;
- preserve Helsinki timestamps;
- do not use `Live Weather` by default;
- do not present model data as an Oodi sensor reading;
- do not implement correlation;
- do not build final UI;
- keep weather failure isolated;
- report schema discrepancies.

After implementation:

- run all checks;
- provide changed files;
- provide fixture provenance;
- show cache and timestamp evidence;
- show error-isolation evidence;
- disclose limitations;
- wait for approval before commit.

---

## 36. Open implementation decisions

Codex may resolve these during planning but must document them:

1. Exact current-field availability
2. Exact timestamp precision
3. Whether pressure remains optional
4. Whether `forecast_days=3` supplies enough next-24-hour points late in the day
5. Whether `forecast_hours` or a larger day window is preferable
6. Handling of null precipitation probability
7. Local validator structure
8. Cache TTL constant location
9. Shared abort behaviour
10. Verification-view placement
11. Exact attribution presentation
12. Whether `CURRENT_IS_MODELLED_CONTEXT` is always emitted

None may weaken the acceptance criteria.

---

## 37. Approval

**Specification status:** Proposed for review  
**Implementation authorization:** Not yet granted  

Approval authorizes Stage 3 Planning Mode only. Code changes require a separate explicit instruction after the Codex plan is reviewed.
