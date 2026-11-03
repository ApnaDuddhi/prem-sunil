import { useEffect } from 'react'

// ---------------------------------------------------------------------------
// useCardStack
//
// Drives the page-stack scroll animation for a set of cards.
// Each card is position:sticky and "owns" one viewport-height of scroll.
//
// As scroll moves past a card:
//   • The card scales down from 1 → SCALE_OUT and translates up
//   • The next card is already rising from below (pure CSS: starts at
//     translateY(6%) and transitions to 0 when it becomes active)
//
// Call once, passing a CSS selector that matches all .page-card-inner elements.
// ---------------------------------------------------------------------------
export function useCardStack(innerSelector = '.page-card-inner') {
  useEffect(() => {
    const SCALE_OUT = 0.88   // how small the outgoing card shrinks
    const Y_OUT     = -6     // % to push it upward as it exits

    function update() {
      const cards = document.querySelectorAll(innerSelector)
      const vh    = window.innerHeight

      cards.forEach((inner, i) => {
        // Each card's sticky parent owns the scroll range:
        //   start = i * vh,  end = (i + 1) * vh
        const scrollStart = i * vh
        const scrollEnd   = (i + 1) * vh
        const y           = window.scrollY

        if (y <= scrollStart) {
          // Card hasn't been reached yet — rest at natural position
          inner.style.transform = ''
          inner.style.opacity   = ''
        } else if (y >= scrollEnd) {
          // Card has been fully scrolled past — keep it squished (hidden under next)
          inner.style.transform = `scale(${SCALE_OUT}) translateY(${Y_OUT}%)`
          inner.style.opacity   = '0'
        } else {
          // Card is actively scrolling out
          const p = (y - scrollStart) / vh          // 0 → 1
          const scale   = 1 - (1 - SCALE_OUT) * p
          const yPct    = Y_OUT * p
          const opacity = 1 - p * 1.4              // fade out slightly faster
          inner.style.transform = `scale(${scale}) translateY(${yPct}%)`
          inner.style.opacity   = String(Math.max(0, opacity))
        }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // sync on mount

    return () => window.removeEventListener('scroll', update)
  }, [innerSelector])
}
