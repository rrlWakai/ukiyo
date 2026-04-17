import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'About', href: '#about' },
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
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    onNavigateToSection(href.replace('#', ''))
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/60 bg-background/95 backdrop-blur-md'
          : 'border-b border-white/10 bg-transparent'
      }`}
    >
      <div className="page-shell">
        <div className="flex min-h-20 items-center justify-between gap-4 py-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="transition-opacity duration-300 hover:opacity-70"
          >
            {logoError ? (
              <span className={`font-serif text-xl tracking-widest ${scrolled ? 'text-foreground' : 'text-white'}`}>
                UKIYO
              </span>
            ) : (
              <img
                src="/logo.jpg"
                alt="Ukiyo Resort"
                className={`h-10 w-10 rounded-full object-cover transition-all duration-500 ${
                  scrolled ? '' : 'ring-2 ring-white/20'
                }`}
                onError={() => setLogoError(true)}
              />
            )}
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleLinkClick(link.href)}
                className={`text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                  scrolled
                    ? 'text-foreground/50 hover:text-foreground'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className={`hidden text-xs font-medium uppercase tracking-[0.22em] underline underline-offset-4 transition-all duration-300 md:inline-flex ${
              scrolled
                ? 'text-foreground hover:text-foreground/60'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {isRoomPage ? 'Reserve Room' : 'Reserve a Stay'}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors duration-300 md:hidden ${
              scrolled ? 'text-foreground' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="page-shell space-y-1 py-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.22em] text-foreground/50 transition-colors duration-300 hover:text-foreground"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    onBookNow()
                  }}
                  className="primary-cta w-full"
                >
                  {isRoomPage ? 'Reserve Room' : 'Reserve a Stay'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
