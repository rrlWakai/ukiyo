export type BookingType = 'room' | 'event' | 'entrance'
export type StayType = 'day' | 'night' | '22hrs'
export type SeasonType = 'weekday' | 'weekend' | 'peak'
export type EntranceTime = 'day' | 'night'

export type AddOnId = 'towel' | 'breakfast' | 'grill'
export type ExtensionHours = 1 | 2

export type Room = {
  slug: string
  name: string
  subtitle: string
  tagline?: string
  badge?: string
  description: string
  image: string
  gallery: string[]
  capacity: number
  minPax?: number
  maxPax?: number
  features: string[]
  inclusions: string[]
  valuePoints?: string[]
  notes: string[]
  testimonial: string
  rates: Record<StayType, Record<SeasonType, number>>
}

export type EventPackage = {
  id: string
  name: string
  subtitle: string
  price: number
  pax: string
  description: string
  features: string[]
  featured?: boolean
}

export type AddOn = {
  id: AddOnId
  name: string
  price: number
}

export type EntranceOption = {
  id: EntranceTime
  label: string
  adultPrice: number
  kidPrice: number
  schedule: string
}

export type RoomBookingState = {
  selectedRoom: string
  date: string
  guests: number
  stayType: StayType
  addOns: AddOnId[]
}

export type EventBookingState = {
  selectedPackage: string
  date: string
  guests: number
}

export type EntranceBookingState = {
  entranceTime: EntranceTime
  date: string
  adults: number
  kids: number
}

export type BookingState = {
  activeType: BookingType
  room: RoomBookingState
  event: EventBookingState
  entrance: EntranceBookingState
}

export type BookingPayload = {
  type: BookingType
  itemId: string
  date: string
  guests: number
  addOns: string[]
  total: number
}

export type BookingSubmissionState = {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message: string
  payload: BookingPayload | null
}

export const roomBadges = ['Fully Airconditioned', 'Private CR', 'Free Entrance']

export const rooms: Room[] = [
  {
    slug: 'lanai-suite',
    name: 'Lanai Suite',
    badge: 'Affordable Stay',
    subtitle: 'Cozy air-conditioned room for 2–3 persons with free entrance included.',
    description:
      'Lanai Suite is a comfortable, fully air-conditioned room perfect for small groups. Steps away from the pool with everything you need for a relaxing stay.',
    image: '/images/lanai-1.jpg',
    gallery: ['/images/lanai-1.jpg', '/images/lanai-2.jpg', '/images/lanai-3.jpg', '/images/lanai-4.mp4'],
    capacity: 3,
    minPax: 2,
    features: [
      'Fully airconditioned',
      'With mini refrigerator',
      'With television',
      'With 1 bed',
      'With own CR',
    ],
    inclusions: ['Free entrance for 3 pax', 'Pool access', 'Private room'],
    notes: [
      'Free entrance for up to 3 pax included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 3 pax',
    ],
    testimonial: 'Super convenient — pool is literally outside our door. Perfect for the group.',
    rates: {
      day:    { weekday: 1700, weekend: 1900, peak: 2100 },
      night:  { weekday: 1900, weekend: 2200, peak: 2400 },
      '22hrs':{ weekday: 2800, weekend: 3200, peak: 3500 },
    },
  },
  {
    slug: 'veranda-suite',
    name: 'Veranda Suite',
    badge: 'Best for Small Groups',
    subtitle: 'Spacious air-conditioned room for 3–4 persons with sofa, 2 beds, and free entrance.',
    description:
      'Veranda Suite gives your group more space to relax — a sofa, 2 beds, and a private CR make it the perfect base for a comfortable stay.',
    image: '/images/veranda-1.jpg',
    gallery: ['/images/veranda-1.jpg', '/images/veranda-2.jpg', '/images/veranda-3.jpg', '/images/veranda-4.jpg'],
    capacity: 4,
    minPax: 3,
    features: [
      'Fully airconditioned',
      'With mini refrigerator',
      'With television',
      'With sofa & cabinet',
      'With 2 beds',
      'With own CR',
    ],
    inclusions: ['Free entrance for 4 pax', 'Pool access', 'Private room'],
    notes: [
      'Free entrance for up to 4 pax included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 4 pax',
    ],
    testimonial: 'Enough room for the whole group to chill inside and outside. Loved it.',
    rates: {
      day:    { weekday: 2200, weekend: 2500, peak: 2800 },
      night:  { weekday: 2600, weekend: 2900, peak: 3200 },
      '22hrs':{ weekday: 3800, weekend: 4200, peak: 4800 },
    },
  },
  {
    slug: 'executive-villa',
    name: 'Executive Villa & Pool Option',
    tagline: 'Spacious. Ideal for Groups',
    badge: 'Best for Large Groups',
    subtitle: '1 villa & 3 cottages — ideal for 30–50 pax in a fully private setting.',
    description:
      'Executive villa and pool access with 1 villa & 3 cottages. Fits 30–50 pax comfortably. Perfect for large families, barkadas, and company gatherings. 100% private setting with exclusive use.',
    image: '/images/executive-1.jpg',
    gallery: ['/images/executive-1.jpg', '/images/executive-2.jpg', '/images/executive-3.jpg', '/images/executive-4.mp4'],
    capacity: 30,
    maxPax: 50,
    features: [
      'Executive villa included',
      '3 cottages included',
      'Pool access',
      '100% private setting',
      'Fits 30–50 pax',
      'Exclusive use',
    ],
    inclusions: ['Executive villa', '3 cottages', 'Pool access', 'Exclusive use'],
    notes: [
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 50 pax',
      'Fully exclusive — private to your group',
    ],
    testimonial: 'Perfect for our company outing. The whole group had the place to themselves — no crowds, just good vibes.',
    rates: {
      day:    { weekday: 10000, weekend: 10000, peak: 10000 },
      night:  { weekday: 12000, weekend: 12000, peak: 12000 },
      '22hrs':{ weekday: 18000, weekend: 18000, peak: 18000 },
    },
  },
  {
    slug: 'exclusive-villa',
    name: 'Exclusive Main Pool Experience',
    tagline: 'Private. Spacious. Effortless.',
    badge: 'Premium Experience',
    subtitle: 'Full private resort — 6 poolfront rooms, 3 pools, and 5 cottages for big groups.',
    description:
      'Full private resort experience. 6 poolfront rooms, 3 connected pools, 5 spacious cottages. Premium, aesthetic environment. Ideal for big groups who want the whole place to themselves.',
    image: '/images/exclusive-1.jpg',
    gallery: ['/images/exclusive-1.jpg', '/images/exclusive-2.jpg', '/images/exclusive-3.jpg', '/images/exclusive-4.mp4'],
    capacity: 50,
    maxPax: 200,
    features: [
      '6 poolfront rooms',
      '3 connected pools',
      '5 spacious cottages',
      'Full private resort',
      'Premium aesthetic environment',
      'Ideal for big groups',
    ],
    inclusions: ['6 poolfront rooms', '3 connected pools', '5 cottages', 'Full exclusive use'],
    valuePoints: [
      'Privacy without isolation',
      'Comfortable space for everyone',
      'Instagram-worthy environment',
      'Smooth, no-stress experience',
    ],
    notes: [
      '50% downpayment required',
      'Full resort exclusive use',
      'Contact us for custom arrangements',
    ],
    testimonial: 'Booked the full experience for our company event. Smooth, private, premium — exactly what we needed.',
    rates: {
      day:    { weekday: 14999, weekend: 14999, peak: 14999 },
      night:  { weekday: 17999, weekend: 17999, peak: 17999 },
      '22hrs':{ weekday: 26999, weekend: 26999, peak: 26999 },
    },
  },
]

