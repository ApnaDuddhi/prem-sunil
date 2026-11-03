import { couple } from '../weddingData.js'

export default function Preloader({ progress }) {
  const percent = Math.round(progress * 100)
  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Loading">
      <div className="preloader-inner">
        <span className="preloader-rings" aria-hidden="true" />
        <p className="preloader-names">
          {couple.groom.shortName} <span className="amp">&amp;</span>{' '}
          {couple.bride.shortName}
        </p>
        <p className="preloader-sub">Loading our special day…</p>
        <div className="preloader-bar" aria-hidden="true">
          <span className="preloader-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="preloader-percent">{percent}%</p>
      </div>
    </div>
  )
}
