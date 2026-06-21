import { utilityDefinitions } from '../data/utilities/utilityDefinitions'

const oodiCoordinates = {
  latitude: '60.1738',
  longitude: '24.9381',
} as const

export const oodiConfig = {
  publicName: 'Helsinki Central Library Oodi',
  address: 'Töölönlahdenkatu 4, Helsinki, Finland',
  nuuka: {
    locationName: '4669 Oodi Helsingin keskustakirjasto',
    propertyCode: '091-002-0014-0005',
    buildingCode: '103534449X',
    purposeOfUse: 'G kirjasto',
    buildingType: 'LibraryMuseumExhibitionHall',
    yearOfIntroduction: '2018-01-01T00:00:00',
    totalArea: 39817,
    heatedArea: 14643,
    volume: 108260,
    latitude: oodiCoordinates.latitude,
    longitude: oodiCoordinates.longitude,
  },
  weather: {
    latitude: Number(oodiCoordinates.latitude),
    longitude: Number(oodiCoordinates.longitude),
    timezone: 'Europe/Helsinki',
  },
  source: {
    provider: 'Nuuka',
    label: 'Nuuka Open API - Helsinki public building data',
    classification: 'real-public-building-data',
  },
  utilities: utilityDefinitions,
} as const
