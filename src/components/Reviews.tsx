import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Maria Santos',
    location: 'Quezon City',
    rating: 5,
    text: 'Clean room, smooth check-in, and the pool stayed enjoyable all day.',
    avatar: '/placeholder-user.jpg',
  },
  {
    name: 'John Reyes',
    location: 'Makati',
    rating: 5,
    text: 'The booking flow was simple and the staff handled our family stay well.',
    avatar: '/placeholder-user.jpg',
  },
  {
    name: 'Angela Cruz',
    location: 'Pasig City',
    rating: 5,
    text: 'Our event package felt organized from arrival to wrap-up. Worth it.',
    avatar: '/placeholder-user.jpg',
  },
]

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">Testimonials</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium text-balance">
            Reviews
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hear what our guests have to say about their unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative border border-border bg-card p-8 transition-colors hover:border-primary"
            >
              <Quote size={40} className="absolute top-6 right-6 text-muted opacity-20" />

              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="mt-6 text-foreground leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
