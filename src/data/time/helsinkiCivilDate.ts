import type { ProductPeriod } from '../utilities/utilitySeries'

type CivilDate = {
  year: number
  month: number
  day: number
}

const HELSINKI_TIME_ZONE = 'Europe/Helsinki'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatCivilDate(date: CivilDate) {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function addDays(date: CivilDate, days: number): CivilDate {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day))
  utc.setUTCDate(utc.getUTCDate() + days)
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  }
}

function subtractMonths(date: CivilDate, months: number): CivilDate {
  const monthIndex = date.year * 12 + (date.month - 1) - months
  const year = Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  const day = Math.min(date.day, daysInMonth(year, month))

  return { year, month, day }
}

export function getHelsinkiCivilDate(date: Date): CivilDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: HELSINKI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type: string) => {
    const part = parts.find((candidate) => candidate.type === type)
    if (!part) {
      throw new Error(`Unable to format Helsinki date part: ${type}`)
    }
    return Number(part.value)
  }

  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
  }
}

export function toHelsinkiDateString(date: Date) {
  return formatCivilDate(getHelsinkiCivilDate(date))
}

export function getRequestedWindowForPeriod(period: ProductPeriod, end = new Date()) {
  const civilEnd = getHelsinkiCivilDate(end)
  const civilStart =
    period === '12m'
      ? subtractMonths(civilEnd, 12)
      : addDays(civilEnd, period === '24h' ? -1 : -30)

  return {
    start: formatCivilDate(civilStart),
    end: formatCivilDate(civilEnd),
  }
}
