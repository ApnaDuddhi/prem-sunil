import { useReveal } from '../hooks/useReveal.js'

export default function Invitation() {
  const titleRef = useReveal(0.2)
  const textRef  = useReveal(0.3)
  return (
    <section className="section invite" id="invite">
      <h2 className="section-title title-scale-reveal" ref={titleRef}>
        With Love &amp; Blessings
      </h2>
      <p className="invite-text reveal reveal-ink" ref={textRef}>
        Your presence will make our celebration complete. We warmly invite you
        and your family to share in our joy.
      </p>
    </section>
  )
}
