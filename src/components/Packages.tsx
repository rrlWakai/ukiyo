import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'
import { eventPackages, formatPrice } from '@/lib/resort-data'

type PackagesProps = {
  selectedPackage: string
  onSelectPackage: (packageName: string) => void
}

export function Packages({ selectedPackage, onSelectPackage }: PackagesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="packages" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">Our Packages</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium text-balance">
            Event Packages
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose from our carefully curated packages designed to give you the perfect resort experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {eventPackages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative p-8 border transition-colors ${
                pkg.featured
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-2 uppercase tracking-wide">
                  Most Popular
                </span>
              )}

              <h3 className={`font-serif text-2xl font-medium ${pkg.featured ? '' : 'text-foreground'}`}>
                {pkg.name}
              </h3>
              <p className={`mt-2 text-xs uppercase tracking-[0.2em] ${pkg.featured ? 'opacity-70' : 'text-accent'}`}>
                {pkg.subtitle}
              </p>
              <p className={`mt-3 text-sm ${pkg.featured ? 'opacity-80' : 'text-muted-foreground'}`}>
                {pkg.description}
              </p>

              <div className="mt-6">
                <span className="font-serif text-4xl font-bold">{formatPrice(pkg.price)}</span>
                <span className={`text-sm ${pkg.featured ? 'opacity-80' : 'text-muted-foreground'}`}> / {pkg.pax}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={18} className={`mt-0.5 flex-shrink-0 ${pkg.featured ? '' : 'text-accent'}`} />
                    <span className={`text-sm ${pkg.featured ? 'opacity-90' : 'text-muted-foreground'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelectPackage(pkg.name)}
                className={`mt-8 block w-full text-center py-4 font-semibold uppercase tracking-wide transition-colors border ${
                  pkg.featured || selectedPackage === pkg.name
                    ? 'bg-white text-primary border-white hover:bg-white/90'
                    : 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                }`}
              >
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
