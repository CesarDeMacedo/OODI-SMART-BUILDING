# Nuuka Discovery Report

Generated at: 2026-06-19T23:15:00.996Z

## Source Endpoints

- Property list: https://helsinki-openapi.nuuka.cloud/api/v1.0/Property/List?Customer=Helsinki
- Property search: https://helsinki-openapi.nuuka.cloud/api/v1.0/Property/Search
- Energy data: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/%7BHourly|Daily|Monthly%7D/ListByProperty
- Swagger: https://helsinki-openapi.nuuka.cloud/swagger/Nuuka%20Open%20API/swagger.json

## Property Discovery

- HTTP status: 200
- Total properties returned: 1809
- Search terms: `Oodi`, `Keskustakirjasto`, `Helsingin keskustakirjasto`, `Töölönlahdenkatu 4`, `Toolonlahdenkatu 4`
- Possible Oodi matches: 1
- Oodi found: Yes
- Exact returned name: 4669 Oodi Helsingin keskustakirjasto
- Property name: 4669 Oodi Helsingin keskustakirjasto
- Property code: 091-002-0014-0005
- Purpose of use: G kirjasto
- Building type: LibraryMuseumExhibitionHall
- Year of introduction: 2018-01-01T00:00:00
- Total area: 39817
- Heated area: 14643
- Volume: 108260
- Latitude: 60.1738
- Longitude: 24.9381

## Reporting Groups Listed On Property

```json
[
  {
    "name": "DistrictCooling",
    "energyType": "DistrictCooling",
    "isTopGroup": true
  },
  {
    "name": "Electricity",
    "energyType": "Electricity",
    "isTopGroup": true
  },
  {
    "name": "Heat",
    "energyType": "Heating",
    "isTopGroup": true
  },
  {
    "name": "OtherMeasurements",
    "energyType": "",
    "isTopGroup": true
  },
  {
    "name": "Water",
    "energyType": "Water",
    "isTopGroup": true
  }
]
```

Note: the Nuuka API uses `DistrictCooling` as the official reporting group. This corresponds to the conceptual "Cooling" group for this project.

## Associated Buildings

```json
[
  {
    "locationName": "4669 Oodi Helsingin keskustakirjasto, 63682 ",
    "propertyName": "4669 Oodi Helsingin keskustakirjasto, 63682 ",
    "propertyCode": "091-002-0014-0005",
    "buildingCode": "103534449X",
    "yearOfIntroduction": "2018-01-01T00:00:00",
    "purposeOfUse": "G kirjasto",
    "totalArea": 39817,
    "heatedArea": 14643,
    "volume": 108260,
    "buildingType": "LibraryMuseumExhibitionHall",
    "longitude": "24.9380282",
    "latitude": "60.1742416",
    "reportingGroups": []
  }
]
```

## Complete Property List Matches

```json
[
  {
    "locationName": "4669 Oodi Helsingin keskustakirjasto",
    "propertyName": "4669 Oodi Helsingin keskustakirjasto",
    "propertyCode": "091-002-0014-0005"
  }
]
```

## Complete Detailed Property Search Results

```json
[
  {
    "locationName": "4669 Oodi Helsingin keskustakirjasto",
    "propertyName": "4669 Oodi Helsingin keskustakirjasto",
    "propertyCode": "091-002-0014-0005",
    "yearOfIntroduction": "2018-01-01T00:00:00",
    "purposeOfUse": "G kirjasto",
    "totalArea": 39817,
    "heatedArea": 14643,
    "volume": 108260,
    "buildingType": "LibraryMuseumExhibitionHall",
    "latitude": "60.1738",
    "longitude": "24.9381",
    "reportingGroups": [
      {
        "name": "DistrictCooling",
        "energyType": "DistrictCooling",
        "isTopGroup": true
      },
      {
        "name": "Electricity",
        "energyType": "Electricity",
        "isTopGroup": true
      },
      {
        "name": "Heat",
        "energyType": "Heating",
        "isTopGroup": true
      },
      {
        "name": "OtherMeasurements",
        "energyType": "",
        "isTopGroup": true
      },
      {
        "name": "Water",
        "energyType": "Water",
        "isTopGroup": true
      }
    ],
    "buildings": [
      {
        "locationName": "4669 Oodi Helsingin keskustakirjasto, 63682 ",
        "propertyName": "4669 Oodi Helsingin keskustakirjasto, 63682 ",
        "propertyCode": "091-002-0014-0005",
        "buildingCode": "103534449X",
        "yearOfIntroduction": "2018-01-01T00:00:00",
        "purposeOfUse": "G kirjasto",
        "totalArea": 39817,
        "heatedArea": 14643,
        "volume": 108260,
        "buildingType": "LibraryMuseumExhibitionHall",
        "longitude": "24.9380282",
        "latitude": "60.1742416",
        "reportingGroups": []
      }
    ]
  }
]
```

