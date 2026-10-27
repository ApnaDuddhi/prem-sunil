import { useCallback, useEffect, useRef, useState } from 'react'
import {
  couple,
  weddingDate,
  events,
  gallery,
  baraat,
} from './weddingData.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

// Preload every gallery image (plus the hero + couple portraits) up front
// and report progress so a full-page loader can cover the site until the
// images are ready — then the page reveals with everything cached.
function usePreloadImages() {
  const names = [
    'couple-2',
    'sunil-1',
    'prema-1',
    ...gallery.map((g) => g.src),
  ]
  const unique = [...new Set(names)]
  const total = unique.length

  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    let done = 0
    const bump = () => {
      done += 1
      setLoaded(done)
    }
    const imgs = unique.map((name) => {
      const img = new Image()
      // count both success and failure so a missing file never hangs the loader
      img.onload = bump
      img.onerror = bump
      img.src = photo(name)
      // guard against an already-cached hit that won't fire onload
      if (img.complete && img.naturalWidth > 0) bump()
      return img
    })
    return () => imgs.forEach((img) => (img.onload = img.onerror = null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = total === 0 ? 1 : Math.min(loaded, total) / total
  return { progress, done: loaded >= total }
}

function Preloader({ progress }) {
  const percent = Math.round(progress * 100)
  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Loading">
      <div className="preloader-inner">
        <span className="preloader-rings" aria-hidden="true" />
        <p className="preloader-names">
          {couple.groom.shortName} <span className="amp">&amp;</span>{' '}
          {couple.bride.shortName}
        </p>
        <p className="preloader-sub">Loading our special day…</p>
        <div className="preloader-bar" aria-hidden="true">
          <span className="preloader-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="preloader-percent">{percent}%</p>
      </div>
    </div>
  )
}

function getTimeLeft(target) {
  const total = target.getTime() - Date.now()
  const clamp = (n) => Math.max(0, n)
  return {
    total,
    days: clamp(Math.floor(total / (1000 * 60 * 60 * 24))),
    hours: clamp(Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: clamp(Math.floor((total / (1000 * 60)) % 60)),
    seconds: clamp(Math.floor((total / 1000) % 60)),
  }
}

function Countdown() {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [])

  if (time.total <= 0) {
    return <p className="countdown-done">💐 Today we celebrate! 💐</p>
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map((u) => (
        <div className="count-box" key={u.label}>
          <span className="count-value">{String(u.value).padStart(2, '0')}</span>
          <span className="count-label">{u.label}</span>
        </div>
      ))}
    </div>
  )
}

function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero-photo" style={{ backgroundImage: `url(${photo('couple-2')})` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-kicker">Together with their families</p>
        <h1 className="hero-names">
          <span>{couple.groom.shortName}</span>
          <span className="amp">&amp;</span>
          <span>{couple.bride.shortName}</span>
        </h1>
        <p className="hero-sub">request the honour of your presence</p>
        <p className="hero-date">24 · 11 · 2026</p>
        <p className="hero-place">Sonbhadra, Uttar Pradesh</p>
        <a className="hero-cta" href="#events">View the celebrations ↓</a>
      </div>
    </header>
  )
}

function CountdownSection() {
  return (
    <section className="section countdown-section" id="countdown">
      <h2 className="section-title">Counting down to forever</h2>
      <p className="section-sub">Until the Shubh Vivah · शुभ विवाह</p>
      <Countdown />
    </section>
  )
}

function Story() {
  return (
    <section className="section story" id="couple">
      <h2 className="section-title">The Happy Couple</h2>
      <p className="section-sub">Two hearts, one journey</p>
      <div className="couple-cards">
        <article className="person">
          <div className="person-photo" style={{ backgroundImage: `url(${photo('sunil-1')})` }} />
          <span className="person-role">The Groom</span>
          <h3>{couple.groom.name}</h3>
        </article>

        <div className="heart">💞</div>

        <article className="person">
          <div className="person-photo" style={{ backgroundImage: `url(${photo('prema-1')})` }} />
          <span className="person-role">The Bride</span>
          <h3>{couple.bride.name}</h3>
        </article>
      </div>
    </section>
  )
}

