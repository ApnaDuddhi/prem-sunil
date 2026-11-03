import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery } from '../weddingData.js'
import { useReveal } from '../hooks/useReveal.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`
const thumb = (name) => `${BASE}photos/thumbs/${name}.jpeg`

// Session-level full-size image cache so re-opened photos appear instantly
const fullCache = new Map()
function cacheFull(src) {
  if (fullCache.has(src)) return
  const img = new Image()
  img.src = photo(src)
  fullCache.set(src, img)
}
const isFullCached = (src) => fullCache.has(src)

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function Lightbox({ index, onClose, onNavigate }) {
  const touchStart = useRef(null)
  const fullImg    = useRef(null)
  const item       = gallery[index]

  const [fullLoaded, setFullLoaded] = useState(() => isFullCached(item.src))

  useEffect(() => {
    const cached = isFullCached(item.src)
    setFullLoaded(cached)
    if (!cached && fullImg.current?.complete && fullImg.current.naturalWidth > 0) {
      cacheFull(item.src)
      setFullLoaded(true)
    }
    // warm neighbours
    cacheFull(gallery[(index - 1 + gallery.length) % gallery.length].src)
    cacheFull(gallery[(index + 1) % gallery.length].src)
  }, [index, item.src])

  const goPrev = useCallback(
    () => onNavigate((index - 1 + gallery.length) % gallery.length),
    [index, onNavigate]
  )
  const goNext = useCallback(
    () => onNavigate((index + 1) % gallery.length),
    [index, onNavigate]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose()
      else if (e.key === 'ArrowLeft')  goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, goPrev, goNext])

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (delta > 50) goPrev()
    else if (delta < -50) goNext()
    touchStart.current = null
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      onClick={onClose}
    >
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
      <button
        className="lightbox-nav lightbox-prev"
        aria-label="Previous photo"
        onClick={(e) => { e.stopPropagation(); goPrev() }}
      >‹</button>

      <figure
        className="lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="lightbox-media">
          <img src={thumb(item.src)} alt="" aria-hidden="true" className="lightbox-thumb" />
          <img
            ref={fullImg}
            key={item.src}
            src={photo(item.src)}
            alt={item.alt}
            className={`lightbox-img ${fullLoaded ? 'is-loaded' : ''}`}
            onLoad={() => { cacheFull(item.src); setFullLoaded(true) }}
          />
          {!fullLoaded && <span className="lightbox-spinner" aria-hidden="true" />}
        </div>
        <figcaption className="lightbox-counter">
          {index + 1} / {gallery.length}
        </figcaption>
      </figure>

      <button
        className="lightbox-nav lightbox-next"
        aria-label="Next photo"
        onClick={(e) => { e.stopPropagation(); goNext() }}
      >›</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Gallery item
// ---------------------------------------------------------------------------
function GalleryItem({ g, i, previewCount, remaining, onClick }) {
  const ref = useReveal(0.1)
  return (
    <button
      type="button"
      className="gallery-item reveal reveal-blind"
      ref={ref}
      style={{ '--delay': `${i * 0.08}s` }}
      onClick={() => onClick(i)}
      aria-label={`Open photo: ${g.alt}`}
    >
      <img src={thumb(g.src)} alt={g.alt} loading="lazy" />
      {i === previewCount - 1 && remaining > 0 && (
        <span className="gallery-more" aria-hidden="true">+{remaining}</span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Gallery section
// ---------------------------------------------------------------------------
export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null)
  const titleRef = useReveal(0.2)
  const subRef   = useReveal(0.2)

  const previewCount = 6
  const previews     = gallery.slice(0, previewCount)
  const remaining    = gallery.length - previewCount

  return (
    <section className="section gallery" id="gallery">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>Moments</h2>
      <p className="section-sub reveal-fade-up" ref={subRef}>
        Tap a photo to open the gallery
      </p>
      <div className="gallery-grid">
        {previews.map((g, i) => (
          <GalleryItem
            key={i}
            g={g}
            i={i}
            previewCount={previewCount}
            remaining={remaining}
            onClick={setOpenIndex}
          />
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  )
}
