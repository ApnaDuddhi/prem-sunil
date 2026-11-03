import { useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const photo = (name) => `${BASE}photos/${name}.jpeg`

const ABOVE_FOLD = ['couple-2', 'sunil-1', 'prema-1']

export function usePreloadImages() {
  const unique = [...new Set(ABOVE_FOLD)]
  const total = unique.length
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    let done = 0
    const bump = () => { done += 1; setLoaded(done) }
    const imgs = unique.map((name) => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = photo(name)
      if (img.complete && img.naturalWidth > 0) bump()
      return img
    })
    return () => imgs.forEach((img) => (img.onload = img.onerror = null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = total === 0 ? 1 : Math.min(loaded, total) / total
  return { progress, done: loaded >= total }
}
