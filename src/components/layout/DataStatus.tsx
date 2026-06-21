export type ModuleState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'partial'; data: T; message: string }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string; retryable: boolean }

export type DataClassificationKind =
  | 'public-utility'
  | 'current-weather'
  | 'conceptual'
  | 'cached-public-snapshot'

export function DataStatus<T>({ state }: { state: ModuleState<T> }) {
  if (state.status === 'loading') {
    return <p className="data-status data-status--loading">Loading</p>
  }

  if (state.status === 'success') {
    return <p className="data-status data-status--success">Available</p>
  }

  if (state.status === 'partial') {
    return <p className="data-status data-status--partial">{state.message}</p>
  }

  if (state.status === 'empty') {
    return <p className="data-status data-status--empty">{state.message}</p>
  }

  return <p className="data-status data-status--error">{state.message}</p>
}

export function ClassificationBadge({
  kind,
  label,
}: {
  kind: DataClassificationKind
  label: string
}) {
  return (
    <span className={`classification-badge classification-badge--${kind}`}>
      {label}
    </span>
  )
}
