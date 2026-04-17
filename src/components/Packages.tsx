import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'
import { eventPackages, formatPrice } from '@/lib/resort-data'

type PackagesProps = {
  selectedPackage: string
  onSelectPackage: (packageName: string) => void
}

export function Packages({ selectedPackage, onSelectPackage }: PackagesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="packages" className="section-shell bg-white">
      <div className="page-shell">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header max-w-xl"
        >
          <p className="section-kicker">Event Packages</p>
          <h2 className="section-title">
            Celebrate here.<br />We handle the rest.
          </h2>
          <p className="section-copy text-sm">
            From intimate gatherings to full resort events, our packages are built around what actually matters on the day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {eventPackages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-500 md:p-8 ${
                pkg.featured
                  ? 'border-foreground bg-foreground text-white'
                  : 'border-border bg-white hover:border-foreground/20'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <div className="space-y-2">
                <p className={`text-xs font-medium uppercase tracking-[0.28em] ${pkg.featured ? 'text-white/50' : 'text-accent'}`}>
                  {pkg.subtitle}
                </p>
                <h3 className="text-2xl font-medium">{pkg.name}</h3>
                <p className={`text-sm leading-relaxed ${pkg.featured ? 'text-white/65' : 'text-muted-foreground'}`}>
                  {pkg.description}
                </p>
              </div>

              <div className="mt-6">
                <span className="font-serif text-4xl font-bold">{formatPrice(pkg.price)}</span>
                <span className={`ml-1.5 text-sm ${pkg.featured ? 'text-white/55' : 'text-muted-foreground'}`}>
                  / {pkg.pax}
                </span>
              </div>

              <ul className="mt-6 grow space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${pkg.featured ? 'text-white/70' : 'text-accent'}`}
                    />
                    <span className={`text-sm leading-snug ${pkg.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelectPackage(pkg.name)}
                className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-xl border-2 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                  pkg.featured
                    ? 'border-white bg-white text-foreground hover:bg-white/90'
                    : selectedPackage === pkg.name
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-foreground/70 bg-transparent text-foreground hover:bg-foreground hover:text-white'
                }`}
              >
                Select Package
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
