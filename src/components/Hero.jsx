import { useEffect, useRef } from 'react'
import { couple } from '../weddingData.js'
import { useScrollParallax } from '../hooks/useScrollParallax.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

// ---------------------------------------------------------------------------
// useHeroSequence
//
//  Phase 1  (0.00 → 0.40)  kicker + sub + place + cta fade out
//  Phase 2  (0.40 → 1.00)  [names + date GROUP] scale as one to fill viewport
//                           → NO fade, stays full opacity → scroll unlocks
// ---------------------------------------------------------------------------
function useHeroSequence() {
  const groupRef  = useRef(null)   // wraps both names + date — scaled as ONE unit
  const kickerRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const group  = groupRef.current
    const kicker = kickerRef.current
    const bottom = bottomRef.current
    if (!group || !kicker || !bottom) return

    let progress    = 0
    let locked      = true
    let touchStartY = 0
    const SPEED     = 0.0022

    function applyProgress(p) {
      const vw = window.innerWidth

      // Phase 1: fade out surrounding details
      const p1          = Math.min(1, p / 0.40)
      const sideOpacity = String(Math.max(0, 1 - p1 * 2.5))
      kicker.style.opacity = sideOpacity
      bottom.style.opacity = sideOpacity

      // Phase 2: scale the GROUP to fill viewport width — stays fully opaque
      const p2       = Math.max(0, Math.min(1, (p - 0.40) / 0.60))
      const groupW   = group.offsetWidth || 1
      const maxScale = Math.min((vw / groupW) * 1.01, 10)
      const scale    = 1 + (maxScale - 1) * p2
      group.style.transform = `scale(${scale})`
      group.style.opacity   = '1'
    }

    function setLocked(val) {
      locked = val
      document.body.style.overflow = val ? 'hidden' : ''
      if (val) window.scrollTo({ top: 0, behavior: 'instant' })
    }

    setLocked(true)
    applyProgress(0)

    function onWheel(e) {
      if (!locked && window.scrollY > 0) return
      if (!locked && window.scrollY === 0 && e.deltaY < 0 && progress >= 0.95) {
        setLocked(true)
      }
      if (!locked) return
      e.preventDefault()
      progress = Math.min(1, Math.max(0, progress + e.deltaY * SPEED))
      applyProgress(progress)
      if (progress >= 1) setLocked(false)
    }

    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY
    }

    function onTouchMove(e) {
      if (!locked && window.scrollY > 0) return
      const delta = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      if (!locked && window.scrollY === 0 && delta < 0 && progress >= 0.95) {
        setLocked(true)
      }
      if (!locked) return
      e.preventDefault()
      progress = Math.min(1, Math.max(0, progress + delta * SPEED * 2))
      applyProgress(progress)
      if (progress >= 1) setLocked(false)
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [])

  return { groupRef, kickerRef, bottomRef }
}

export default function Hero() {
  const parallaxRef                        = useScrollParallax(0.35)
  const { groupRef, kickerRef, bottomRef } = useHeroSequence()

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

        {/* Phase 2 + 3: names AND date scale + fade as ONE group */}
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
