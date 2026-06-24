export type BuildingLevel = 'all' | 'level-1' | 'level-2' | 'level-3'

export type IntelligenceLayer =
  | 'occupancy'
  | 'comfort'
  | 'air-quality'
  | 'hvac'
  | 'asset-health'

export type ZoneStatus = 'good' | 'moderate' | 'attention'

export type ConceptualZoneRecord = {
  level: Exclude<BuildingLevel, 'all'>
  zoneId: string
  zoneName: string
  layer: IntelligenceLayer
  status: ZoneStatus
  value: number | string
  unit?: string
  description: string
  classification: 'conceptual'
  hotspot: { x: number; y: number }
}

export const levelMeta: Record<BuildingLevel, { label: string }> = {
  all: { label: 'All Levels' },
  'level-1': { label: 'Level 1' },
  'level-2': { label: 'Level 2' },
  'level-3': { label: 'Level 3' },
}

export const layerMeta: Record<IntelligenceLayer, { label: string; description: string }> = {
  occupancy: { label: 'Occupancy', description: 'Illustrative activity patterns by zone' },
  comfort: { label: 'Indoor Comfort', description: 'Predicted thermal and acoustic comfort' },
  'air-quality': { label: 'Air Quality', description: 'Conceptual indoor air condition index' },
  hvac: { label: 'HVAC', description: 'Illustrative mechanical system states' },
  'asset-health': { label: 'Asset Health', description: 'Conceptual equipment condition overview' },
}

// Layer-appropriate visible status labels (internal model stays good/moderate/attention)
export const layerStatusLabels: Record<IntelligenceLayer, Record<ZoneStatus, string>> = {
  occupancy: { good: 'Low', moderate: 'Moderate', attention: 'High' },
  comfort: { good: 'Good', moderate: 'Moderate', attention: 'Attention' },
  'air-quality': { good: 'Good', moderate: 'Moderate', attention: 'Attention' },
  hvac: { good: 'Reduced Demand', moderate: 'Balanced', attention: 'Elevated Demand' },
  'asset-health': { good: 'Good', moderate: 'Monitor', attention: 'Attention' },
}

export const layerInsights: Record<IntelligenceLayer, Record<BuildingLevel, string>> = {
  occupancy: {
    all: 'Occupancy follows expected weekday flow. Level 2 Media Lab is the highest-activity zone across the building.',
    'level-1': 'Ground Reception shows steady visitor flow. Public Hall is below typical weekday pattern; Service Core remains low as expected for a staff-access area.',
    'level-2': 'Media Lab is near capacity with an active workshop session in progress. Reading Gallery maintains typical mid-day occupancy; Study Zone is currently quiet.',
    'level-3': 'Event Space is set up for an upcoming session with staff-only access. Roof Terrace sees light use consistent with current conditions; Mechanical Zone remains a restricted-access area.',
  },
  comfort: {
    all: 'Comfort is optimal across most zones. Media Lab shows a moderate heat load from active workshop use.',
    'level-1': 'Ground Reception maintains optimal thermal comfort. Public Hall shows a slight variance from the comfort band — non-critical and within acceptable range.',
    'level-2': 'Media Lab is experiencing elevated heat load from equipment and active occupancy. Reading Gallery and Study Zone are both within optimal comfort conditions.',
    'level-3': 'Roof Terrace comfort is variable with outdoor conditions. Event Space is pre-conditioned for the upcoming session; Mechanical Zone comfort metrics are not the primary indicator for this zone.',
  },
  'air-quality': {
    all: 'Indoor air conditions are within acceptable range building-wide. The Media Lab session is managed by increased ventilation demand.',
    'level-1': 'Ground Reception and Public Hall air quality is within comfortable indoor range. Service Core shows a slightly elevated activity load — within acceptable limits.',
    'level-2': 'Media Lab ventilation load is elevated due to the active workshop session. Reading Gallery and Study Zone maintain optimal air quality conditions with low occupancy.',
    'level-3': 'Roof Terrace benefits from natural outdoor ventilation. Mechanical Zone ventilation is operating at an elevated rate; Event Space fresh-air supply is meeting pre-session targets.',
  },
  hvac: {
    all: 'Mechanical systems are balanced across most zones. Service Core and Mechanical Zone show elevated demand within operating limits.',
    'level-1': 'Ground Reception and Public Hall systems are running at reduced demand. Service Core mechanical ventilation is elevated above nominal — within operating limits.',
    'level-2': 'Reading Gallery and Study Zone are running at reduced demand. Media Lab system demand is balanced to manage the active workshop thermal load.',
    'level-3': 'Roof Terrace requires no active conditioning. Event Space pre-conditioning is running on schedule. Mechanical Zone plant is operating above baseline within design limits.',
  },
  'asset-health': {
    all: 'Equipment status is nominal across the majority of zones. Service Core and Mechanical Zone have items flagged for scheduled review.',
    'level-1': 'Ground Reception equipment is nominal. Public Hall has a scheduled maintenance item logged for review. Service Core has plant equipment flagged for a supplementary inspection.',
    'level-2': 'Reading Gallery and Media Lab equipment is nominal across all active systems. Study Zone fixtures and outlets are operating as expected.',
    'level-3': 'Event Space has one stage rigging item flagged for a pre-event check. Mechanical Zone roof-mounted equipment has a predictive review scheduled. Roof Terrace perimeter systems are nominal.',
  },
}

