import { useEffect, useRef } from 'react'

// Moves a background element at `factor` of scroll speed for a parallax feel
export function useScrollParallax(factor = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      el.style.transform = `scale(1.15) translateY(${window.scrollY * factor}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [factor])

  return ref
}
