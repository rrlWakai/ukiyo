import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users } from 'lucide-react'
import { formatPrice, rooms } from '@/lib/resort-data'

type AccommodationProps = {
  selectedRoom: string
  onSelectRoom: (roomName: string) => void
  onViewDetails: (slug: string) => void
}

export function Accommodation({ onSelectRoom, onViewDetails }: AccommodationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const sliderRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const onPointerUp = () => {
    drag.current.active = false
  }

  const suppressClickIfDragged = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.stopPropagation()
      drag.current.moved = false
    }
  }

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
      </div>

      {/* Drag slider — breaks out of page-shell padding intentionally */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto px-6 pb-8 md:px-10 [scrollbar-width:none] [touch-action:pan-x_pinch-zoom] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={suppressClickIfDragged}
      >
        {rooms.map((room, index) => (
          <motion.div
            key={room.name}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
            className="group w-[80vw] shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-500 hover:shadow-md sm:w-[55vw] md:w-[42vw] lg:w-96"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                draggable={false}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Free entrance
              </div>
            </div>

            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-foreground">{room.name}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{room.subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-2xl text-accent">{formatPrice(room.rates.night)}</p>
                  <p className="text-xs text-muted-foreground">/ night</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={13} />
                  Good for {room.capacity} pax
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onViewDetails(room.slug)}
                    className="text-xs font-medium text-muted-foreground underline underline-offset-2 transition-colors duration-300 hover:text-foreground"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectRoom(room.name)}
                    className="inline-flex min-h-9 items-center justify-center rounded-lg bg-foreground px-4 text-xs font-medium text-white transition-all duration-300 hover:opacity-80"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Trailing spacer so last card isn't flush against the edge */}
        <div className="w-2 shrink-0 md:w-6" aria-hidden="true" />
      </div>
    </section>
  )
}
