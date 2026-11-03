import { useEffect, useState } from 'react'
import { usePreloadImages } from './hooks/usePreloadImages.js'
import Preloader        from './components/Preloader.jsx'
import Hero             from './components/Hero.jsx'
import CountdownSection from './components/CountdownSection.jsx'
import Story            from './components/Story.jsx'
import Events           from './components/Events.jsx'
import Gallery          from './components/Gallery.jsx'
import Invitation       from './components/Invitation.jsx'
import Footer           from './components/Footer.jsx'

export default function App() {
  const { progress, done } = usePreloadImages()
  const [minTimePassed, setMinTimePassed] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Hold the loader for at least 900 ms so it reads as intentional
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 900)
    return () => clearTimeout(t)
  }, [])

  const ready = done && minTimePassed

  // Let the fade-out animation finish before removing from the DOM
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setHidden(true), 600)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <div className="app">
      {!hidden && (
        <div className={`preloader-wrap ${ready ? 'is-done' : ''}`}>
          <Preloader progress={progress} />
        </div>
      )}
      <Hero />
      <CountdownSection />
      <Story />
      <Events />
      <Gallery />
      <Invitation />
      <Footer />
    </div>
  )
}
