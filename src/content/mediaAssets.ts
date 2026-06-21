export type MediaAssetType = 'image' | 'video'

export type MediaSlotId =
  | 'openingHeroMedia'
  | 'overviewHeroMedia'
  | 'resourcePerformanceHeroMedia'
  | 'resourcePerformanceOverlayMedia'
  | 'buildingIntelligenceIllustration'
  | 'dataTransparencySupportMedia'

export interface MediaAsset {
  type: MediaAssetType
  src: string
  alt: string
  poster?: string
  caption?: string
  aspectRatio: string
  objectFit: 'cover' | 'contain'
}

export type MediaRegistry = Record<MediaSlotId, MediaAsset | null>

export const mediaAssets: MediaRegistry = {
  openingHeroMedia: {
    type: 'image',
    src: '/media/stage-04/introduction.png',
    alt: 'Stage 4 reference media showing Helsinki Central Library Oodi as the landing hero visual.',
    caption: 'Temporary Stage 4 reference media. Interface text and controls remain rendered in HTML.',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
  },
  overviewHeroMedia: {
    type: 'image',
    src: '/media/stage-04/overview.png',
    alt: 'Stage 4 reference media showing the Oodi overview page visual direction.',
    caption: 'Temporary Stage 4 overview reference media used inside a semantic media slot.',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
  },
  resourcePerformanceHeroMedia: {
    type: 'image',
    src: '/media/stage-04/resource-performance-energy.png',
    alt: 'Stage 4 reference media showing Oodi with an analytical resource performance visualization.',
    caption: 'Temporary Stage 4 resource performance reference media; analytical overlays remain architecturally separable.',
    aspectRatio: '21 / 9',
    objectFit: 'cover',
  },
  resourcePerformanceOverlayMedia: null,
  buildingIntelligenceIllustration: null,
  dataTransparencySupportMedia: null,
}
