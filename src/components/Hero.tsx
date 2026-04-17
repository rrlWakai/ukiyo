import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { BookingType } from '@/lib/resort-data'

const bookingTypes = [
  { id: 'room', label: 'Room Stay' },
  { id: 'event', label: 'Event Package' },
  { id: 'entrance', label: 'Entrance' },
]

type HeroProps = {
  bookingType: BookingType
  onSelectBookingType: (type: BookingType) => void
  onBookNow: () => void
  onExploreMore: () => void
}

export function Hero({ bookingType, onSelectBookingType, onBookNow, onExploreMore }: HeroProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="/images/hero.jpg"
          alt="Luxury resort pool surrounded by palm trees"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08162d]/80 via-[#102646]/70 to-[#08162d]/85" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white/80 text-sm tracking-[0.3em] uppercase mb-6 font-medium"
        >
          Welcome to Ukiyo Resort
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] text-balance"
        >
          Your all-in-one escape from the city stress
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-white/80 text-lg max-w-2xl mx-auto"
        >
          Reserve room stays, event packages, and entrance passes from one clear booking flow designed for real resort planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-2 border border-white/20 bg-white/6 p-3 backdrop-blur-sm"
        >
          {bookingTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectBookingType(type.id as BookingType)}
              className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors border ${
                bookingType === type.id
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-transparent text-white border-white/25 hover:bg-white/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={onBookNow}
            className="px-10 py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors"
          >
            Book Your Stay
          </button>
          <button
            type="button"
            onClick={onExploreMore}
            className="px-10 py-4 bg-transparent text-white font-semibold uppercase tracking-wide border border-white hover:bg-white/10 transition-colors"
          >
            Explore More
          </button>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onExploreMore}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Scroll to about section"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={28} />
        </motion.div>
      </button>
    </section>
  )
}
