import { EntryActionCard } from '../../components/cards/EntryActionCard'
import { ClassificationBadge } from '../../components/layout/DataStatus'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { classificationLabels, prototypeDisclaimer } from '../../content/pageContent'

export function OpeningPage() {
  return (
    <main className="page page--opening" data-layout="opening">
      <section className="opening-hero">
        <div className="opening-hero__copy">
          <span className="eyebrow">Independent Prototype</span>
          <h1>OODI Smart Building Intelligence</h1>
          <p>
            A responsive intelligence layer for Helsinki Central Library Oodi,
            combining public building data, current weather context, and clearly
            labelled conceptual building intelligence.
          </p>
          <div className="classification-row">
            <ClassificationBadge kind="public-utility" label={classificationLabels['public-utility'].label} />
            <ClassificationBadge kind="current-weather" label="Current Weather" />
            <ClassificationBadge kind="conceptual" label={classificationLabels.conceptual.label} />
          </div>
        </div>
        <MediaSlot
          asset={mediaAssets.openingHeroMedia}
          className="opening-hero__media"
          slotName="openingHeroMedia"
        />
      </section>

      <section className="entry-grid" aria-label="Primary entry actions">
        <EntryActionCard href="#/overview" title="Enter Overview" description="Explore Oodi at a glance" />
        <EntryActionCard
          href="#/resource-performance"
          title="Explore Resource Performance"
          description="Review utilities, periods, and source timestamps"
        />
        <EntryActionCard
          href="#/data-transparency"
          title="View Methodology"
          description="Understand data sources and limitations"
        />
      </section>

      <section className="summary-band">
        <article>
          <strong>Public utility data</strong>
          <p>Electricity, heat, water, and district cooling from Nuuka public data.</p>
        </article>
        <article>
          <strong>Current weather context</strong>
          <p>Open-Meteo data for Oodi coordinates with provider timestamps.</p>
        </article>
        <article>
          <strong>Conceptual layer</strong>
          <p>Illustrative intelligence modules only; not connected to Oodi systems.</p>
        </article>
      </section>

      <p className="page-note">{prototypeDisclaimer}</p>
    </main>
  )
}
