import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="section-shell bg-white">
      <div className="page-shell">
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative pb-14 pr-14"
          >
            <img
              src="/images/about-1.jpg"
              alt="Resort interior"
              className="h-125 w-full rounded-2xl object-cover"
            />
            <div className="absolute bottom-0 right-0 h-56 w-48 overflow-hidden rounded-2xl border-4 border-white shadow-sm">
              <img
                src="/images/about-2.jpg"
                alt="Resort pool"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="section-kicker">Our Story</p>
              <h2 className="text-4xl font-medium leading-tight text-foreground md:text-5xl">
                A place built<br />for real rest.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Ukiyo Resort was designed around one simple idea — that meaningful rest requires the right setting. Nestled in nature, every corner is crafted to let you exhale, slow down, and arrive somewhere that feels truly yours.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                From our curated rooms to our thoughtful service, we've spent over 15 years building a place where families, couples, and celebrations all find their rhythm.
              </p>
            </div>

            <div className="flex gap-10 border-t border-border pt-8">
              <div>
                <p className="font-serif text-4xl font-bold text-foreground">50+</p>
                <p className="mt-1 text-sm text-muted-foreground">Luxury Rooms</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-bold text-foreground">10k+</p>
                <p className="mt-1 text-sm text-muted-foreground">Happy Guests</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-bold text-foreground">4.9</p>
                <p className="mt-1 text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
