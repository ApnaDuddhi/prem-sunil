import { couple } from '../weddingData.js'
import { useScrollParallax } from '../hooks/useScrollParallax.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

export default function Hero() {
  const parallaxRef = useScrollParallax(0.35)

  return (
    <header className="hero" id="home">
      <div
        className="hero-photo"
        ref={parallaxRef}
        style={{ backgroundImage: `url(${photo('couple-2')})` }}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-kicker hero-anim-blur">Together with their families</p>
        <h1 className="hero-names">
          <span className="hero-anim-left">{couple.groom.shortName}</span>
          <span className="amp hero-anim-pop">&amp;</span>
          <span className="hero-anim-right">{couple.bride.shortName}</span>
        </h1>
        <p className="hero-sub hero-anim-up" style={{ '--delay': '0.9s' }}>
          request the honour of your presence
        </p>
        <p className="hero-date hero-anim-up" style={{ '--delay': '1.1s' }}>
          24 · 11 · 2026
        </p>
        <p className="hero-place hero-anim-up" style={{ '--delay': '1.25s' }}>
          Sonbhadra, Uttar Pradesh
        </p>
        <a className="hero-cta hero-anim-up" href="#events" style={{ '--delay': '1.45s' }}>
          View the celebrations ↓
        </a>
      </div>
    </header>
  )
}