export const eventPackages: EventPackage[] = [
  {
    id: 'event-stay-lite',
    name: 'Event Stay Lite',
    subtitle: 'Good for 30–50 pax',
    price: 18000,
    pax: '30–50 pax',
    description:
      'A solid starter package for team outings, birthday celebrations, and group day events — venue, pool, and a holding room included.',
    features: [
      'Afterglow Events Place (4–5 hrs)',
      'Pool access (shared or scheduled)',
      '1 Day-use Room (prep / holding / rest)',
      'Tables & chairs',
      'Host + Event Coordinator',
    ],
  },
  {
    id: 'event-stay-plus',
    name: 'Event Stay Plus',
    subtitle: 'Good for 40–70 pax',
    price: 32000,
    pax: '40–70 pax',
    description:
      'Our most-booked package for company outings, team building, and big celebrations — includes overnight stay and late-night pool hours.',
    features: [
      'Afterglow Events Place (5–6 hrs)',
      'Pool access (semi-exclusive hours)',
      '1 Overnight Room (Lanai / Veranda)',
      'Tables & chairs',
      'Host + Event Coordinator',
      'Late-night use / after-party vibes',
    ],
    featured: true,
  },
  {
    id: 'event-stay-exclusive',
    name: 'Event Stay Exclusive',
    subtitle: 'Good for 100–200 pax',
    price: 58000,
    pax: '100–200 pax',
    description:
      'Full resort takeover for large company events, grand reunions, and major celebrations. Exclusive pool use, multiple villas, and full coordination.',
    features: [
      'Afterglow Events Place (6–8 hrs)',
      'Exclusive use of all 3 pools',
      '2–4 Overnight Rooms / Villas',
      'Open spaces for team games & programs',
      'Host + Event Coordinator',
      'Full privacy — your event, your rules',
    ],
  },
]

export const entranceOptions: EntranceOption[] = [
  { id: 'day', label: 'Day Tour', adultPrice: 350, kidPrice: 250, schedule: '9AM-5PM' },
  { id: 'night', label: 'Night Swim', adultPrice: 400, kidPrice: 300, schedule: '7PM-7AM' },
]

