import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Experience', href: '#experience' },
  { name: 'Rooms', href: '#accommodation' },
  { name: 'Packages', href: '#packages' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Contact', href: '#contact' },
]

type NavbarProps = {
  isRoomPage: boolean
  onNavigateHome: () => void
  onNavigateToSection: (sectionId: string) => void
  onBookNow: () => void
}

export function Navbar({ isRoomPage, onNavigateHome, onNavigateToSection, onBookNow }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    onNavigateToSection(href.replace('#', ''))
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
      {/* Floating pill */}
      <div className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full bg-[rgba(10,25,60,0.45)] px-4 py-2.5 ring-1 ring-blue-300/20 backdrop-blur-md">
        {/* Logo */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="shrink-0 transition-opacity duration-300 hover:opacity-70"
        >
          {logoError ? (
            <span className="font-serif text-lg tracking-widest text-white">
              UKIYO
            </span>
          ) : (
            <img
              src="/logo.jpg"
              alt="Ukiyo Resort"
              className="h-9 w-9 rounded-full object-cover"
              onError={() => setLogoError(true)}
            />
          )}
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleLinkClick(link.href)}
              className="text-xs font-medium uppercase tracking-[0.2em] text-white/65 transition-colors duration-300 hover:text-white"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <button
          type="button"
          onClick={onBookNow}
          className="hidden shrink-0 rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-orange-600 active:scale-95 md:inline-flex"
        >
          {isRoomPage ? 'Reserve Room' : 'Book Now'}
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-2 text-white transition-colors duration-300 hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute left-4 right-4 top-18 overflow-hidden rounded-2xl bg-[rgba(10,25,60,0.45)] ring-1 ring-blue-300/20 backdrop-blur-md md:hidden"
          >
            <div className="space-y-0.5 p-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="flex min-h-11 w-full items-center rounded-xl px-4 text-xs font-medium uppercase tracking-[0.2em] text-white/65 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                  {link.name}
                </button>
              ))}
              <div className="px-1 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); onBookNow() }}
                  className="w-full rounded-full bg-orange-500 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-orange-600"
                >
                  {isRoomPage ? 'Reserve Room' : 'Book Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
