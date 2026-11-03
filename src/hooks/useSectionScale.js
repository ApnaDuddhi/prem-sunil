import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// useSectionScale
//
// Wheel/touch-intercepted scale sequence, extracted from Hero.
//
//   Phase 1  (0 → fadeEnd)   fadeRefs[] opacity 1 → 0
//   Phase 2  (fadeEnd → 1)   scaleRef scales 1 → fills container width
//
// isFirst = true  → Hero mode: locks on mount, re-locks at scrollY === 0
// isFirst = false → Card mode: locks when the container enters view, unless a
//                   triggerRef is provided; then it locks at triggerTop.
//                   Never blocks scroll-up.
//
// IMPORTANT: no transform is written until the user first scrolls —
// the element sits at its natural scale(1) until then.
// ---------------------------------------------------------------------------
export function useSectionScale({
  scaleRef,
  fadeRefs       = [],
  triggerRef     = null,
  triggerTop     = 24,
  fadeEnd        = 0.4,
  speed          = 0.0022,
  fillRatio      = 0.98,
  isFirst        = false,
  transformOrigin = 'center center',
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const scaleEl = scaleRef?.current
    if (!scaleEl) return

    // Guarantee element starts at natural size — no transform at all
    scaleEl.style.transform       = ''
    scaleEl.style.transformOrigin = transformOrigin
    fadeRefs.forEach(r => { if (r?.current) r.current.style.opacity = '' })

    let progress    = 0
    let locked      = false
    let touchStartY = 0
    let visible     = false
    let started     = false   // true once user has scrolled at least once

    // ── Compute target scale from current rendered dimensions ──────────
    function getMaxScale() {
      // Cap against viewport width — never scale wider than the screen
      const vw   = window.innerWidth
      const elW  = scaleEl.offsetWidth || 1
      return Math.min((vw / elW) * fillRatio, 10)
    }

    // ── Apply visual state for progress p ─────────────────────────────
    function applyProgress(p, animated = false) {
      scaleEl.style.transition     = animated
        ? 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none'
      // Anchor from passed-in origin
      scaleEl.style.transformOrigin = transformOrigin

      // Phase 1: fade surroundings
      if (fadeEnd > 0) {
        const p1 = Math.min(1, p / fadeEnd)
        fadeRefs.forEach(r => {
          if (r?.current) r.current.style.opacity = String(Math.max(0, 1 - p1 * 2.5))
        })
      }

      // Phase 2: scale — capped at viewport width
      const p2    = fadeEnd >= 1 ? p : Math.max(0, Math.min(1, (p - fadeEnd) / (1 - fadeEnd)))
      const scale = 1 + (getMaxScale() - 1) * p2
      scaleEl.style.transform = `scale(${scale})`
    }

    // ── Lock / unlock ──────────────────────────────────────────────────
    function setLocked(val) {
      if (locked === val) return
      locked = val
      document.body.style.overflow = val ? 'hidden' : ''
      if (val && isFirst)  window.scrollTo({ top: 0, behavior: 'instant' })
    }

    // ── IntersectionObserver (card sections only) ──────────────────────
    let observer = null

    if (!isFirst) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting

          if (entry.isIntersecting) {
            if (progress < 1 && !triggerRef) setLocked(true)
          } else {
            setLocked(false)
            // Reset when card scrolls off the top (user went back up)
            if (entry.boundingClientRect.top > 0) {
              progress = 0
              started  = false
              // Animated reset — smooth scale-down
              applyProgress(0, true)
              fadeRefs.forEach(r => { if (r?.current) r.current.style.opacity = '' })
            }
          }
        },
        { threshold: triggerRef ? 0 : 0.99 }
      )
      if (containerRef.current) observer.observe(containerRef.current)
    } else {
      // Hero: lock on mount
      visible = true
      setLocked(true)
    }

    // ── Wheel ──────────────────────────────────────────────────────────
    function isTriggerReached() {
      const triggerEl = triggerRef?.current
      return !triggerEl || triggerEl.getBoundingClientRect().top <= triggerTop
    }

    function onWheel(e) {
      if (e.deltaY < 0) {          // scroll up — never block
        setLocked(false)
        return
      }
      if (!visible) return
      if (progress >= 1) return
      if (!locked && !isTriggerReached()) return
      if (!locked) setLocked(true)
      e.preventDefault()
      started  = true
      progress = Math.min(1, Math.max(0, progress + e.deltaY * speed))
      applyProgress(progress)
      if (progress >= 1) setLocked(false)
    }

    function onWheelFirst(e) {     // hero variant — re-locks at top
      if (!locked && window.scrollY > 0) return
      if (!locked && window.scrollY === 0 && e.deltaY < 0 && progress >= 0.95) {
        setLocked(true); return
      }
      if (!locked) return
      e.preventDefault()
      started  = true
      progress = Math.min(1, Math.max(0, progress + e.deltaY * speed))
      applyProgress(progress)
      if (progress >= 1) setLocked(false)
    }

    // ── Touch ──────────────────────────────────────────────────────────
    function onTouchStart(e) { touchStartY = e.touches[0].clientY }

    function onTouchMove(e) {
      const delta = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      if (delta < 0) { setLocked(false); return }   // swipe up — never block
      if (!visible) return
      if (progress >= 1) return
      if (!locked && !isTriggerReached()) return
      if (!locked) setLocked(true)
      e.preventDefault()
      started  = true
      progress = Math.min(1, Math.max(0, progress + delta * speed * 2))
      applyProgress(progress)
      if (progress >= 1) setLocked(false)
    }

    const wheelFn = isFirst ? onWheelFirst : onWheel

    window.addEventListener('wheel',      wheelFn,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      document.body.style.overflow = ''
      observer?.disconnect()
      window.removeEventListener('wheel',      wheelFn)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef }
}
