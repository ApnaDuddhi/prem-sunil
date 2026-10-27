// All wedding details live here so they are easy to edit in one place.

export const couple = {
  groom: {
    name: 'Sunil Kumar Yadav',
    shortName: 'Sunil',
    role: 'Engineer',
    father: 'Shri Triveni Yadav',
    mother: 'Smt. Parvati Devi',
    grandfather: 'Shri Gopal Das Yadav',
    grandmother: 'Smt. Geeta Devi',
    village: 'Bojh, Post - Fakri Duhi, Sonbhadra (U.P.)',
  },
  bride: {
    name: 'Prema Kumari',
    shortName: 'Prema',
    father: 'Shri Kailash Yadav',
    mother: 'Smt. Kaushalya Devi',
    grandfather: 'Shri Kamleshwar Yadav',
    grandmother: 'Smt. Sahaya Devi',
    village: 'Barwari, Post - Agarikhad, Thana - Bhawanathpur, Distt. - Garhwa (Jharkhand)',
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
    key: 'dwarchari',
    name: 'Dwarchari',
    nameHindi: 'द्वारचारी',
    date: '23 November 2026',
    day: 'Monday',
    icon: '🎶',
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
  {
    key: 'reception',
    name: 'Reception (Preeti Bhoj)',
    nameHindi: 'प्रीतिभोज',
    date: '25 November 2026',
    day: 'Wednesday',
    time: 'From 5:00 PM',
    icon: '🍽️',
  },
]

export const baraat = {
  note: 'Baraat departs at 9:00 PM',
}

export const invitedBy = {
  presenter: 'Shri Gopal Das Yadav',
  humble: 'Shri Ram Bilas Yadav, Shri Triveni Yadav (Retd. Railway)',
  phones: ['03077 50170', '9335999878'],
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
