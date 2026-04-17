import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  { icon: MapPin,  title: 'Address',          content: '123 Paradise Road, Tropical Island, 12345' },
  { icon: Phone,   title: 'Phone',             content: '+63 (2) 8123-4567' },
  { icon: Mail,    title: 'Email',             content: 'hello@ukiyoresort.com' },
  { icon: Clock,   title: 'Reception Hours',   content: '24 / 7 Available' },
]

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section id="contact" className="section-shell bg-[#F5F3EF]">
      <div className="page-shell">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="section-header max-w-xl"
        >
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">
            Questions?<br />We&rsquo;re here.
          </h2>
          <p className="section-copy text-sm">
            Reach out before you book, or after — we&rsquo;re happy to help with anything you need.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((item) => (
                <div key={item.title} className="space-y-3 rounded-2xl border border-border bg-white p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5">
                    <item.icon size={16} className="text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                alt="Resort location"
                className="h-64 w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-white p-7 md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="field-label">First Name</label>
                <input
                  type="text" id="firstName" value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-input" placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="field-label">Last Name</label>
                <input
                  type="text" id="lastName" value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-input" placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input
                type="email" id="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input" placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="field-label">Phone</label>
              <input
                type="tel" id="phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input" placeholder="+63 (2) 8123-4567"
              />
            </div>

            <div>
              <label htmlFor="message" className="field-label">Message</label>
              <textarea
                id="message" rows={4} value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input min-h-32 resize-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>

            <button type="submit" className="primary-cta w-full">
              Send Message
            </button>
          </motion.form>

        </div>
      </div>
    </section>
  )
}
