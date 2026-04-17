export type BookingType = 'room' | 'event' | 'entrance'
export type StayType = 'day' | 'night' | '22hrs'
export type EntranceTime = 'day' | 'night'

export type AddOnId = 'towel' | 'breakfast' | 'grill' | 'extension'

export type Room = {
  slug: string
  name: string
  subtitle: string
  description: string
  image: string
  gallery: string[]
  capacity: number
  features: string[]
  inclusions: string[]
  notes: string[]
  testimonial: string
  rates: Record<StayType, number>
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
    subtitle: 'A bright pool-facing suite for quick day escapes and cozy overnight stays.',
    description:
      'Lanai Suite is designed for couples and small groups who want an easy, comfortable stay close to the pool and lounge areas.',
    image: '/images/room-1.jpg',
    gallery: ['/images/room-1.jpg', '/images/gallery-2.jpg', '/images/gallery-1.jpg'],
    capacity: 3,
    features: ['Fully airconditioned', 'With TV', 'With mini refrigerator', 'Comfortable beds', 'Private CR'],
    inclusions: ['Free entrance for guests', 'Pool access', 'Private space'],
    notes: [
      'Free entrance included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 3 pax',
    ],
    testimonial: 'Perfect for a quiet reset after a full day in the pool.',
    rates: { day: 2200, night: 3200, '22hrs': 4200 },
  },
  {
    slug: 'veranda-suite',
    name: 'Veranda Suite',
    subtitle: 'A flexible family suite with more space for relaxed day or night stays.',
    description:
      'Veranda Suite gives guests a larger indoor lounge area, making it ideal for barkadas and families who want comfort without going full-villa.',
    image: '/images/room-2.jpg',
    gallery: ['/images/room-2.jpg', '/images/gallery-3.jpg', '/images/gallery-5.jpg'],
    capacity: 4,
    features: ['Fully airconditioned', 'With TV', 'With mini refrigerator', 'Comfortable beds', 'Private CR'],
    inclusions: ['Free entrance for guests', 'Pool access', 'Private space'],
    notes: [
      'Free entrance included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 4 pax',
    ],
    testimonial: 'The extra space makes group stays feel easy and organized.',
    rates: { day: 3000, night: 4300, '22hrs': 5600 },
  },
  {
    slug: 'executive-villa',
    name: 'Executive Villa',
    subtitle: 'A quiet premium villa for private downtime with upgraded comfort.',
    description:
      'Executive Villa is best for guests who want more privacy, a calmer setting, and a more polished room experience for overnight bookings.',
    image: '/images/room-3.jpg',
    gallery: ['/images/room-3.jpg', '/images/gallery-4.jpg', '/images/gallery-6.jpg'],
    capacity: 5,
    features: ['Fully airconditioned', 'With TV', 'With mini refrigerator', 'Comfortable beds', 'Private CR'],
    inclusions: ['Free entrance for guests', 'Pool access', 'Private space'],
    notes: [
      'Free entrance included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 5 pax',
    ],
    testimonial: 'A strong choice if you want the resort feel with more privacy.',
    rates: { day: 4500, night: 6200, '22hrs': 7800 },
  },
  {
    slug: 'exclusive-villa',
    name: 'Exclusive Villa',
    subtitle: 'Our largest private villa for celebrations, reunions, and full-stay comfort.',
    description:
      'Exclusive Villa is built for bigger groups who want room to spread out, entertain, and stay together in one premium space.',
    image: '/images/room-4.jpg',
    gallery: ['/images/room-4.jpg', '/images/gallery-1.jpg', '/images/gallery-5.jpg'],
    capacity: 12,
    features: ['Fully airconditioned', 'With TV', 'With mini refrigerator', 'Comfortable beds', 'Private CR'],
    inclusions: ['Free entrance for guests', 'Pool access', 'Private space'],
    notes: [
      'Free entrance included',
      '50% downpayment required for peak dates',
      'Extra guest charges apply beyond 12 pax',
    ],
    testimonial: 'The best match for group bookings that need both space and privacy.',
    rates: { day: 7500, night: 10800, '22hrs': 13200 },
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
      'A practical event setup with venue use, pool access, and a day-use room for prep, holding, or rest.',
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
      'Our most-requested package for birthdays and corporate socials with upgraded inclusions and overnight use.',
    features: [
      'Afterglow Events Place (5–6 hrs)',
      'Pool access (semi-exclusive hours)',
      '1 Overnight Room (Lanai / Veranda)',
      'Tables & chairs',
      'Host + Event Coordinator',
      'Late-night use / chill after-party',
    ],
    featured: true,
  },
  {
    id: 'event-stay-exclusive',
    name: 'Event Stay Exclusive',
    subtitle: 'Good for 70–120 pax',
    price: 58000,
    pax: '70–120 pax',
    description:
      'A full-resort private event setup with exclusive pool use, multiple rooms, and premium coordination.',
    features: [
      'Afterglow Events Place (6–8 hrs)',
      'Exclusive Pool Use',
      '2–4 Overnight Rooms / Villas',
      'Tables & chairs',
      'Host + Event Coordinator',
      'Full privacy & premium flow',
    ],
  },
]

export const entranceOptions: EntranceOption[] = [
  { id: 'day', label: 'Day Tour', adultPrice: 350, kidPrice: 250, schedule: '9AM-5PM' },
  { id: 'night', label: 'Night Swim', adultPrice: 400, kidPrice: 300, schedule: '7PM-7AM' },
]

export const stayTypeOptions: Array<{ id: StayType; label: string; description: string }> = [
  { id: 'day', label: 'Day', description: '9AM-5PM' },
  { id: 'night', label: 'Night', description: '7PM-7AM' },
  { id: '22hrs', label: '22 Hours', description: 'Extended stay' },
]

export const addOns: AddOn[] = [
  { id: 'towel', name: 'Towel', price: 100 },
  { id: 'breakfast', name: 'Breakfast', price: 250 },
  { id: 'grill', name: 'Grill / KTV', price: 1000 },
  { id: 'extension', name: 'Extension', price: 500 },
]

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

export function calculateRoomTotal(roomBooking: RoomBookingState) {
  const room = getRoomByName(roomBooking.selectedRoom)
  const addOnTotal = roomBooking.addOns.reduce((sum, id) => {
    const addOn = addOns.find((item) => item.id === id)
    return sum + (addOn?.price ?? 0)
  }, 0)
  return room.rates[roomBooking.stayType] + addOnTotal
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
  return Math.min(Math.max(1, guestCount), getRoomByName(roomName).capacity)
}
