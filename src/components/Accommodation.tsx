import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Ticket, Wind, Bath, Check } from 'lucide-react'
import { formatPrice, roomBadges, rooms } from '@/lib/resort-data'

type AccommodationProps = {
  selectedRoom: string
  onSelectRoom: (roomName: string) => void
  onViewDetails: (slug: string) => void
}

export function Accommodation({ selectedRoom, onSelectRoom, onViewDetails }: AccommodationProps) {
  const ref = useRef(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    dragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
  })
  const suppressClick = useRef(false)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const resetDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current
    if (slider && event && slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId)
    }
    dragState.current.active = false
    dragState.current.dragging = false
    window.setTimeout(() => {
      suppressClick.current = false
    }, 120)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current
    if (!slider) return
    dragState.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: slider.scrollLeft,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current
    if (!slider || !dragState.current.active) return

    const deltaX = event.clientX - dragState.current.startX
    const deltaY = event.clientY - dragState.current.startY

    if (!dragState.current.dragging) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) return
      if (Math.abs(deltaX) < 8) return
      dragState.current.dragging = true
      suppressClick.current = true
      slider.setPointerCapture(event.pointerId)
    }

    slider.scrollLeft = dragState.current.scrollLeft - deltaX
  }

  const guardClick = (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    callback()
  }

  return (
    <section id="accommodation" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">Our Rooms</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium text-balance">
            Accommodation
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose from our selection of beautifully appointed rooms and suites designed for your comfort.
          </p>
        </motion.div>

        <div
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={resetDrag}
          onPointerCancel={resetDrag}
          onPointerLeave={(event) => {
            if (dragState.current.dragging) resetDrag(event)
          }}
          className="drag-scroll flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing"
        >
          {rooms.map((room, index) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group min-w-[280px] max-w-[280px] bg-card border overflow-hidden transition-colors ${
                selectedRoom === room.name ? 'border-primary' : 'border-border hover:border-primary'
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                  <Ticket size={12} />
                  Free entrance
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-medium text-foreground">{room.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{room.subtitle}</p>

                <div className="mt-3 flex items-center gap-2 text-muted-foreground text-sm">
                  <Users size={16} />
                  <span>Good for {room.capacity} pax</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {roomBadges.map((badge, badgeIndex) => (
                    <span key={badge} className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs border border-border">
                      {badgeIndex === 0 && <Wind size={12} />}
                      {badgeIndex === 1 && <Bath size={12} />}
                      {badgeIndex === 2 && <Check size={12} />}
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="mb-3">
                    <span className="font-serif text-xl font-bold text-accent">{formatPrice(room.rates.night)}</span>
                    <span className="text-sm text-muted-foreground"> / night stay</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={guardClick(() => onViewDetails(room.slug))}
                      className="flex-1 border border-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={guardClick(() => onSelectRoom(room.name))}
                      className="flex-1 bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
