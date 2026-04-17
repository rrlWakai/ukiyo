import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/about-1.jpg"
                alt="Luxury resort room interior"
                className="w-full h-64 object-cover"
              />
              <img
                src="/images/about-2.jpg"
                alt="Resort infinity pool"
                className="w-full h-64 object-cover mt-8"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-8 py-6">
              <p className="text-4xl font-serif font-bold">15+</p>
              <p className="text-sm opacity-80 uppercase tracking-wide">Years of Excellence</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">About Us</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium leading-tight text-balance">
              We believe in honest work and real results
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Nestled in the heart of nature, Ukiyo Resort offers an unparalleled escape from the everyday hustle. Our commitment to exceptional service and authentic experiences has made us a sanctuary for those seeking genuine relaxation and rejuvenation.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From our carefully curated accommodations to our world-class amenities, every detail is designed to provide you with an unforgettable stay. Whether you&apos;re here for a romantic getaway, family vacation, or corporate retreat, we ensure your experience exceeds expectations.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-8">
              <div className="border-l-2 border-accent pl-4">
                <p className="text-3xl font-serif font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wide">Luxury Rooms</p>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <p className="text-3xl font-serif font-bold text-foreground">10k+</p>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wide">Happy Guests</p>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <p className="text-3xl font-serif font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wide">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
