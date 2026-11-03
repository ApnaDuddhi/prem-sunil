import { couple } from '../weddingData.js'
import { useReveal } from '../hooks/useReveal.js'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

export default function Story() {
  const titleRef = useReveal(0.2)
  const subRef   = useReveal(0.2)
  const groomRef = useReveal(0.15)
  const heartRef = useReveal(0.5)
  const brideRef = useReveal(0.15)

  return (
    <section className="section story" id="couple">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>
        The Happy Couple
      </h2>
      <p className="section-sub reveal-fade-up" ref={subRef}>
        Two hearts, one journey
      </p>
      <div className="couple-cards">
        <article className="person reveal reveal-depth" ref={groomRef} style={{ '--delay': '0s' }}>
          <div
            className="person-photo person-photo-zoom"
            style={{ backgroundImage: `url(${photo('sunil-1')})` }}
          />
          <span className="person-role">The Groom</span>
          <h3>{couple.groom.name}</h3>
        </article>

        <div className="heart reveal reveal-pop" ref={heartRef}>💞</div>

        <article className="person reveal reveal-depth" ref={brideRef} style={{ '--delay': '0.15s' }}>
          <div
            className="person-photo person-photo-zoom"
            style={{ backgroundImage: `url(${photo('prema-1')})` }}
          />
          <span className="person-role">The Bride</span>
          <h3>{couple.bride.name}</h3>
        </article>
      </div>
    </section>
  )
}
