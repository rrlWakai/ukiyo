import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Maria Santos',
    location: 'Quezon City',
    rating: 5,
    text: 'Clean room, smooth check-in, and the pool stayed enjoyable all day. Exactly what we needed.',
  },
  {
    name: 'John Reyes',
    location: 'Makati',
    rating: 5,
    text: 'The booking flow was simple and the staff handled our family stay thoughtfully from start to finish.',
  },
  {
    name: 'Angela Cruz',
    location: 'Pasig City',
    rating: 5,
    text: "Our event package felt organized from arrival to wrap-up. We didn't have to think about a thing.",
  },
]

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="reviews" className="section-shell bg-background">
      <div className="page-shell">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header text-center"
        >
          <p className="section-kicker">Guest Reviews</p>
          <h2 className="section-title mx-auto max-w-xl">
            Told in their<br />own words.
          </h2>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
              className="space-y-5"
            >
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-base leading-relaxed text-foreground md:text-lg">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="border-t border-border pt-5">
                <p className="text-sm font-medium text-foreground">{review.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
