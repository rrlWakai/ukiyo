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
    subtitle: 'Poolfront suite for small groups — perfect for a quick day or night escape.',
    description:
      'Lanai Suite puts your group steps away from the pool. Great for small barkadas or families who want their own space with direct pool access.',
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
    testimonial: 'Super convenient — pool is literally outside our door. Perfect for the group.',
    rates: { day: 2200, night: 3200, '22hrs': 4200 },
  },
  {
    slug: 'veranda-suite',
    name: 'Veranda Suite',
    subtitle: 'More space for families and friend groups — poolfront with a bigger lounge area.',
    description:
      'Veranda Suite fits up to 4 guests and gives your group a wider indoor space to chill, eat, and rest after a big day in the pools.',
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
    testimonial: 'Enough room for the whole barkada to chill inside and outside. Loved it.',
    rates: { day: 3000, night: 4300, '22hrs': 5600 },
  },
  {
    slug: 'executive-villa',
    name: 'Executive Villa',
    subtitle: 'Upgraded villa for groups of 5 who want more privacy and poolfront comfort.',
    description:
      'Executive Villa is ideal for groups who want a step up — more space, more privacy, and the same direct pool access, great for overnight stays.',
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
    testimonial: 'Great choice for a group that wants more space and a bit more privacy from the crowds.',
    rates: { day: 4500, night: 6200, '22hrs': 7800 },
  },
  {
    slug: 'exclusive-villa',
    name: 'Exclusive Villa',
    subtitle: 'Our biggest villa — fits 12 pax, perfect for reunions, barkada overnights, and big celebrations.',
    description:
      'Exclusive Villa is the go-to for large groups. Fits up to 12 guests, with full poolfront access and enough room for your whole crew to eat, sleep, and hang out together.',
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
    testimonial: 'Booked this for our barkada of 10. So much space — we barely had to leave the villa.',
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
