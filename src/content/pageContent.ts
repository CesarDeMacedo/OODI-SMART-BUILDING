import type { DataClassificationKind } from '../components/layout/DataStatus'

export const classificationLabels: Record<DataClassificationKind, { label: string; description: string }> = {
  'public-utility': {
    label: 'Public Building Data',
    description: 'Real public utility data from the Helsinki Nuuka Open API.',
  },
  'current-weather': {
    label: 'Current Public Weather Data',
    description: 'Open-Meteo model context for Oodi coordinates, not an Oodi sensor.',
  },
  conceptual: {
    label: 'Conceptual IoT Layer',
    description: 'Illustrative prototype content, not connected to Oodi systems.',
  },
  'cached-public-snapshot': {
    label: 'Cached Public Data Snapshot',
    description: 'Previously retrieved authentic Nuuka data used only as labelled fallback.',
  },
  'partial-data': {
    label: 'Partial Data',
    description: 'A module has usable data with reduced coverage or source limitations.',
  },
  unavailable: {
    label: 'Unavailable / Error',
    description: 'A local module cannot currently display usable source data.',
  },
}

export const prototypeDisclaimer =
  'Independent portfolio prototype. Not affiliated with Oodi, the City of Helsinki, Nuuka or WSP.'

export const conceptualModules = [
  {
    title: 'HVAC Systems',
    status: 'Conceptual',
    description: 'System layer reserved for future illustrative ventilation and heating context.',
  },
  {
    title: 'Indoor Comfort',
    status: 'Illustrative',
    description: 'Placeholder for experience-prototyping comfort indicators.',
  },
  {
    title: 'Occupancy',
    status: 'Simulated',
    description: 'Future conceptual flow indicators must remain clearly simulated.',
  },
  {
    title: 'Asset Health',
    status: 'Conceptual',
    description: 'No operational equipment status or maintenance workflow is implied.',
  },
]

export const cautiousInsights = [
  'Utility datasets update independently, so each card keeps its own latest timestamp.',
  'Current weather is contextual and should not be treated as simultaneous with older utility records.',
  'Conceptual intelligence modules are illustrative and are separated from public utility data.',
]
