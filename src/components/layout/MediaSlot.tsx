import type { MediaAsset, MediaSlotId } from '../../content/mediaAssets'

export function MediaSlot({
  asset,
  slotName,
  className = '',
  overlay,
}: {
  asset: MediaAsset | null
  slotName: MediaSlotId
  className?: string
  overlay?: MediaAsset | null
}) {
  const style = {
    aspectRatio: asset?.aspectRatio ?? '16 / 9',
  }

  return (
    <figure className={`media-slot ${className}`} data-media-slot={slotName} style={style}>
      {asset ? <MediaElement asset={asset} /> : <MediaFallback slotName={slotName} />}
      {overlay ? (
        <div className="media-slot__overlay" aria-hidden="true">
          <MediaElement asset={overlay} decorative />
        </div>
      ) : null}
      {asset?.caption ? <figcaption>{asset.caption}</figcaption> : null}
    </figure>
  )
}

function MediaElement({
  asset,
  decorative = false,
}: {
  asset: MediaAsset
  decorative?: boolean
}) {
  if (asset.type === 'video') {
    return (
      <video
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : asset.alt}
        className="media-slot__asset"
        muted
        playsInline
        poster={asset.poster}
        preload="metadata"
        src={asset.src}
        style={{ objectFit: asset.objectFit }}
      />
    )
  }

  return (
    <img
      alt={decorative ? '' : asset.alt}
      className="media-slot__asset"
      src={asset.src}
      style={{ objectFit: asset.objectFit }}
    />
  )
}

function MediaFallback({ slotName }: { slotName: MediaSlotId }) {
  return (
    <div className="media-slot__fallback" role="img" aria-label={`${slotName} media placeholder`}>
      <span>Media placeholder</span>
      <strong>{slotName}</strong>
    </div>
  )
}
