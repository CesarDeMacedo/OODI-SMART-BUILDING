import { useEffect, useMemo, useRef, useState } from 'react'
import { ClassificationBadge } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { mediaAssets } from '../../content/mediaAssets'
import { classificationLabels } from '../../content/pageContent'
import {
  layerInsights,
  layerMeta,
  layerStatusLabels,
  levelMeta,
  levelRegions,
  zoneData,
  type BuildingLevel,
  type IntelligenceLayer,
  type ZoneStatus,
} from '../../data/buildingIntelligence/buildingIntelligenceData'

const LEVELS: BuildingLevel[] = ['all', 'level-1', 'level-2', 'level-3']
const LAYERS: IntelligenceLayer[] = ['occupancy', 'comfort', 'air-quality', 'hvac', 'asset-health']
const LEVEL_KEYS = ['level-1', 'level-2', 'level-3'] as const
const STATUS_KEYS: ZoneStatus[] = ['good', 'moderate', 'attention']

const STATUS_COLOR: Record<ZoneStatus, string> = {
  good: '#3dd9a8',
  moderate: '#f5b800',
  attention: '#f03535',
}

export function BuildingIntelligencePage() {
  const [selectedLevel, setSelectedLevel] = useState<BuildingLevel>('all')
  const [selectedLayer, setSelectedLayer] = useState<IntelligenceLayer>('occupancy')
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const zoneRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    if (!selectedZone) return
    const el = zoneRefs.current.get(selectedZone)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedZone])

  const asset = mediaAssets.buildingIntelligenceIllustration

  // All hotspots for the current layer across all zones (for image overlay)
  const allLayerRecords = useMemo(
    () => zoneData.filter((r) => r.layer === selectedLayer),
    [selectedLayer],
  )

  // Zone records visible in the panel (filtered by level + layer)
  const visibleRecords = useMemo(
    () =>
      zoneData.filter(
        (r) => r.layer === selectedLayer && (selectedLevel === 'all' || r.level === selectedLevel),
      ),
    [selectedLevel, selectedLayer],
  )

  // Summary counts for contextual metrics
  const counts = useMemo(() => {
    const good = visibleRecords.filter((r) => r.status === 'good').length
    const moderate = visibleRecords.filter((r) => r.status === 'moderate').length
    const attention = visibleRecords.filter((r) => r.status === 'attention').length
    return { good, moderate, attention, total: visibleRecords.length }
  }, [visibleRecords])

  const statusLabels = layerStatusLabels[selectedLayer]

  function handleLevelChange(lvl: BuildingLevel) {
    setSelectedLevel(lvl)
    setSelectedZone(null)
  }

  function handleLayerChange(layer: IntelligenceLayer) {
    setSelectedLayer(layer)
    setSelectedZone(null)
  }

  function toggleZone(zoneId: string) {
    setSelectedZone((prev) => (prev === zoneId ? null : zoneId))
  }

  return (
    <main className="page page--intelligence" data-layout="building-intelligence">

      {/* ── Title row ─────────────────────────────────────────────────────── */}
      <div className="bi-title-row">
        <div className="bi-title-row__left">
          <div className="ovw-icon-box ovw-icon-box--conceptual" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1"  y="9.5" width="12" height="3"   rx="0.5" fill="currentColor" opacity="0.42" />
              <rect x="2"  y="5.5" width="10" height="3"   rx="0.5" fill="currentColor" opacity="0.65" />
              <rect x="3"  y="1.5" width="8"  height="3"   rx="0.5" fill="currentColor" />
            </svg>
          </div>
          <h1>Building Intelligence</h1>
          <div className="bi-title-sep" aria-hidden="true" />
          <span className="bi-title-desc">
            Conceptual spatial overview — illustrative portfolio data
          </span>
        </div>
        <div className="bi-title-row__right">
          <ClassificationBadge kind="conceptual" label={classificationLabels.conceptual.label} />
          <span className="bi-disclosure-inline" aria-hidden="true">
            Not an operational Oodi system
          </span>
        </div>
      </div>

      {/* ── Selectors ─────────────────────────────────────────────────────── */}
      <div className="bi-selectors">
        <div className="bi-selector-group">
          <span className="bi-selector-label" id="bi-level-label">
            Level
          </span>
          <div className="ovw-period-tabs" role="group" aria-labelledby="bi-level-label">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`ovw-period-tab${selectedLevel === lvl ? ' ovw-period-tab--active' : ''}`}
                aria-pressed={selectedLevel === lvl}
                onClick={() => handleLevelChange(lvl)}
              >
                {levelMeta[lvl].label}
              </button>
            ))}
          </div>
        </div>

        <div className="bi-selector-sep" aria-hidden="true" />

        <div className="bi-selector-group">
          <span className="bi-selector-label" id="bi-layer-label">
            Intelligence Layer
          </span>
          <div className="ovw-period-tabs" role="group" aria-labelledby="bi-layer-label">
            {LAYERS.map((layer) => (
              <button
                key={layer}
                type="button"
                className={`ovw-period-tab${selectedLayer === layer ? ' ovw-period-tab--active' : ''}`}
                aria-pressed={selectedLayer === layer}
                onClick={() => handleLayerChange(layer)}
              >
                {layerMeta[layer].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="bi-main">

        {/* Visualization */}
        <div className="bi-viz-wrap">
          <div className="bi-image-frame">
            {asset ? (
              <img
                src={asset.src}
                alt={`Oodi Helsinki building cross-section showing three levels. ${levelMeta[selectedLevel].label} selected, ${layerMeta[selectedLayer].label} layer active.`}
                className="bi-image"
              />
            ) : (
              <div
                className="bi-image-fallback"
                role="img"
                aria-label="Building visualization unavailable"
              >
                <span>Building diagram unavailable</span>
                <strong>buildingIntelligenceIllustration</strong>
              </div>
            )}

            {/* Level region highlight bands */}
            {LEVEL_KEYS.map((lvl) => {
              const region = levelRegions[lvl]
              const active =
                selectedLevel === 'all' ? 'all' : selectedLevel === lvl ? 'true' : 'false'
              return (
                <div
                  key={lvl}
                  className="bi-level-region"
                  data-level={lvl}
                  data-active={active}
                  aria-hidden="true"
                  style={{ top: `${region.top}%`, height: `${region.height}%` }}
                />
              )
            })}

            {/* Zone hotspots */}
            {allLayerRecords.map((record) => {
              const isInactive = selectedLevel !== 'all' && record.level !== selectedLevel
              return (
                <button
                  key={record.zoneId}
                  type="button"
                  className="bi-hotspot"
                  data-zone={record.zoneId}
                  data-selected={selectedZone === record.zoneId ? 'true' : 'false'}
                  data-inactive={isInactive ? 'true' : 'false'}
                  aria-label={`${record.zoneName}: ${statusLabels[record.status]} — ${layerMeta[selectedLayer].label}`}
                  aria-pressed={selectedZone === record.zoneId}
                  tabIndex={isInactive ? -1 : 0}
                  aria-hidden={isInactive ? true : undefined}
                  onClick={() => {
                    if (!isInactive) toggleZone(record.zoneId)
                  }}
                  style={
                    {
                      left: `${record.hotspot.x}%`,
                      top: `${record.hotspot.y}%`,
                      '--bi-hotspot-color': isInactive
                        ? 'rgba(65, 82, 110, 0.45)'
                        : STATUS_COLOR[record.status],
                    } as React.CSSProperties
                  }
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="bi-legend" aria-label="Zone status legend">
            {STATUS_KEYS.map((s) => (
              <span key={s} className="bi-legend__item">
                <span className={`bi-legend__dot bi-legend__dot--${s}`} aria-hidden="true" />
                {statusLabels[s]}
              </span>
            ))}
            <span className="bi-legend__note">Conceptual IoT — code overlay</span>
          </div>
        </div>

        {/* Contextual panel */}
        <aside className="bi-panel panel" aria-label="Zone intelligence summary">
          <div className="bi-panel__header">
            <div>
              <p className="bi-panel__title">
                {levelMeta[selectedLevel].label} — {layerMeta[selectedLayer].label}
              </p>
              <p className="bi-panel__subtitle">{layerMeta[selectedLayer].description}</p>
            </div>
            <ClassificationBadge kind="conceptual" label="Conceptual" />
          </div>

          {/* Metrics */}
          <div className="bi-panel__metrics" aria-label="Zone status summary">
            <div className="bi-metric">
              <span className="bi-metric__label">Zones</span>
              <span className="bi-metric__value bi-metric__value--neutral">{counts.total}</span>
              <span className="bi-metric__sub">in view</span>
            </div>
            <div className="bi-metric">
              <span className="bi-metric__label">{statusLabels.good}</span>
              <span className="bi-metric__value bi-metric__value--good">{counts.good}</span>
              <span className="bi-metric__sub">zones</span>
            </div>
            <div className="bi-metric">
              <span className="bi-metric__label">{statusLabels.moderate}</span>
              <span className="bi-metric__value bi-metric__value--moderate">
                {counts.moderate}
              </span>
              <span className="bi-metric__sub">zones</span>
            </div>
            <div className="bi-metric">
              <span className="bi-metric__label">{statusLabels.attention}</span>
              <span className="bi-metric__value bi-metric__value--attention">
                {counts.attention}
              </span>
              <span className="bi-metric__sub">zones</span>
            </div>
          </div>

          {/* Zone status list */}
          <p className="bi-panel__zones-label" id="bi-zone-list-label">
            Zone status
          </p>
          <ul className="bi-zone-list" aria-labelledby="bi-zone-list-label">
            {visibleRecords.map((record) => (
              <li key={record.zoneId} className="bi-zone-list__item">
                <button
                  type="button"
                  className="bi-zone-row"
                  data-selected={selectedZone === record.zoneId ? 'true' : 'false'}
                  aria-pressed={selectedZone === record.zoneId}
                  aria-label={`${record.zoneName}: ${statusLabels[record.status]}. ${record.description}`}
                  ref={(el) => {
                    if (el) zoneRefs.current.set(record.zoneId, el)
                    else zoneRefs.current.delete(record.zoneId)
                  }}
                  onClick={() => toggleZone(record.zoneId)}
                >
                  <span
                    className={`bi-zone-status-dot bi-zone-status-dot--${record.status}`}
                    aria-hidden="true"
                  />
                  <span className="bi-zone-row__info">
                    <span className="bi-zone-row__name">{record.zoneName}</span>
                    <span className="bi-zone-row__desc">{record.description}</span>
                  </span>
                  <span className="bi-zone-row__value" aria-hidden="true">
                    {String(record.value)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Insight */}
          <div className="bi-panel__insight">
            <span className="bi-panel__insight-label">Conceptual insight</span>
            <p className="bi-panel__insight-text">{layerInsights[selectedLayer][selectedLevel]}</p>
          </div>

          {/* Footer */}
          <div className="bi-panel__footer">
            <ClassificationBadge kind="conceptual" label={classificationLabels.conceptual.label} />
            <p className="bi-panel__disclaimer">
              {classificationLabels.conceptual.description}
            </p>
          </div>
        </aside>
      </div>

      {/* Persistent disclosure */}
      <DisclosureBar>
        Conceptual IoT layer — illustrative portfolio data, not an operational Oodi system.
      </DisclosureBar>
    </main>
  )
}
