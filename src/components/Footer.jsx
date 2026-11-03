import { couple } from '../weddingData.js'
import { useReveal } from '../hooks/useReveal.js'

export default function Footer() {
  const namesRef = useReveal(0.3)
  const dateRef  = useReveal(0.3)
  return (
    <footer className="footer">
      <p className="footer-names footer-shimmer" ref={namesRef}>
        {couple.groom.shortName} &amp; {couple.bride.shortName}
      </p>
      <p className="footer-date reveal-fade-up" ref={dateRef}>
        24 November 2026
      </p>
      <p className="footer-made">Made with ♥ for our special day</p>
    </footer>
  )
}
