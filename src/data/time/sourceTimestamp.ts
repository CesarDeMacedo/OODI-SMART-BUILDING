const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const MINUTE_PRECISION = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
const SECOND_PRECISION = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/

export type CanonicalSourceTimestamp = {
  timestamp: string
  sourceTimestamp: string
}

function assertValidDateParts(
  year: string,
  month: string,
  day: string,
  hour = '00',
  minute = '00',
  second = '00',
) {
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  const h = Number(hour)
  const min = Number(minute)
  const s = Number(second)
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()

  if (m < 1 || m > 12 || d < 1 || d > lastDay || h > 23 || min > 59 || s > 59) {
    throw new Error(`Invalid Nuuka timestamp: ${year}-${month}-${day}T${hour}:${minute}:${second}`)
  }
}

export function canonicalizeSourceTimestamp(sourceTimestamp: string): CanonicalSourceTimestamp {
  const trimmed = sourceTimestamp.trim()
  const secondMatch = SECOND_PRECISION.exec(trimmed)
  const minuteMatch = MINUTE_PRECISION.exec(trimmed)
  const dateMatch = DATE_ONLY.exec(trimmed)

  if (secondMatch) {
    const [, year, month, day, hour, minute, second] = secondMatch
    assertValidDateParts(year, month, day, hour, minute, second)
    return { timestamp: `${year}-${month}-${day}T${hour}:${minute}:${second}`, sourceTimestamp }
  }

  if (minuteMatch) {
    const [, year, month, day, hour, minute] = minuteMatch
    assertValidDateParts(year, month, day, hour, minute)
    return { timestamp: `${year}-${month}-${day}T${hour}:${minute}:00`, sourceTimestamp }
  }

  if (dateMatch) {
    const [, year, month, day] = dateMatch
    assertValidDateParts(year, month, day)
    return { timestamp: `${year}-${month}-${day}T00:00:00`, sourceTimestamp }
  }

  throw new Error(`Invalid Nuuka timestamp: ${sourceTimestamp}`)
}

export function compareCanonicalTimestamps(left: string, right: string) {
  return left.localeCompare(right)
}

export function compareSourceTimestamps(left: string, right: string) {
  return Math.sign(
    compareCanonicalTimestamps(
      canonicalizeSourceTimestamp(left).timestamp,
      canonicalizeSourceTimestamp(right).timestamp,
    ),
  )
}
