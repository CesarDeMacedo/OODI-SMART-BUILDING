import type { NuukaEnergyRow, NuukaErrorPayload } from './nuukaTypes'

export type NuukaEnergyValidationResult =
  | { kind: 'rows'; rows: NuukaEnergyRow[]; invalidRowCount: number }
  | { kind: 'nuuka-error'; error: NuukaErrorPayload }
  | { kind: 'invalid-schema'; message: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNuukaErrorPayload(value: unknown): value is NuukaErrorPayload {
  return isRecord(value) && typeof value.errorCode === 'string'
}

function validateRow(value: unknown): NuukaEnergyRow | null {
  if (!isRecord(value)) {
    return null
  }

  if (
    typeof value.timestamp !== 'string' ||
    typeof value.value !== 'number' ||
    !Number.isFinite(value.value) ||
    typeof value.unit !== 'string'
  ) {
    return null
  }

  return {
    timestamp: value.timestamp,
    value: value.value,
    unit: value.unit,
    reportingGroup:
      typeof value.reportingGroup === 'string' || value.reportingGroup === null
        ? value.reportingGroup
        : undefined,
    locationName:
      typeof value.locationName === 'string' || value.locationName === null
        ? value.locationName
        : undefined,
  }
}

export function validateNuukaEnergyPayload(payload: unknown): NuukaEnergyValidationResult {
  if (Array.isArray(payload)) {
    const rows = payload.map(validateRow).filter((row): row is NuukaEnergyRow => row !== null)

    return {
      kind: 'rows',
      rows,
      invalidRowCount: payload.length - rows.length,
    }
  }

  if (isNuukaErrorPayload(payload)) {
    return {
      kind: 'nuuka-error',
      error: {
        errorCode: payload.errorCode,
        errorNote: typeof payload.errorNote === 'string' ? payload.errorNote : undefined,
      },
    }
  }

  return {
    kind: 'invalid-schema',
    message: 'Nuuka energy payload was neither an array nor a Nuuka error object.',
  }
}
