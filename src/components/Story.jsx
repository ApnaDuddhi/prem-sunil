import { useRef } from "react";
import { couple } from "../weddingData.js";
import { useReveal } from "../hooks/useReveal.js";

const BASE = import.meta.env.BASE_URL;
const photo = (name) => `${BASE}photos/${name}.jpeg`;

export default function Story() {
  const titleRef = useReveal(0.2);
  const subRef = useReveal(0.2);
  const groomRef = useReveal(0.15);
  const heartRef = useReveal(0.9);
  const brideRef = useReveal(0.15);

  return (
    <section className="section story" id="couple">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>
        The Happy Couple
      </h2>
      <p className="section-sub reveal-fade-up" ref={subRef}>
        Two hearts, one journey
      </p>

      <div className="story-content">
        <div className="couple-cards">
          <article
            className="person reveal reveal-depth"
            ref={groomRef}
            style={{ "--delay": "0s" }}
          >
            <div
              className="person-photo person-photo-zoom"
              style={{ backgroundImage: `url(${photo("sunil-1")})` }}
            />
          </article>
          <span className="person-role">The Groom</span>
          <h3 className="couple-name">{couple.groom.name}</h3>

          <div className="heart" ref={heartRef}>
            💞
          </div>

          <article
            className="person reveal reveal-depth"
            ref={brideRef}
            style={{ "--delay": "0.15s" }}
          >
            <div
              className="person-photo person-photo-zoom"
              style={{ backgroundImage: `url(${photo("prema-1")})` }}
            />
          </article>
          <span className="person-role">The Bride</span>
          <h3 className="couple-name">{couple.bride.name}</h3>
        </div>
      </div>
    </section>
  );
}
