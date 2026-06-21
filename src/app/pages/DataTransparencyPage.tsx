import { TransparencyRow } from '../../components/cards/TransparencyRow'
import { ClassificationBadge } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { classificationLabels } from '../../content/pageContent'

export function DataTransparencyPage() {
  return (
    <main className="page page--shell" data-layout="data-transparency">
      <section className="shell-hero">
        <div>
          <span className="eyebrow">Data Transparency</span>
          <h1>Sources, limitations, and methodology</h1>
          <p>
            This page explains which content is real public data, current public weather,
            cached public fallback, or conceptual prototype material.
          </p>
          <div className="classification-row">
            {Object.entries(classificationLabels).map(([kind, detail]) => (
              <ClassificationBadge key={kind} kind={kind as keyof typeof classificationLabels} label={detail.label} />
            ))}
          </div>
        </div>
        <MediaSlot asset={mediaAssets.dataTransparencySupportMedia} slotName="dataTransparencySupportMedia" />
      </section>
      <section className="panel transparency-panel">
        <TransparencyRow kind="public-utility" title="Nuuka utility data" source="Helsinki Nuuka Open API" status="Real public building data" />
        <TransparencyRow kind="current-weather" title="Open-Meteo weather" source="Open-Meteo forecast API" status="Current public weather data" />
        <TransparencyRow kind="cached-public-snapshot" title="Nuuka snapshots" source="Versioned public-data snapshot files" status="Labelled fallback only" />
        <TransparencyRow kind="conceptual" title="Building Intelligence" source="Local prototype content" status="Illustrative only" />
      </section>
      <DisclosureBar>
        Public utility values, current weather context, and conceptual indicators must remain visually and textually distinct.
      </DisclosureBar>
    </main>
  )
}
