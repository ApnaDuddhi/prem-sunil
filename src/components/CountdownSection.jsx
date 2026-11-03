import { useEffect, useState } from 'react'
import { weddingDate } from '../weddingData.js'
import { useReveal } from '../hooks/useReveal.js'

function getTimeLeft(target) {
  const total = target.getTime() - Date.now()
  const clamp = (n) => Math.max(0, n)
  return {
    total,
    days:    clamp(Math.floor(total / (1000 * 60 * 60 * 24))),
    hours:   clamp(Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: clamp(Math.floor((total / (1000 * 60)) % 60)),
    seconds: clamp(Math.floor((total / 1000) % 60)),
  }
}

function CountBox({ unit: u, index }) {
  const ref = useReveal(0.2)
  return (
    <div
      className="count-box reveal reveal-flip"
      ref={ref}
      style={{ '--delay': `${index * 0.12}s` }}
    >
      <span className="count-value">{String(u.value).padStart(2, '0')}</span>
      <span className="count-label">{u.label}</span>
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate))
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(id)
  }, [])

  if (time.total <= 0) {
    return <p className="countdown-done">💐 Today we celebrate! 💐</p>
  }

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map((u, i) => <CountBox key={u.label} unit={u} index={i} />)}
    </div>
  )
}

export default function CountdownSection() {
  const titleRef = useReveal(0.2)
  const subRef   = useReveal(0.2)
  return (
    <section className="section countdown-section" id="countdown">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>
        Counting down to forever
      </h2>
      <p className="section-sub reveal-fade-up" ref={subRef}>
        Until the Shubh Vivah · शुभ विवाह
      </p>
      <Countdown />
    </section>
  )
}
