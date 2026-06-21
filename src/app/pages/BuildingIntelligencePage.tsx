import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { conceptualModules } from '../../content/pageContent'

export function BuildingIntelligencePage() {
  return (
    <main className="page page--shell" data-layout="building-intelligence">
      <section className="shell-hero">
        <div>
          <span className="eyebrow">Conceptual IoT Layer</span>
          <h1>Building Intelligence</h1>
          <p>
            Structural shell for future spatial and operational communication.
            These indicators are illustrative and not connected to Oodi systems.
          </p>
        </div>
        <MediaSlot asset={mediaAssets.buildingIntelligenceIllustration} slotName="buildingIntelligenceIllustration" />
      </section>
      <section className="concept-grid">
        {conceptualModules.map((module) => (
          <article className="panel" key={module.title}>
            <strong>{module.title}</strong>
            <span>{module.status}</span>
            <p>{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
