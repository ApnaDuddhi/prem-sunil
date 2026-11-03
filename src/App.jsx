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
