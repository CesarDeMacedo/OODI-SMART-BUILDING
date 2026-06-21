import type { DataClassificationKind } from '../layout/DataStatus'

export function TransparencyRow({
  kind,
  title,
  source,
  status,
}: {
  kind: DataClassificationKind
  title: string
  source: string
  status: string
}) {
  return (
    <div className="transparency-row" data-classification={kind}>
      <div>
        <strong>{title}</strong>
        <span>{source}</span>
      </div>
      <span>{status}</span>
    </div>
  )
}
