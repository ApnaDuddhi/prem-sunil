import { useEffect, useState } from 'react'
import {
  couple,
  weddingDate,
  events,
  invitedBy,
  gallery,
  baraat,
} from './weddingData.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

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
      <div className="couple-cards">
        <article className="person">
          <div className="person-photo" style={{ backgroundImage: `url(${photo('sunil-1')})` }} />
          <h3>{couple.groom.name}</h3>
          <p className="person-role">{couple.groom.role}</p>
          <p className="person-family">
            Son of {couple.groom.father} &amp; {couple.groom.mother}
          </p>
          <p className="person-village">{couple.groom.village}</p>
        </article>

        <div className="heart">💞</div>

        <article className="person">
          <div className="person-photo" style={{ backgroundImage: `url(${photo('prema-1')})` }} />
          <h3>{couple.bride.name}</h3>
          <p className="person-role">The Bride</p>
          <p className="person-family">
            Daughter of {couple.bride.father} &amp; {couple.bride.mother}
          </p>
          <p className="person-village">{couple.bride.village}</p>
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

function Gallery() {
  return (
    <section className="section gallery" id="gallery">
      <h2 className="section-title">Moments</h2>
      <div className="gallery-grid">
        {gallery.map((g, i) => (
          <div className="gallery-item" key={i}>
            <img src={photo(g.src)} alt={g.alt} loading="lazy" />
          </div>
        ))}
      </div>
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
      <div className="invite-details">
        <p>
          <strong>Presented by:</strong> {invitedBy.presenter}
        </p>
        <p>
          <strong>With regards:</strong> {invitedBy.humble}
        </p>
        <p className="invite-phones">
          {invitedBy.phones.map((p, i) => (
            <a href={`tel:${p.replace(/\s/g, '')}`} key={i}>
              📞 {p}
            </a>
          ))}
        </p>
      </div>
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
  return (
    <div className="app">
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
