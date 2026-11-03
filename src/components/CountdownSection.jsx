import { useEffect, useRef, useState } from 'react'
import { weddingDate } from '../weddingData.js'
import { useReveal }       from '../hooks/useReveal.js'
import { useSectionScale } from '../hooks/useSectionScale.js'

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

// ---------------------------------------------------------------------------
// SplitBox
// ---------------------------------------------------------------------------
function SplitBox({ unit: u, index, isSeconds }) {
  const ref      = useReveal(0.15)
  const valueRef = useRef(null)
  const prevVal  = useRef(u.value)

  useEffect(() => {
    if (!valueRef.current) return
    if (prevVal.current === u.value) return
    prevVal.current = u.value
    const el = valueRef.current
    el.classList.remove('count-flip')
    void el.offsetWidth
    el.classList.add('count-flip')
  }, [u.value])

  return (
    <div
      className="count-box reveal count-box--split"
      ref={ref}
      style={{ '--delay': `${index * 0.15}s` }}
    >
      <div className="count-box-top"    aria-hidden="true" />
      <div className="count-box-bottom" aria-hidden="true" />
      <span
        className={`count-value${isSeconds ? ' count-value--seconds' : ''}`}
        ref={valueRef}
      >
        {String(u.value).padStart(2, '0')}
      </span>
      <span className="count-label">{u.label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Countdown timer
// ---------------------------------------------------------------------------
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
    { label: 'Days',    value: time.days    },
    { label: 'Hours',   value: time.hours   },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map((u, i) => (
        <SplitBox key={u.label} unit={u} index={i} isSeconds={u.label === 'Seconds'} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CountdownSection
// ---------------------------------------------------------------------------
export default function CountdownSection() {
  const titleRef   = useReveal(0.15)
  const subRef     = useReveal(0.15)
  const groupRef   = useRef(null)   // scales

  const { containerRef } = useSectionScale({
    scaleRef : groupRef,
    fadeRefs : [],              // nothing fades on this card
    fadeEnd  : 0.0,             // skip phase 1, go straight to scale
    speed    : 0.002,
    fillRatio: 0.96,
    isFirst  : false,
  })

  return (
    <section
      className="section countdown-section"
      id="countdown"
      ref={containerRef}
    >
      <div className="cd-ring"            aria-hidden="true" />
      <div className="cd-ring cd-ring--2" aria-hidden="true" />

      {/* This div scales to fill the card width */}
      <div className="cd-scale-group" ref={groupRef}>
        <h2 className="section-title title-scale-reveal" ref={titleRef}>
          Counting down to forever
        </h2>
        <p className="section-sub reveal-fade-up" ref={subRef}>
          Until the Shubh Vivah · शुभ विवाह
        </p>
        <Countdown />
      </div>
    </section>
  )
}
