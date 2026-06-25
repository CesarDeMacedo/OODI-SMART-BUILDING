import type { UtilityLoadState, WeatherLoadState } from '../../app/useAppData'
import type { UtilityId } from '../../data/utilities/utilitySeries'

export type InsightKind = 'quality' | 'fallback' | 'reading' | 'weather' | 'summary'

export interface InsightItem {
  id: string
  priority: 1 | 2 | 3 | 4 | 5
  kind: InsightKind
  title: string
  body: string
  utility?: UtilityId
}

const UTILITY_ORDER: readonly UtilityId[] = ['electricity', 'heat', 'water', 'districtCooling']
const MAX_ITEMS = 12

const UTILITY_DISPLAY: Record<UtilityId, string> = {
  electricity: 'Electricity',
  heat: 'Heat',
  water: 'Water',
  districtCooling: 'District Cooling',
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Helsinki',
    })
  } catch {
    return iso
  }
}

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/Helsinki',
    })
  } catch {
    return iso
  }
}

export function deriveInsights(
  utilities: Record<UtilityId, UtilityLoadState>,
  weather: WeatherLoadState,
): InsightItem[] {
  const items: InsightItem[] = []

  const utilityRank: Record<string, number> = {}
  UTILITY_ORDER.forEach((id, i) => {
    utilityRank[id] = i
  })

  // Priority 1 — quality notices; Priority 2 — period fallback
  for (const utilityId of UTILITY_ORDER) {
    const state = utilities[utilityId]
    if (!state || state.loading || state.result === null) continue

    const result = state.result
    const label = UTILITY_DISPLAY[utilityId]

    if (result.status === 'error') {
      items.push({
        id: `${utilityId}-error`,
        priority: 1,
        kind: 'quality',
        title: `${label} — Data unavailable`,
        body: result.error.message,
        utility: utilityId,
      })
      continue
    }

    const series = result.series
    const noticeCodesAdded = new Set<string>()
    let qualityCount = 0

    for (const notice of series.qualityNotices) {
      if (qualityCount >= 2) break
      if (noticeCodesAdded.has(notice.code)) continue

      let body: string | null = null

      switch (notice.code) {
        case 'SNAPSHOT_USED':
          body = `${label} is currently served from a cached public snapshot. Live network data was unavailable at the time of loading.`
          break
        case 'DELAYED_SOURCE_DATA':
          body = `${label} source data is delayed. The latest available reading is shown.`
          break
        case 'PARTIAL_WINDOW': {
          const end = series.period.effectiveWindow?.end
          body = `${label} has partial period coverage${end ? ` — data is available up to ${formatDate(end)}` : ''}.`
          break
        }
        case 'EMPTY_REQUESTED_WINDOW':
          body = `${label} returned no data for the requested 30-day period.`
          break
      }

      if (body !== null) {
        items.push({
          id: `${utilityId}-quality-${notice.code}`,
          priority: 1,
          kind: 'quality',
          title: `${label} — Data notice`,
          body,
          utility: utilityId,
        })
        noticeCodesAdded.add(notice.code)
        qualityCount++
      }
    }

    if (
      series.period.isFallback &&
      !noticeCodesAdded.has('SNAPSHOT_USED') &&
      !noticeCodesAdded.has('EMPTY_REQUESTED_WINDOW')
    ) {
      const start = series.period.effectiveWindow?.start
      const end = series.period.effectiveWindow?.end
      const range =
        start && end ? ` (${formatDateShort(start)} – ${formatDateShort(end)})` : ''
      items.push({
        id: `${utilityId}-fallback`,
        priority: 2,
        kind: 'fallback',
        title: `${label} — Latest available period`,
        body: `The requested 30-day window was not fully available. Latest available data is shown${range}.`,
        utility: utilityId,
      })
    }
  }

  // Priority 3 — latest reading
  for (const utilityId of UTILITY_ORDER) {
    const state = utilities[utilityId]
    if (!state || state.loading || state.result === null) continue
    const result = state.result
    if (result.status === 'error') continue

    const series = result.series
    if (!series.latestReading) continue

    const label = UTILITY_DISPLAY[utilityId]
    items.push({
      id: `${utilityId}-latest`,
      priority: 3,
      kind: 'reading',
      title: `${label} — Latest reading`,
      body: `Latest available reading: ${series.latestReading.value.toLocaleString('en-GB', { maximumFractionDigits: 1 })} ${series.unit} as of ${formatDate(series.latestReading.sourceTimestamp)}.`,
      utility: utilityId,
    })
  }

  // Priority 4 — weather context
  const weatherResult = weather.result
  if (
    !weather.loading &&
    weatherResult !== null &&
    (weatherResult.status === 'success' || weatherResult.status === 'partial')
  ) {
    const temp = weatherResult.weather.current.temperatureC

    const heatState = utilities['heat']
    const coolingState = utilities['districtCooling']
    const heatAvailable =
      heatState && !heatState.loading && heatState.result?.status !== 'error'
    const coolingAvailable =
      coolingState && !coolingState.loading && coolingState.result?.status !== 'error'

    if (temp <= 5 && heatAvailable) {
      items.push({
        id: 'weather-heat-context',
        priority: 4,
        kind: 'weather',
        title: 'Weather context — Heat demand',
        body: `Outdoor temperature is ${temp.toFixed(1)}°C (Open-Meteo, Helsinki coordinates). Low outdoor temperature coincides with elevated heat demand context. Weather and utility timestamps are independent.`,
      })
    } else if (temp >= 20 && coolingAvailable) {
      items.push({
        id: 'weather-cooling-context',
        priority: 4,
        kind: 'weather',
        title: 'Weather context — District cooling',
        body: `Outdoor temperature is ${temp.toFixed(1)}°C (Open-Meteo, Helsinki coordinates). Warm outdoor conditions may provide context for district cooling load. Weather and utility timestamps are independent.`,
      })
    } else {
      items.push({
        id: 'weather-general',
        priority: 4,
        kind: 'weather',
        title: 'Weather context',
        body: `Current outdoor temperature is ${temp.toFixed(1)}°C (Open-Meteo, Helsinki coordinates). Weather data is independent of utility timestamps and is not synchronised with Nuuka readings.`,
      })
    }
  }

  // Priority 5 — data source summary
  for (const utilityId of UTILITY_ORDER) {
    const state = utilities[utilityId]
    if (!state || state.loading || state.result === null) continue
    const result = state.result
    if (result.status === 'error') continue

    const series = result.series
    if (series.points.length === 0) continue

    const label = UTILITY_DISPLAY[utilityId]
    const n = series.points.length
    items.push({
      id: `${utilityId}-summary`,
      priority: 5,
      kind: 'summary',
      title: `${label} — Period summary`,
      body: `Helsinki Nuuka Open API returned ${n.toLocaleString('en-GB')} data point${n !== 1 ? 's' : ''} for ${label} over the available period.`,
      utility: utilityId,
    })
  }

  items.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    const aRank = a.utility !== undefined ? (utilityRank[a.utility] ?? 99) : 99
    const bRank = b.utility !== undefined ? (utilityRank[b.utility] ?? 99) : 99
    return aRank - bRank
  })

  return items.slice(0, MAX_ITEMS)
}
