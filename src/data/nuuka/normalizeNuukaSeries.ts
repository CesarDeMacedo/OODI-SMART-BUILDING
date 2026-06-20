import { getUtilityDefinition } from '../utilities/utilityDefinitions'
import type {
  DataQualityNotice,
  Granularity,
  UtilityDataPoint,
  UtilityId,
  UtilityUnit,
} from '../utilities/utilitySeries'
import {
  canonicalizeSourceTimestamp,
  compareCanonicalTimestamps,
} from '../time/sourceTimestamp'
import type { NuukaEnergyRow } from './nuukaTypes'

type NormalizeNuukaRowsInput = {
  utility: UtilityId
  granularity: Granularity
  rows: NuukaEnergyRow[]
}

type NormalizeNuukaRowsResult = {
  unit: UtilityUnit
  points: UtilityDataPoint[]
  latestReading: UtilityDataPoint | null
  qualityNotices: DataQualityNotice[]
}

function addNotice(
  notices: DataQualityNotice[],
  notice: DataQualityNotice,
) {
  const existing = notices.find(
    (candidate) =>
      candidate.code === notice.code && candidate.message === notice.message,
  )

  if (existing) {
    existing.count = (existing.count ?? 1) + (notice.count ?? 1)
  } else {
    notices.push({ ...notice })
  }
}

function normalizeUnit(
  sourceUnit: string,
  utility: UtilityId,
  notices: DataQualityNotice[],
): UtilityUnit | null {
  const definition = getUtilityDefinition(utility)
  const matched = definition.sourceUnitAliases.some(
    (alias) => alias.toLowerCase() === sourceUnit.toLowerCase(),
  )

  if (!matched) {
    addNotice(notices, {
      code: 'UNEXPECTED_UNIT',
      message: `Unexpected Nuuka unit "${sourceUnit}" for ${definition.displayName}.`,
      count: 1,
    })
    return null
  }

  if (sourceUnit !== definition.canonicalUnit) {
    addNotice(notices, {
      code: 'UNIT_ALIAS_NORMALIZED',
      message: `Nuuka unit "${sourceUnit}" was normalized to "${definition.canonicalUnit}".`,
      count: 1,
    })
  }

  return definition.canonicalUnit
}

function dedupePoints(
  points: UtilityDataPoint[],
  notices: DataQualityNotice[],
) {
  const byTimestamp = new Map<string, UtilityDataPoint>()
  let duplicateCount = 0

  for (const point of points) {
    if (byTimestamp.has(point.timestamp)) {
      duplicateCount += 1
    }
    byTimestamp.set(point.timestamp, point)
  }

  if (duplicateCount > 0) {
    addNotice(notices, {
      code: 'DUPLICATES_RESOLVED',
      message: 'Duplicate timestamps were resolved without fabricating values.',
      count: duplicateCount,
    })
  }

  return [...byTimestamp.values()].sort((left, right) =>
    compareCanonicalTimestamps(left.timestamp, right.timestamp),
  )
}

export function normalizeNuukaRows(input: NormalizeNuukaRowsInput): NormalizeNuukaRowsResult {
  const definition = getUtilityDefinition(input.utility)
  const notices: DataQualityNotice[] = []
  const points: UtilityDataPoint[] = []
  let negativeCount = 0

  for (const row of input.rows) {
    const unit = normalizeUnit(row.unit, input.utility, notices)
    if (!unit) {
      continue
    }

    let timestamp: string
    let sourceTimestamp: string
    try {
      ;({ timestamp, sourceTimestamp } = canonicalizeSourceTimestamp(row.timestamp))
    } catch {
      addNotice(notices, {
        code: 'INVALID_ROWS_DROPPED',
        message: 'Rows with invalid timestamps were dropped.',
        count: 1,
      })
      continue
    }

    if (input.granularity === 'hourly' && !timestamp.endsWith(':00:00')) {
      addNotice(notices, {
        code: 'NON_HOURLY_TIMESTAMP',
        message: 'An hourly Nuuka series included a minute-level timestamp and it was preserved.',
        count: 1,
      })
    }

    if (row.value < 0) {
      negativeCount += 1
    }

    points.push({
      timestamp,
      sourceTimestamp,
      value: row.value,
    })
  }

  if (negativeCount > 0) {
    addNotice(notices, {
      code: 'NEGATIVE_VALUE_PRESENT',
      message: 'A finite negative source value was preserved; it may represent a correction or adjustment.',
      count: negativeCount,
    })
  }

  const deduped = dedupePoints(points, notices)

  return {
    unit: definition.canonicalUnit,
    points: deduped,
    latestReading: deduped.at(-1) ?? null,
    qualityNotices: notices,
  }
}
