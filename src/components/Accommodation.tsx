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

  return (
    <section id="accommodation" className="section-shell bg-background">
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
            <h2 className="section-title mb-0">Accommodation</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Each room is a considered space — designed for stillness, comfort, and a night that restores.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-500 hover:shadow-md"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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
        </div>

      </div>
    </section>
  )
}
