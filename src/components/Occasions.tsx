import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Building2, PartyPopper, Smile } from 'lucide-react'

const occasions = [
  {
    icon: Smile,
    title: 'Barkada Getaway',
    description:
      'Pool games, water slides, karaoke, and Ukiyo Nights — your squad deserves a proper day out. Group promos available.',
  },
  {
    icon: Users,
    title: 'Family Bonding',
    description:
      'Spacious venues, kid-friendly pools, and poolfront rooms so the whole family can relax without going far.',
  },
  {
    icon: Building2,
    title: 'Team Building & Company Outings',
    description:
      'Open spaces for programs, games, and activities. We accommodate 100–200 guests — bring the whole office.',
  },
  {
    icon: PartyPopper,
    title: 'Celebrations & Reunions',
    description:
      'Birthdays, anniversaries, debuts, and reunions. We set up the venue, you bring the people. Slots are limited.',
  },
]

export function Occasions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="occasions" className="section-shell bg-[#F5F3EF]">
      <div className="page-shell">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header max-w-xl"
        >
          <p className="section-kicker">Every Occasion</p>
          <h2 className="section-title">
            Perfect for every<br />kind of group.
          </h2>
          <p className="section-copy text-sm">
            Whether it's 10 people or 200, Ukiyo Resort has the space, the setup, and the energy to make it a day worth remembering.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-white p-7 space-y-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/5">
                <item.icon size={20} className="text-foreground/70" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}