export const stayTypeOptions: Array<{ id: StayType; label: string; description: string }> = [
  { id: 'day', label: 'Day Tour', description: '9AM–5PM' },
  { id: 'night', label: 'Night Swim', description: '7PM–7AM' },
  { id: '22hrs', label: '22 Hours', description: '9AM–7AM next day' },
]

export const seasonOptions: Array<{ id: SeasonType; label: string }> = [
  { id: 'weekday', label: 'Weekday' },
  { id: 'weekend', label: 'Weekend / Holiday' },
  { id: 'peak', label: 'Peak Season' },
]

export const addOns: AddOn[] = [
  { id: 'towel', name: 'Towel', price: 100 },
  { id: 'breakfast', name: 'Breakfast', price: 250 },
  { id: 'grill', name: 'Grill / KTV', price: 1000 },
]

export const extensionRates: Record<string, Record<ExtensionHours, number>> = {
  'lanai-suite':     { 1: 300,  2: 500  },
  'veranda-suite':   { 1: 400,  2: 700  },
  'executive-villa': { 1: 500,  2: 850  },
  'exclusive-villa': { 1: 700,  2: 1200 },
  'cottage':         { 1: 200,  2: 300  },
}

export function getExtensionPrice(slug: string, hours: ExtensionHours): number {
  return extensionRates[slug]?.[hours] ?? 0
}

export const defaultSubmissionState: BookingSubmissionState = {
  status: 'idle',
  message: '',
  payload: null,
}

export function getDefaultBookingState(): BookingState {
  return {
    activeType: 'room',
    room: {
      selectedRoom: rooms[0].name,
      date: '',
      guests: 2,
      stayType: 'night',
      addOns: [],
    },
    event: {
      selectedPackage: eventPackages[0].name,
      date: '',
      guests: 40,
    },
    entrance: {
      entranceTime: 'day',
      date: '',
      adults: 1,
      kids: 0,
    },
  }
}

export function getRoomByName(name: string) {
  return rooms.find((room) => room.name === name) ?? rooms[0]
}

export function getRoomBySlug(slug: string) {
  return rooms.find((room) => room.slug === slug)
}

export function getEventPackageByName(name: string) {
  return eventPackages.find((pkg) => pkg.name === name) ?? eventPackages[0]
}

export function getEntranceOptionById(id: EntranceTime) {
  return entranceOptions.find((option) => option.id === id) ?? entranceOptions[0]
}

export function formatPrice(value: number) {
  return `₱${value.toLocaleString()}`
}

export function roomHasSeasonalPricing(room: Room): boolean {
  return Object.values(room.rates).some(
    ({ weekday, weekend, peak }) => weekday !== weekend || weekend !== peak,
  )
}

const DEFAULT_SEASON = 'weekday' as const

export function calculateRoomTotal(roomBooking: RoomBookingState) {
  const room = getRoomByName(roomBooking.selectedRoom)
  const baseRate = room.rates[roomBooking.stayType][DEFAULT_SEASON]
  const addOnTotal = roomBooking.addOns.reduce((sum, id) => {
    const addOn = addOns.find((item) => item.id === id)
    return sum + (addOn?.price ?? 0)
  }, 0)
  return baseRate + addOnTotal
}

export function calculateEventTotal(eventBooking: EventBookingState) {
  return getEventPackageByName(eventBooking.selectedPackage).price
}

export function calculateEntranceTotal(entranceBooking: EntranceBookingState) {
  const option = getEntranceOptionById(entranceBooking.entranceTime)
  return entranceBooking.adults * option.adultPrice + entranceBooking.kids * option.kidPrice
}

export function calculateActiveTotal(state: BookingState) {
  if (state.activeType === 'event') return calculateEventTotal(state.event)
  if (state.activeType === 'entrance') return calculateEntranceTotal(state.entrance)
  return calculateRoomTotal(state.room)
}

export function buildBookingPayload(state: BookingState): BookingPayload {
  if (state.activeType === 'event') {
    const pkg = getEventPackageByName(state.event.selectedPackage)
    return {
      type: 'event',
      itemId: pkg.id,
      date: state.event.date,
      guests: state.event.guests,
      addOns: [],
      total: calculateEventTotal(state.event),
    }
  }

  if (state.activeType === 'entrance') {
    return {
      type: 'entrance',
      itemId: state.entrance.entranceTime,
      date: state.entrance.date,
      guests: state.entrance.adults + state.entrance.kids,
      addOns: [],
      total: calculateEntranceTotal(state.entrance),
    }
  }

  const room = getRoomByName(state.room.selectedRoom)
  return {
    type: 'room',
    itemId: room.slug,
    date: state.room.date,
    guests: state.room.guests,
    addOns: [...state.room.addOns],
    total: calculateRoomTotal(state.room),
  }
}

export function clampGuestsForRoom(roomName: string, guestCount: number) {
  const room = getRoomByName(roomName)
  return Math.min(Math.max(1, guestCount), room.maxPax ?? room.capacity)
}
