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
  objectPosition?: string
}

export type MediaRegistry = Record<MediaSlotId, MediaAsset | null>

export const mediaAssets: MediaRegistry = {
  openingHeroMedia: {
    type: 'image',
    src: '/media/oodi/opening-hero.png',
    alt: 'Helsinki Central Library Oodi exterior at dusk.',
    caption: 'Oodi architectural hero image.',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
  overviewHeroMedia: {
    type: 'image',
    src: '/media/oodi/opening-hero.png',
    alt: 'Helsinki Central Library Oodi exterior at dusk.',
    caption: 'Oodi architectural context image.',
    aspectRatio: '21 / 9',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
  resourcePerformanceHeroMedia: {
    type: 'image',
    src: '/media/oodi/opening-hero.png',
    alt: 'Helsinki Central Library Oodi exterior at dusk.',
    caption: 'Oodi architectural resource-performance image.',
    aspectRatio: '21 / 9',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
  resourcePerformanceOverlayMedia: null,
  buildingIntelligenceIllustration: null,
  dataTransparencySupportMedia: null,
}