## Energy Availability

Recent test window: 2026-05-20 to 2026-06-19. If a recent query returned no records, the script tested monthly historical data from 2018-01-01 to 2026-06-19. For hourly and daily rows, the script then tested the same granularity around the latest monthly timestamp when one was available.

| Reporting Group | Available | Endpoint | Granularity | Unit | Oldest Returned Timestamp | Latest Returned Timestamp | Number of Records | Errors or Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Electricity | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Hourly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2026-05-20&EndTime=2026-06-19 \| monthly probe: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2018-01-01&EndTime=2026-06-19&Normalization=false \| fallback: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Hourly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2026-04-18&EndTime=2026-05-18 | Hourly | kWh | 2026-04-18T00:00:00 | 2026-05-17T02:00:00 | 1848 | Recent Hourly window had no records; same-granularity fallback used around latest monthly timestamp 2026-05-17T00:00:00. |
| Electricity | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2026-05-20&EndTime=2026-06-19 \| monthly probe: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2018-01-01&EndTime=2026-06-19&Normalization=false \| fallback: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2026-04-18&EndTime=2026-05-18 | Daily | kWh | 2026-04-18T00:00:00 | 2026-05-17T00:00:00 | 30 | Recent Daily window had no records; same-granularity fallback used around latest monthly timestamp 2026-05-17T00:00:00. |
| Electricity | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2026-05-20&EndTime=2026-06-19&Normalization=false \| fallback: https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Electricity&StartTime=2018-01-01&EndTime=2026-06-19&Normalization=false | Monthly | kWh | 2018-12-31T00:00:00 | 2026-05-17T00:00:00 | 90 | Recent Monthly window had no records; monthly historical fallback used. |
| Heat | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Hourly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Heat&StartTime=2026-05-20&EndTime=2026-06-19 | Hourly | kWh | 2026-05-20T00:00:00 | 2026-05-31T23:00:00 | 288 | OK |
| Heat | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Heat&StartTime=2026-05-20&EndTime=2026-06-19 | Daily | kWh | 2026-05-20T00:00:00 | 2026-05-31T00:00:00 | 12 | OK |
| Heat | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Heat&StartTime=2026-05-20&EndTime=2026-06-19&Normalization=false | Monthly | kWh | 2026-05-31T00:00:00 | 2026-05-31T00:00:00 | 1 | OK |
| Water | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Hourly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Water&StartTime=2026-05-20&EndTime=2026-06-19 | Hourly | M3 | 2026-05-20T00:00:00 | 2026-06-18T02:40:00 | 4157 | OK |
| Water | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Water&StartTime=2026-05-20&EndTime=2026-06-19 | Daily | M3 | 2026-05-20T00:00:00 | 2026-06-18T00:00:00 | 30 | OK |
| Water | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=Water&StartTime=2026-05-20&EndTime=2026-06-19&Normalization=false | Monthly | M3 | 2026-05-31T00:00:00 | 2026-06-18T00:00:00 | 2 | OK |
| DistrictCooling | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Hourly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=DistrictCooling&StartTime=2026-05-20&EndTime=2026-06-19 | Hourly | kWh | 2026-05-20T00:00:00 | 2026-05-31T23:00:00 | 288 | OK |
| DistrictCooling | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=DistrictCooling&StartTime=2026-05-20&EndTime=2026-06-19 | Daily | kWh | 2026-05-20T00:00:00 | 2026-05-31T00:00:00 | 12 | OK |
| DistrictCooling | Yes | https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Monthly/ListByProperty?Record=LocationName&SearchString=4669+Oodi+Helsingin+keskustakirjasto&ReportingGroup=DistrictCooling&StartTime=2026-05-20&EndTime=2026-06-19&Normalization=false | Monthly | kWh | 2026-05-31T00:00:00 | 2026-05-31T00:00:00 | 1 | OK |

## CORS

A command-line preflight/header inspection on 2026-06-19 returned `Access-Control-Allow-Origin: *`. The temporary React page in `src/App.tsx` performs the browser-side validation directly and displays any CORS or network error clearly.

## Error Handling

The discovery script uses request timeouts, logs every endpoint, validates JSON parsing, handles empty response bodies, records API 404 payloads as notes, and does not use secrets or API keys.
