export function ServiceArtBand({
  src,
  title,
  body,
  label,
  variant = 'wide',
  className = '',
  parallax = 0.018,
  parallaxMax = 10
}) {
  if (!src) return null

  return (
    <figure
      className={`service-art-band service-art-${variant} ${className}`.trim()}
      data-reveal
      data-parallax={parallax}
      data-parallax-max={parallaxMax}
    >
      <img src={src} alt="" loading="lazy" />
      <div className="service-art-shade" aria-hidden="true" />
      {(label || title || body) && (
        <figcaption>
          {label && <span>{label}</span>}
          {title && <strong>{title}</strong>}
          {body && <p>{body}</p>}
        </figcaption>
      )}
    </figure>
  )
}
