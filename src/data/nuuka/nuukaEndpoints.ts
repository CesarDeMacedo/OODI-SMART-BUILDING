import { oodiConfig } from '../../config/oodi'
import type { Granularity, NuukaReportingGroup } from '../utilities/utilitySeries'

export const NUUKA_BASE_URL = 'https://helsinki-openapi.nuuka.cloud/api/v1.0'

const endpointSegmentByGranularity: Record<Granularity, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  monthly: 'Monthly',
}

export type NuukaEnergyUrlRequest = {
  reportingGroup: NuukaReportingGroup
  granularity: Granularity
  start: string
  end: string
}

export function buildNuukaEnergyUrl(request: NuukaEnergyUrlRequest) {
  const url = new URL(
    `${NUUKA_BASE_URL}/EnergyData/${endpointSegmentByGranularity[request.granularity]}/ListByProperty`,
  )

  url.searchParams.set('Record', 'LocationName')
  url.searchParams.set('SearchString', oodiConfig.nuuka.locationName)
  url.searchParams.set('ReportingGroup', request.reportingGroup)
  url.searchParams.set('StartTime', request.start)
  url.searchParams.set('EndTime', request.end)

  if (request.granularity === 'monthly') {
    url.searchParams.set('Normalization', 'false')
  }

  return url.toString()
}