// Level band positions calibrated to the clean building cutaway image
export const levelRegions: Record<
  Exclude<BuildingLevel, 'all'>,
  { top: number; height: number }
> = {
  'level-3': { top: 9, height: 22 },
  'level-2': { top: 33, height: 25 },
  'level-1': { top: 59, height: 25 },
}

// 45 deterministic records — 9 zones × 5 layers. No random values, no live timestamps.
export const zoneData: ConceptualZoneRecord[] = [
  // ── Level 1 · Ground Reception ──────────────────────────────────────────
  { level: 'level-1', zoneId: 'l1-z1', zoneName: 'Ground Reception', layer: 'occupancy', status: 'moderate', value: 'Moderate', description: 'Steady visitor flow through the main entrance area.', classification: 'conceptual', hotspot: { x: 20, y: 72 } },
  { level: 'level-1', zoneId: 'l1-z1', zoneName: 'Ground Reception', layer: 'comfort', status: 'good', value: 'Good', description: 'Predicted thermal comfort within optimal range.', classification: 'conceptual', hotspot: { x: 20, y: 72 } },
  { level: 'level-1', zoneId: 'l1-z1', zoneName: 'Ground Reception', layer: 'air-quality', status: 'good', value: 'Good', description: 'Ventilation rates supporting comfortable indoor conditions.', classification: 'conceptual', hotspot: { x: 20, y: 72 } },
  { level: 'level-1', zoneId: 'l1-z1', zoneName: 'Ground Reception', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'Air handling units operating within design parameters.', classification: 'conceptual', hotspot: { x: 20, y: 72 } },
  { level: 'level-1', zoneId: 'l1-z1', zoneName: 'Ground Reception', layer: 'asset-health', status: 'good', value: 'Good', description: 'Access systems and reception equipment nominal.', classification: 'conceptual', hotspot: { x: 20, y: 72 } },

  // ── Level 1 · Public Hall ────────────────────────────────────────────────
  { level: 'level-1', zoneId: 'l1-z2', zoneName: 'Public Hall', layer: 'occupancy', status: 'good', value: 'Low', description: 'Below typical weekday occupancy pattern.', classification: 'conceptual', hotspot: { x: 50, y: 70 } },
  { level: 'level-1', zoneId: 'l1-z2', zoneName: 'Public Hall', layer: 'comfort', status: 'moderate', value: 'Moderate', description: 'Slight variance from optimal comfort band — non-critical.', classification: 'conceptual', hotspot: { x: 50, y: 70 } },
  { level: 'level-1', zoneId: 'l1-z2', zoneName: 'Public Hall', layer: 'air-quality', status: 'good', value: 'Good', description: 'Open-volume air quality within expected range.', classification: 'conceptual', hotspot: { x: 50, y: 70 } },
  { level: 'level-1', zoneId: 'l1-z2', zoneName: 'Public Hall', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'Large-volume conditioning running at standard load.', classification: 'conceptual', hotspot: { x: 50, y: 70 } },
  { level: 'level-1', zoneId: 'l1-z2', zoneName: 'Public Hall', layer: 'asset-health', status: 'moderate', value: 'Monitor', description: 'Scheduled maintenance item logged for review.', classification: 'conceptual', hotspot: { x: 50, y: 70 } },

  // ── Level 1 · Service Core ───────────────────────────────────────────────
  { level: 'level-1', zoneId: 'l1-z3', zoneName: 'Service Core', layer: 'occupancy', status: 'good', value: 'Low', description: 'Staff access area with low occupancy pattern.', classification: 'conceptual', hotspot: { x: 75, y: 73 } },
  { level: 'level-1', zoneId: 'l1-z3', zoneName: 'Service Core', layer: 'comfort', status: 'good', value: 'Good', description: 'Temperature and air movement within comfort range.', classification: 'conceptual', hotspot: { x: 75, y: 73 } },
  { level: 'level-1', zoneId: 'l1-z3', zoneName: 'Service Core', layer: 'air-quality', status: 'moderate', value: 'Moderate', description: 'Slightly elevated activity load — within acceptable limits.', classification: 'conceptual', hotspot: { x: 75, y: 73 } },
  { level: 'level-1', zoneId: 'l1-z3', zoneName: 'Service Core', layer: 'hvac', status: 'attention', value: 'Elevated Demand', description: 'Mechanical room ventilation running above nominal load.', classification: 'conceptual', hotspot: { x: 75, y: 73 } },
  { level: 'level-1', zoneId: 'l1-z3', zoneName: 'Service Core', layer: 'asset-health', status: 'attention', value: 'Attention', description: 'Supplementary inspection recommended for plant equipment.', classification: 'conceptual', hotspot: { x: 75, y: 73 } },

  // ── Level 2 · Reading Gallery ────────────────────────────────────────────
  { level: 'level-2', zoneId: 'l2-z1', zoneName: 'Reading Gallery', layer: 'occupancy', status: 'moderate', value: 'Moderate', description: 'Typical reading-area occupancy for time of day.', classification: 'conceptual', hotspot: { x: 25, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z1', zoneName: 'Reading Gallery', layer: 'comfort', status: 'good', value: 'Good', description: 'Acoustic and thermal comfort levels optimal for focused work.', classification: 'conceptual', hotspot: { x: 25, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z1', zoneName: 'Reading Gallery', layer: 'air-quality', status: 'good', value: 'Good', description: 'Fresh-air supply maintaining comfortable reading conditions.', classification: 'conceptual', hotspot: { x: 25, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z1', zoneName: 'Reading Gallery', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'Quiet fan-coil operation supporting low-noise environment.', classification: 'conceptual', hotspot: { x: 25, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z1', zoneName: 'Reading Gallery', layer: 'asset-health', status: 'good', value: 'Good', description: 'Lighting fixtures and furniture systems nominal.', classification: 'conceptual', hotspot: { x: 25, y: 46 } },

  // ── Level 2 · Media Lab ──────────────────────────────────────────────────
  { level: 'level-2', zoneId: 'l2-z2', zoneName: 'Media Lab', layer: 'occupancy', status: 'attention', value: 'High', description: 'Workshop session in progress — near-capacity occupancy.', classification: 'conceptual', hotspot: { x: 51, y: 44 } },
  { level: 'level-2', zoneId: 'l2-z2', zoneName: 'Media Lab', layer: 'comfort', status: 'moderate', value: 'Moderate', description: 'Elevated heat load from equipment and occupancy.', classification: 'conceptual', hotspot: { x: 51, y: 44 } },
  { level: 'level-2', zoneId: 'l2-z2', zoneName: 'Media Lab', layer: 'air-quality', status: 'moderate', value: 'Moderate', description: 'Increased ventilation load from active session — monitored.', classification: 'conceptual', hotspot: { x: 51, y: 44 } },
  { level: 'level-2', zoneId: 'l2-z2', zoneName: 'Media Lab', layer: 'hvac', status: 'moderate', value: 'Balanced', description: 'Zone demand elevated to manage workshop thermal load.', classification: 'conceptual', hotspot: { x: 51, y: 44 } },
  { level: 'level-2', zoneId: 'l2-z2', zoneName: 'Media Lab', layer: 'asset-health', status: 'good', value: 'Good', description: 'AV and workspace equipment reporting nominal status.', classification: 'conceptual', hotspot: { x: 51, y: 44 } },

  // ── Level 2 · Study Zone ─────────────────────────────────────────────────
  { level: 'level-2', zoneId: 'l2-z3', zoneName: 'Study Zone', layer: 'occupancy', status: 'good', value: 'Low', description: 'Quiet study area with low occupancy.', classification: 'conceptual', hotspot: { x: 74, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z3', zoneName: 'Study Zone', layer: 'comfort', status: 'good', value: 'Good', description: 'Optimal comfort conditions for individual study.', classification: 'conceptual', hotspot: { x: 74, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z3', zoneName: 'Study Zone', layer: 'air-quality', status: 'good', value: 'Good', description: 'Air quality optimal with low occupancy load.', classification: 'conceptual', hotspot: { x: 74, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z3', zoneName: 'Study Zone', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'Minimal conditioning demand in quiet zone.', classification: 'conceptual', hotspot: { x: 74, y: 46 } },
  { level: 'level-2', zoneId: 'l2-z3', zoneName: 'Study Zone', layer: 'asset-health', status: 'good', value: 'Good', description: 'Study pod fixtures and outlets nominal.', classification: 'conceptual', hotspot: { x: 74, y: 46 } },

  // ── Level 3 · Roof Terrace ───────────────────────────────────────────────
  { level: 'level-3', zoneId: 'l3-z1', zoneName: 'Roof Terrace', layer: 'occupancy', status: 'good', value: 'Low', description: 'Outdoor terrace with light use consistent with conditions.', classification: 'conceptual', hotspot: { x: 29, y: 20 } },
  { level: 'level-3', zoneId: 'l3-z1', zoneName: 'Roof Terrace', layer: 'comfort', status: 'moderate', value: 'Moderate', description: 'Outdoor comfort index variable with current weather context.', classification: 'conceptual', hotspot: { x: 29, y: 20 } },
  { level: 'level-3', zoneId: 'l3-z1', zoneName: 'Roof Terrace', layer: 'air-quality', status: 'good', value: 'Good', description: 'Outdoor environment — natural ventilation conditions.', classification: 'conceptual', hotspot: { x: 29, y: 20 } },
  { level: 'level-3', zoneId: 'l3-z1', zoneName: 'Roof Terrace', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'No active conditioning — terrace served by outdoor air.', classification: 'conceptual', hotspot: { x: 29, y: 20 } },
  { level: 'level-3', zoneId: 'l3-z1', zoneName: 'Roof Terrace', layer: 'asset-health', status: 'good', value: 'Good', description: 'Terrace furniture and perimeter systems nominal.', classification: 'conceptual', hotspot: { x: 29, y: 20 } },

  // ── Level 3 · Event Space ────────────────────────────────────────────────
  { level: 'level-3', zoneId: 'l3-z2', zoneName: 'Event Space', layer: 'occupancy', status: 'moderate', value: 'Moderate', description: 'Event set-up in progress — access limited to staff.', classification: 'conceptual', hotspot: { x: 57, y: 27 } },
  { level: 'level-3', zoneId: 'l3-z2', zoneName: 'Event Space', layer: 'comfort', status: 'good', value: 'Good', description: 'Pre-conditioning active for upcoming event period.', classification: 'conceptual', hotspot: { x: 57, y: 27 } },
  { level: 'level-3', zoneId: 'l3-z2', zoneName: 'Event Space', layer: 'air-quality', status: 'good', value: 'Good', description: 'Venue pre-conditioning maintaining fresh-air targets.', classification: 'conceptual', hotspot: { x: 57, y: 27 } },
  { level: 'level-3', zoneId: 'l3-z2', zoneName: 'Event Space', layer: 'hvac', status: 'good', value: 'Reduced Demand', description: 'Pre-event conditioning running on schedule.', classification: 'conceptual', hotspot: { x: 57, y: 27 } },
  { level: 'level-3', zoneId: 'l3-z2', zoneName: 'Event Space', layer: 'asset-health', status: 'moderate', value: 'Monitor', description: 'Stage rigging reviewed pre-event — one item flagged for check.', classification: 'conceptual', hotspot: { x: 57, y: 27 } },

  // ── Level 3 · Mechanical Zone ────────────────────────────────────────────
  { level: 'level-3', zoneId: 'l3-z3', zoneName: 'Mechanical Zone', layer: 'occupancy', status: 'good', value: 'Low', description: 'Restricted access zone — authorised personnel only.', classification: 'conceptual', hotspot: { x: 40, y: 14 } },
  { level: 'level-3', zoneId: 'l3-z3', zoneName: 'Mechanical Zone', layer: 'comfort', status: 'good', value: 'Good', description: 'Technical zone — comfort metrics not primary indicator.', classification: 'conceptual', hotspot: { x: 40, y: 14 } },
  { level: 'level-3', zoneId: 'l3-z3', zoneName: 'Mechanical Zone', layer: 'air-quality', status: 'moderate', value: 'Moderate', description: 'Mechanical room ventilation operating at elevated rate.', classification: 'conceptual', hotspot: { x: 40, y: 14 } },
  { level: 'level-3', zoneId: 'l3-z3', zoneName: 'Mechanical Zone', layer: 'hvac', status: 'attention', value: 'Elevated Demand', description: 'Roof-level plant running above baseline — within limits.', classification: 'conceptual', hotspot: { x: 40, y: 14 } },
  { level: 'level-3', zoneId: 'l3-z3', zoneName: 'Mechanical Zone', layer: 'asset-health', status: 'attention', value: 'Attention', description: 'Predictive review scheduled for roof-mounted equipment.', classification: 'conceptual', hotspot: { x: 40, y: 14 } },
]
