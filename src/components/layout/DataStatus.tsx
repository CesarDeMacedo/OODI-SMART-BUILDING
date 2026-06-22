export type ModuleState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'partial'; data: T; message: string }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string; retryable: boolean }
  | { status: 'memory-cache'; message: string }
  | { status: 'cached-public-snapshot'; message: string }
  | { status: 'conceptual'; message: string }

export type DataClassificationKind =
  | 'public-utility'
  | 'current-weather'
  | 'conceptual'
  | 'cached-public-snapshot'
  | 'partial-data'
  | 'unavailable'

const statusLabels: Record<ModuleState<unknown>['status'], { label: string; icon: string }> = {
  loading: { label: 'Loading', icon: '...' },
  success: { label: 'Available', icon: 'ok' },
  partial: { label: 'Partial', icon: '!' },
  empty: { label: 'Empty', icon: '-' },
  error: { label: 'Error', icon: '!' },
  'memory-cache': { label: 'Memory cache', icon: 'c' },
  'cached-public-snapshot': { label: 'Cached snapshot', icon: 's' },
  conceptual: { label: 'Conceptual', icon: 'i' },
}

const classificationIcons: Record<DataClassificationKind, string> = {
  'public-utility': 'D',
  'current-weather': 'W',
  conceptual: 'I',
  'cached-public-snapshot': 'C',
  'partial-data': 'P',
  unavailable: '!',
}

export function DataStatus<T>({ state }: { state: ModuleState<T> }) {
  const fallback = statusLabels[state.status]
  const label =
    state.status === 'loading' || state.status === 'success'
      ? fallback.label
      : state.message

  return (
    <p
      className={`data-status data-status--${state.status}`}
      data-state={state.status}
      title={fallback.label}
    >
      <span className="data-status__icon" data-status-icon aria-hidden="true">
        {fallback.icon}
      </span>
      <span>{label}</span>
    </p>
  )
}

export function ClassificationBadge({
  kind,
  label,
}: {
  kind: DataClassificationKind
  label: string
}) {
  return (
    <span
      className={`classification-badge classification-badge--${kind}`}
      data-classification={kind}
    >
      <span className="classification-badge__icon" data-classification-icon aria-hidden="true">
        {classificationIcons[kind]}
      </span>
      <span>{label}</span>
    </span>
  )
}
