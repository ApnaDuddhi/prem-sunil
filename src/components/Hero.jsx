import { useRef } from 'react'
import { couple } from '../weddingData.js'
import { useScrollParallax } from '../hooks/useScrollParallax.js'
import { useSectionScale }   from '../hooks/useSectionScale.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

export default function Hero() {
  const parallaxRef = useScrollParallax(0.35)

  // Elements that fade out in phase 1
  const kickerRef = useRef(null)
  const bottomRef = useRef(null)

  // The group that scales in phase 2
  const groupRef = useRef(null)

  useSectionScale({
    scaleRef : groupRef,
    fadeRefs : [kickerRef, bottomRef],
    fadeEnd  : 0.35,
    speed    : 0.0022,
    fillRatio: 1.0,
    isFirst  : true,           // locks on mount, re-locks at scrollY === 0
  })

  return (
    <header className="hero" id="home">
      <div
        className="hero-photo"
        ref={parallaxRef}
        style={{ backgroundImage: `url(${photo('couple-2')})` }}
      />
      <div className="hero-overlay" />

      <div className="hero-sticky">
        {/* Phase 1: fades out */}
        <p className="hero-kicker hero-anim-blur" ref={kickerRef}>
          Together with their families
        </p>

        {/* Phase 2: scales as one group */}
        <div className="hero-scale-group" ref={groupRef}>
          <h1 className="hero-names">
            <span className="hero-anim-left">{couple.groom.shortName}</span>
            <span className="amp hero-anim-pop">&amp;</span>
            <span className="hero-anim-right">{couple.bride.shortName}</span>
          </h1>
          <p className="hero-date hero-anim-up" style={{ '--delay': '1.1s' }}>
            24 · 11 · 2026
          </p>
        </div>

        {/* Phase 1: fades out */}
        <div className="hero-bottom-details" ref={bottomRef}>
          <p className="hero-sub hero-anim-up" style={{ '--delay': '0.9s' }}>
            request the honour of your presence
          </p>
          <p className="hero-place hero-anim-up" style={{ '--delay': '1.25s' }}>
            Sonbhadra, Uttar Pradesh
          </p>
          <a className="hero-cta hero-anim-up" href="#events" style={{ '--delay': '1.45s' }}>
            View the celebrations ↓
          </a>
        </div>
      </div>
    </header>
  )
}
