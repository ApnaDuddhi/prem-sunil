import { useEffect, useState } from 'react'
import { usePreloadImages }  from './hooks/usePreloadImages.js'
import { useCardStack }      from './hooks/useCardStack.js'
import Preloader             from './components/Preloader.jsx'
import Hero                  from './components/Hero.jsx'
import CountdownSection      from './components/CountdownSection.jsx'
import Story                 from './components/Story.jsx'
import Events                from './components/Events.jsx'
import Gallery               from './components/Gallery.jsx'
import Invitation            from './components/Invitation.jsx'
import Footer                from './components/Footer.jsx'

// Cards that live in the stack (Hero is separate — full-bleed, no rounded card)
const CARDS = [
  { id: 'countdown', label: 'Countdown', mod: 'countdown' },
  { id: 'couple',    label: 'Story',     mod: 'story'     },
  { id: 'events',    label: 'Events',    mod: 'events'    },
  { id: 'gallery',   label: 'Gallery',   mod: 'gallery'   },
  { id: 'invite',    label: 'Invite',    mod: 'invitation'},
  { id: 'footer',    label: 'Footer',    mod: 'footer'    },
]

// Dot navigator — shows which card is active
function DotNav({ activeIndex }) {
  return (
    <nav className="page-card-dot-nav" aria-hidden="true">
      {CARDS.map((c, i) => (
        <span
          key={c.id}
          className={`page-card-dot ${i === activeIndex ? 'is-active' : ''}`}
        />
      ))}
    </nav>
  )
}

// Wraps a section inside its sticky card slot
function PageCard({ mod, zIndex, children }) {
  return (
    <div
      className={`page-card page-card--${mod}`}
      style={{ '--card-z': zIndex }}
    >
      <div className="page-card-inner">
        <div className="page-card-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { progress, done } = usePreloadImages()
  const [minTimePassed, setMinTimePassed]  = useState(false)
  const [hidden, setHidden]                = useState(false)
  const [activeCard, setActiveCard]        = useState(0)

  // Minimum preloader display time
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 900)
    return () => clearTimeout(t)
  }, [])

  const ready = done && minTimePassed

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setHidden(true), 600)
    return () => clearTimeout(t)
  }, [ready])

  // Drive the card-stack transforms
  useCardStack('.page-card-inner')

  // Snap to the nearest page(s) crossed by the user's scroll gesture.
  useEffect(() => {
    let lastY = window.scrollY
    let gestureStartY = null
    let gestureStartSection = 0
    let gestureDirection = null
    let settleTimer
    let snapTimer
    let snapping = false

    const clearSettleTimer = () => {
      window.clearTimeout(settleTimer)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      const direction = currentY >= lastY ? 'down' : 'up'
      if (!snapping && document.body.style.overflow !== 'hidden') {
        if (gestureDirection !== direction) {
          gestureStartY = lastY
          gestureStartSection = Math.round(lastY / window.innerHeight)
          gestureDirection = direction
        }
      }
      lastY = currentY
      clearSettleTimer()

      if (document.body.style.overflow === 'hidden' || snapping) return

      settleTimer = window.setTimeout(() => {
        const vh = window.innerHeight
        const totalCards = CARDS.length + 1 // include the Hero
        const distance = window.scrollY - gestureStartY
        const crossedThreshold = direction === 'down'
          ? distance >= vh * 0.2
          : distance <= -vh * 0.2
        const pagesMoved = crossedThreshold
          ? Math.max(1, Math.round(Math.abs(distance) / vh))
          : 0
        const step = pagesMoved * (direction === 'down' ? 1 : -1)
        const targetSection = Math.max(
          0,
          Math.min(totalCards - 1, gestureStartSection + step)
        )
        const targetY = targetSection * vh

        if (Math.abs(targetY - window.scrollY) < 1) return

        snapping = true
        gestureStartY = null
        gestureDirection = null
        window.scrollTo({
          top: targetY,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        })
        snapTimer = window.setTimeout(() => {
          snapping = false
          lastY = window.scrollY
        }, 700)
      }, 120)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearSettleTimer()
      window.clearTimeout(snapTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Keep Story's nested scroller inactive until its card reaches the top.
  useEffect(() => {
    const storyCard = document.querySelector('.page-card--story')
    const nextCard = document.querySelector('.page-card--events')
    if (!storyCard || !nextCard) return

    const updateStoryScroll = () => {
      const storyTop = storyCard.getBoundingClientRect().top
      const nextTop = nextCard.getBoundingClientRect().top
      storyCard.classList.toggle('is-scroll-active', storyTop <= 0 && nextTop > 0)
    }

    window.addEventListener('scroll', updateStoryScroll, { passive: true })
    window.addEventListener('resize', updateStoryScroll)
    updateStoryScroll()

    return () => {
      window.removeEventListener('scroll', updateStoryScroll)
      window.removeEventListener('resize', updateStoryScroll)
    }
  }, [])

  // Track which card is active for the dot nav
  useEffect(() => {
    const vh = window.innerHeight
    const onScroll = () => {
      // Hero lives before the stack; stack starts after 100vh (hero)
      const stackOffset = vh  // hero is 100vh
      const idx = Math.min(
        CARDS.length - 1,
        Math.max(0, Math.floor((window.scrollY - stackOffset) / vh))
      )
      setActiveCard(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Total page height: hero (100vh) + N cards (each 100vh)
  const stackHeight = `calc(${CARDS.length} * 100vh)`

  return (
    <div className="app">
      {!hidden && (
        <div className={`preloader-wrap ${ready ? 'is-done' : ''}`}>
          <Preloader progress={progress} />
        </div>
      )}

      {/* Hero — full-bleed, manages its own scroll sequence */}
      <Hero />

      {/* Page-stack — each section is a sticky card */}
      <div className="page-stack" style={{ height: stackHeight }}>
        <PageCard mod="countdown" zIndex={10}>
          <CountdownSection />
        </PageCard>

        <PageCard mod="story" zIndex={20}>
          <Story />
        </PageCard>

        <PageCard mod="events" zIndex={30}>
          <Events />
        </PageCard>

        <PageCard mod="gallery" zIndex={40}>
          <Gallery />
        </PageCard>

        <PageCard mod="invitation" zIndex={50}>
          <Invitation />
        </PageCard>

        <PageCard mod="footer" zIndex={60}>
          <Footer />
        </PageCard>
      </div>

      {/* Dot navigator — fixed to the right edge */}
      <DotNav activeIndex={activeCard} />
    </div>
  )
}
