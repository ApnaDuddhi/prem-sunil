import { useEffect, useRef } from 'react'

// Shared scroll-direction tracker (singleton — one listener for the whole app)
let _scrollDir = 'down'
let _lastY = 0
let _refCount = 0

function ensureTracker() {
  if (_refCount === 0) {
    _lastY = window.scrollY
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY
        _scrollDir = y > _lastY ? 'down' : 'up'
        _lastY = y
      },
      { passive: true }
    )
  }
  _refCount++
}

// Direction-aware IntersectionObserver — re-triggers on every enter/exit.
//
// When element ENTERS viewport:
//   scroll down → removes 'is-visible--up',   adds 'is-visible--down'
//   scroll up   → removes 'is-visible--down', adds 'is-visible--up'
//
// When element EXITS viewport:
//   both classes are removed so the next entry replays the animation.
export function useReveal(threshold = 0.12, rootMargin = '0px 0px -40px 0px') {
  const ref = useRef(null)

  useEffect(() => {
    ensureTracker()
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Re-apply the correct direction class so the CSS animation restarts
          el.classList.remove('is-visible--down', 'is-visible--up')
          // Force a reflow so removing + re-adding the same class replays the animation
          void el.offsetWidth
          el.classList.add(_scrollDir === 'up' ? 'is-visible--up' : 'is-visible--down')
        } else {
          // Element left the viewport — reset so next entry re-animates
          el.classList.remove('is-visible--down', 'is-visible--up')
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      _refCount--
    }
  }, [threshold, rootMargin])

  return ref
}
