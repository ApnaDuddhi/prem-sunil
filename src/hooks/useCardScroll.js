import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// useCardScroll
//
// Locks scroll while a card plays its internal sequence (progress 0 → 1).
// Uses IntersectionObserver to know when the card is on screen.
//
// Lock rules:
//   LOCK   — card enters viewport and progress < 1
//   UNLOCK — progress reaches 1  (scroll forward continues)
//   NEVER re-lock on scroll-up   (user can always scroll back freely)
// ---------------------------------------------------------------------------
export function useCardScroll(triggerRef, onProgress, speed = 0.003) {
  const progressRef = useRef(0)
  const lockedRef   = useRef(false)
  const visibleRef  = useRef(false)
  const doneRef     = useRef(false)   // true once progress has reached 1

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    let touchStartY = 0

    function setLocked(val) {
      if (lockedRef.current === val) return
      lockedRef.current = val
      document.body.style.overflow = val ? 'hidden' : ''
    }

    function advance(delta) {
      const p = Math.min(1, Math.max(0, progressRef.current + delta * speed))
      progressRef.current = p
      onProgress(p)
      if (p >= 1) {
        doneRef.current = true
        setLocked(false)
      }
    }

    // ── IntersectionObserver ────────────────────────────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting

        if (entry.isIntersecting && !doneRef.current) {
          // Card entered and sequence not yet complete — lock
          setLocked(true)
        }

        if (!entry.isIntersecting) {
          // Card left viewport — always unlock so nothing stays blocked
          setLocked(false)
          // Reset only if it left from above (user scrolled back past it)
          // so it can replay. Detect "above" by bounding rect.
          const rect = entry.boundingClientRect
          if (rect.top > 0) {
            // Card scrolled off the top = user went back up
            progressRef.current = 0
            doneRef.current     = false
            onProgress(0)
          }
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)

    // ── Wheel ───────────────────────────────────────────────────────────
    function onWheel(e) {
      // Scrolling up — NEVER block, always let through
      if (e.deltaY < 0) {
        setLocked(false)
        return
      }

      // Scrolling down but card not visible or already done — ignore
      if (!visibleRef.current || doneRef.current) return
      if (!lockedRef.current) return

      e.preventDefault()
      advance(e.deltaY)
    }

    // ── Touch ───────────────────────────────────────────────────────────
    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY
    }

    function onTouchMove(e) {
      const delta = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY

      // Swiping up — never block
      if (delta < 0) {
        setLocked(false)
        return
      }

      if (!visibleRef.current || doneRef.current) return
      if (!lockedRef.current) return

      e.preventDefault()
      advance(delta * 2)
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      setLocked(false)
      observer.disconnect()
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
