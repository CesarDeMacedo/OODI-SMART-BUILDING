export interface NuukaEnergyRow {
  timestamp: string
  value: number
  unit: string
  reportingGroup?: string | null
  locationName?: string | null
}

export interface NuukaErrorPayload {
  errorNote?: string
  errorCode: string
}
