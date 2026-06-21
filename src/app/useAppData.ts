import { useEffect, useState } from 'react'
import { utilityDefinitions } from '../data/utilities/utilityDefinitions'
import { utilityRepository } from '../data/utilities/utilityRepository'
import type { ProductPeriod, UtilityId, UtilitySeriesResult } from '../data/utilities/utilitySeries'
import { weatherRepository } from '../data/weather/weatherRepository'
import type { WeatherResult } from '../data/weather/weatherTypes'

export interface UtilityLoadState {
  loading: boolean
  result: UtilitySeriesResult | null
}

export interface WeatherLoadState {
  loading: boolean
  result: WeatherResult | null
}

const utilityErrorResult: UtilitySeriesResult = {
  status: 'error',
  error: {
    code: 'UNKNOWN',
    message: 'Unexpected utility data error.',
    retryable: false,
  },
}

const weatherErrorResult: WeatherResult = {
  status: 'error',
  error: {
    code: 'UNKNOWN',
    message: 'Unexpected weather data error.',
    retryable: false,
  },
}

export function useUtilitySeries(utility: UtilityId, period: ProductPeriod) {
  const [refreshVersion, setRefreshVersion] = useState(0)
  const requestKey = `${utility}|${period}|${refreshVersion}`
  const [state, setState] = useState<{ key: string; result: UtilitySeriesResult | null }>({
    key: requestKey,
    result: null,
  })

  useEffect(() => {
    let ignore = false

    utilityRepository
      .getSeries({
        utility,
        period,
        refresh: refreshVersion > 0 ? 'force' : 'default',
      })
      .then((result) => {
        if (!ignore) {
          setState({ key: requestKey, result })
        }
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) {
          setState({ key: requestKey, result: utilityErrorResult })
        }
      })

    return () => {
      ignore = true
    }
  }, [period, refreshVersion, requestKey, utility])

  return {
    loading: state.key !== requestKey || state.result === null,
    result: state.key === requestKey ? state.result : null,
    refresh: () => setRefreshVersion((current) => current + 1),
  }
}

export function useUtilitySummaries(period: ProductPeriod) {
  const [state, setState] = useState<{
    period: ProductPeriod
    results: Partial<Record<UtilityId, UtilitySeriesResult>>
  }>({
    period,
    results: {},
  })

  useEffect(() => {
    let ignore = false

    utilityDefinitions.forEach((definition) => {
      utilityRepository
        .getSeries({ utility: definition.id, period })
        .then((result) => {
          if (!ignore) {
            setState((current) => ({
              period,
              results: {
                ...(current.period === period ? current.results : {}),
                [definition.id]: result,
              },
            }))
          }
        })
        .catch((error) => {
          console.error(error)
          if (!ignore) {
            setState((current) => ({
              period,
              results: {
                ...(current.period === period ? current.results : {}),
                [definition.id]: utilityErrorResult,
              },
            }))
          }
        })
    })

    return () => {
      ignore = true
    }
  }, [period])

  return utilityDefinitions.reduce(
    (next, definition) => {
      const result = state.period === period ? state.results[definition.id] ?? null : null
      return {
        ...next,
        [definition.id]: {
          loading: result === null,
          result,
        },
      }
    },
    {} as Record<UtilityId, UtilityLoadState>,
  )
}

export function useCurrentWeather() {
  const [refreshVersion, setRefreshVersion] = useState(0)
  const requestKey = String(refreshVersion)
  const [state, setState] = useState<{ key: string; result: WeatherResult | null }>({
    key: requestKey,
    result: null,
  })

  useEffect(() => {
    let ignore = false

    weatherRepository
      .getWeather({ refresh: refreshVersion > 0 ? 'force' : 'default' })
      .then((result) => {
        if (!ignore) {
          setState({ key: requestKey, result })
        }
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) {
          setState({ key: requestKey, result: weatherErrorResult })
        }
      })

    return () => {
      ignore = true
    }
  }, [refreshVersion, requestKey])

  return {
    loading: state.key !== requestKey || state.result === null,
    result: state.key === requestKey ? state.result : null,
    refresh: () => setRefreshVersion((current) => current + 1),
  }
}