function Events() {
  return (
    <section className="section events" id="events">
      <h2 className="section-title">Wedding Ceremonies</h2>
      <p className="section-sub">सांस्कृतिक कार्यक्रम</p>
      <div className="timeline">
        {events.map((e) => (
          <div className={`event-card ${e.highlight ? 'highlight' : ''}`} key={e.key}>
            <div className="event-icon">{e.icon}</div>
            <div className="event-body">
              <h3>
                {e.name} <span className="event-hindi">{e.nameHindi}</span>
              </h3>
              <p className="event-date">
                {e.date} · {e.day}
              </p>
              {e.time && <p className="event-time">{e.time}</p>}
            </div>
          </div>
        ))}
      </div>
      <p className="baraat-note">🐎 {baraat.note}</p>
    </section>
  )
}

function Lightbox({ index, onClose, onNavigate }) {
  const touchStart = useRef(null)
  const item = gallery[index]

  const goPrev = useCallback(
    () => onNavigate((index - 1 + gallery.length) % gallery.length),
    [index, onNavigate]
  )
  const goNext = useCallback(
    () => onNavigate((index + 1) % gallery.length),
    [index, onNavigate]
  )

  // Keyboard: Esc to close, arrows to navigate. Lock body scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, goPrev, goNext])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
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
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <button
        className="lightbox-nav lightbox-prev"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation()
          goPrev()
        }}
      >
        ‹
      </button>
      <figure
        className="lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img src={photo(item.src)} alt={item.alt} className="lightbox-img" />
        <figcaption className="lightbox-counter">
          {index + 1} / {gallery.length}
        </figcaption>
      </figure>
      <button
        className="lightbox-nav lightbox-next"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation()
          goNext()
        }}
      >
        ›
      </button>
    </div>
  )
}

function Gallery() {
  const [openIndex, setOpenIndex] = useState(null)
  // Show a few previews on the page; the rest live in the lightbox.
  const previewCount = 6
  const previews = gallery.slice(0, previewCount)
  const remaining = gallery.length - previewCount

  return (
    <section className="section gallery" id="gallery">
      <h2 className="section-title">Moments</h2>
      <p className="section-sub">Tap a photo to open the gallery</p>
      <div className="gallery-grid">
        {previews.map((g, i) => (
          <button
            type="button"
            className="gallery-item"
            key={i}
            onClick={() => setOpenIndex(i)}
            aria-label={`Open photo: ${g.alt}`}
          >
            <img src={photo(g.src)} alt={g.alt} loading="lazy" />
            {i === previewCount - 1 && remaining > 0 && (
              <span className="gallery-more" aria-hidden="true">
                +{remaining}
              </span>
            )}
          </button>
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

function Invitation() {
  return (
    <section className="section invite" id="invite">
      <h2 className="section-title">With Love &amp; Blessings</h2>
      <p className="invite-text">
        Your presence will make our celebration complete. We warmly invite you
        and your family to share in our joy.
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-names">
        {couple.groom.shortName} &amp; {couple.bride.shortName}
      </p>
      <p className="footer-date">24 November 2026</p>
      <p className="footer-made">Made with ♥ for our special day</p>
    </footer>
  )
}

export default function App() {
  const { progress, done } = usePreloadImages()

  // Keep the loader up at least a moment so it reads as intentional rather
  // than a flash, then fade it out once images are ready.
  const [minTimePassed, setMinTimePassed] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 900)
    return () => clearTimeout(t)
  }, [])

  const ready = done && minTimePassed

  useEffect(() => {
    if (!ready) return
    // let the fade-out animation play before removing from the DOM
    const t = setTimeout(() => setHidden(true), 600)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <div className="app">
      {!hidden && (
        <div className={`preloader-wrap ${ready ? 'is-done' : ''}`}>
          <Preloader progress={progress} />
        </div>
      )}
      <Hero />
      <CountdownSection />
      <Story />
      <Events />
      <Gallery />
      <Invitation />
      <Footer />
    </div>
  )
}
