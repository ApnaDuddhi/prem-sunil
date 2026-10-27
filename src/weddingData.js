// All wedding details live here so they are easy to edit in one place.

export const couple = {
  groom: {
    name: 'Sunil Kumar Yadav',
    shortName: 'Sunil',
  },
  bride: {
    name: 'Prema Kumari',
    shortName: 'Prema',
  },
}

// The main wedding ceremony — countdown points here.
export const weddingDate = new Date('2026-11-24T06:00:00+05:30')

export const events = [
  {
    key: 'tilak',
    name: 'Tilak',
    nameHindi: 'तिलक',
    date: '21 November 2026',
    day: 'Saturday',
    icon: '🪔',
  },
  {
    key: 'haldi',
    name: 'Haldi & Mandap',
    nameHindi: 'मण्डपाच्छादन / हल्दी',
    date: '22 November 2026',
    day: 'Sunday',
    icon: '🌼',
  },
  {
    key: 'vivah',
    name: 'Shubh Vivah (Wedding)',
    nameHindi: 'शुभ विवाह',
    date: '24 November 2026',
    day: 'Tuesday',
    icon: '💍',
    highlight: true,
  },
]

export const baraat = {
  note: 'Baraat departs at 6:00 PM',
}

export const gallery = [
  { src: 'couple-1', alt: 'Sunil and Prema' },
  { src: 'couple-2', alt: 'Sunil and Prema together' },
  { src: 'sunil-1', alt: 'Sunil' },
  { src: 'prema-1', alt: 'Prema' },
  { src: 'sunil-3', alt: 'Sunil' },
  { src: 'prema-2', alt: 'Prema' },
  { src: 'sunil-4', alt: 'Sunil' },
  { src: 'prema-3', alt: 'Prema' },
]
