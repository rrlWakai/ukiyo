import { motion, useInView } from 'framer-motion'
import { Clock, Moon, Sun, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import { formatPrice, rooms, stayTypeOptions, type Room, type StayType } from '@/lib/resort-data'

type AccommodationProps = {
  selectedRoom: string
  onSelectRoom: (roomName: string) => void
  onViewDetails: (slug: string) => void
}

const POSITIONING: Record<string, string> = {
  'lanai-suite':      'Ideal for couples & small barkadas',
  'veranda-suite':    'Perfect for friends & small families',
  'executive-villa':  'Best for large groups & company outings',
  'exclusive-villa':  'Made for grand celebrations & full-resort takeovers',
}

const STAY_ICON = { day: Sun, night: Moon, '22hrs': Clock } as const
const STAY_SHORT: Record<StayType, string> = { day: 'Day', night: 'Night', '22hrs': '22 Hrs' }
const STAY_TIME: Record<StayType, string> = { day: '9AM–5PM', night: '7PM–7AM', '22hrs': '9AM–7AM+' }

type CardProps = {
  room: Room
  index: number
  stay: StayType
  onSetStay: (type: StayType) => void
  onBook: () => void
  onDetails: () => void
  featured?: boolean
  animate: boolean
}

function RoomCard({ room, index, stay, onSetStay, onBook, onDetails, featured = false, animate }: CardProps) {
  const price = room.rates[stay].weekday
  const paxLabel = room.maxPax
    ? `${room.capacity}–${room.maxPax} pax`
    : room.minPax
      ? `${room.minPax}–${room.capacity} pax`
      : `${room.capacity} pax`

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
      className={`group flex h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:shadow-xl ${
        featured ? 'flex-col lg:flex-row' : 'flex-col'
      }`}
    >
      {/* ── Image ── */}
      <div className={`relative shrink-0 overflow-hidden ${
        featured ? 'h-64 lg:h-auto lg:w-[44%]' : 'h-60'
      }`}>
        <img
          src={room.image}
          alt={room.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {/* gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

        {/* Free entrance chip — top left */}
        <span className="absolute left-4 top-4 rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
          Free entrance
        </span>

        {/* Badge — top right */}
        {room.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {room.badge}
          </span>
        )}

        {/* Name + positioning overlay — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
            {POSITIONING[room.slug]}
          </p>
          <h3 className={`mt-0.5 font-semibold text-white ${featured ? 'text-2xl' : 'text-xl'}`}>
            {room.name}
          </h3>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={`flex flex-1 flex-col ${featured ? 'p-5 lg:p-8' : 'p-5'}`}>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {room.subtitle}
        </p>

        {/* Stay type selector */}
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
            Select Stay Type
          </p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-50 p-1 ring-1 ring-black/5">
            {stayTypeOptions.map((opt) => {
              const Icon = STAY_ICON[opt.id]
              const active = stay === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSetStay(opt.id) }}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-lg py-2.5 transition-all duration-200 ${
                    active
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-white hover:text-foreground'
                  }`}
                >
                  <Icon size={13} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-semibold leading-none">
                    {STAY_SHORT[opt.id]}
                  </span>
                  <span className={`text-[9px] leading-none ${active ? 'text-white/70' : 'text-muted-foreground/50'}`}>
                    {STAY_TIME[opt.id]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spacer pushes price + CTA to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
            Starting from
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div>
              <p className={`font-serif font-medium text-accent ${featured ? 'text-4xl' : 'text-3xl'}`}>
                {formatPrice(price)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">per stay · weekday</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-black/5">
              <Users size={12} />
              {paxLabel}
            </span>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onDetails}
            className="text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground hover:underline hover:underline-offset-2"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={onBook}
            className="ml-auto inline-flex min-h-[44px] items-center justify-center rounded-xl bg-orange-500 px-6 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600 active:scale-[0.97]"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function Accommodation({ onSelectRoom, onViewDetails }: AccommodationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const sliderRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })
  const [cardStayTypes, setCardStayTypes] = useState<Record<string, StayType>>({})

  const getStay = (slug: string): StayType => cardStayTypes[slug] ?? 'day'
  const setStay = (slug: string, type: StayType) =>
    setCardStayTypes((prev) => ({ ...prev, [slug]: type }))

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const el = sliderRef.current
    if (!el) return
    if ((e.target as HTMLElement).closest('button, a')) return
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false }
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const el = sliderRef.current
    if (!el) return
    const diff = e.clientX - drag.current.startX
    if (Math.abs(diff) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - diff
  }

  const onPointerUp = () => { drag.current.active = false }

  const suppressClickIfDragged = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  const standardRooms = rooms.slice(0, 3)
  const featuredRoom = rooms[3]

  return (
    <section id="accommodation" className="section-shell overflow-hidden bg-background">
      <div className="page-shell">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="section-kicker">Our Rooms</p>
            <h2 className="section-title mb-0">Stay with Your Group</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            All rooms are poolfront, air-conditioned, and include free entrance. Bring your crew — we have options from 3 pax to 12 pax.
          </p>
        </motion.div>

        {/* ── Desktop grid (lg+) ── */}
        <div className="mt-10 hidden lg:grid lg:grid-cols-3 lg:gap-5">
          {standardRooms.map((room, index) => (
            <RoomCard
              key={room.slug}
              room={room}
              index={index}
              stay={getStay(room.slug)}
              onSetStay={(type) => setStay(room.slug, type)}
              onBook={() => onSelectRoom(room.name)}
              onDetails={() => onViewDetails(room.slug)}
              animate={isInView}
            />
          ))}

          {/* Featured wide card — spans all 3 cols */}
          {featuredRoom && (
            <div className="lg:col-span-3">
              <RoomCard
                room={featuredRoom}
                index={3}
                stay={getStay(featuredRoom.slug)}
                onSetStay={(type) => setStay(featuredRoom.slug, type)}
                onBook={() => onSelectRoom(featuredRoom.name)}
                onDetails={() => onViewDetails(featuredRoom.slug)}
                featured
                animate={isInView}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile / tablet slider (< lg) ── */}
      <div
        ref={sliderRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 md:px-10 lg:hidden [scrollbar-width:none] [touch-action:pan-x_pan-y_pinch-zoom] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={suppressClickIfDragged}
      >
        {rooms.map((room, index) => (
          <div
            key={room.slug}
            className="w-[80vw] shrink-0 snap-center sm:w-[55vw] md:w-[42vw] [touch-action:pan-x_pan-y_pinch-zoom]"
          >
            <RoomCard
              room={room}
              index={index}
              stay={getStay(room.slug)}
              onSetStay={(type) => setStay(room.slug, type)}
              onBook={() => onSelectRoom(room.name)}
              onDetails={() => onViewDetails(room.slug)}
              animate={isInView}
            />
          </div>
        ))}
        <div className="w-2 shrink-0 md:w-6" aria-hidden="true" />
      </div>
    </section>
  )
}
