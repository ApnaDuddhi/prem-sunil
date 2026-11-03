import { events, baraat } from '../weddingData.js'
import { useReveal } from '../hooks/useReveal.js'

function EventCard({ event: e, index }) {
  const ref = useReveal(0.15)
  return (
    <div
      className={`event-card reveal reveal-stripe ${e.highlight ? 'highlight' : ''}`}
      ref={ref}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className="event-icon">{e.icon}</div>
      <div className="event-body">
        <h3>
          {e.name} <span className="event-hindi">{e.nameHindi}</span>
        </h3>
        <p className="event-date">{e.date} · {e.day}</p>
        {e.time && <p className="event-time">{e.time}</p>}
      </div>
    </div>
  )
}

export default function Events() {
  const titleRef  = useReveal(0.2)
  const subRef    = useReveal(0.2)
  const baraatRef = useReveal()
  return (
    <section className="section events" id="events">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>
        Wedding Ceremonies
      </h2>
      <p className="section-sub reveal-fade-up" ref={subRef}>
        सांस्कृतिक कार्यक्रम
      </p>
      <div className="timeline">
        {events.map((e, i) => <EventCard key={e.key} event={e} index={i} />)}
      </div>
      <p className="baraat-note reveal-fade-up" ref={baraatRef}>
        🐎 {baraat.note}
      </p>
    </section>
  )
}
