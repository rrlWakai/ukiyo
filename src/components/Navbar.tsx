import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Packages', href: '#packages' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Rooms', href: '#accommodation' },
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

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    onNavigateToSection(href.replace('#', ''))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            onClick={onNavigateHome}
            className="font-serif text-2xl font-bold tracking-tight text-primary"
          >
            UKIYO
          </button>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleLinkClick(link.href)}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors uppercase tracking-wide"
              >
                {link.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onBookNow}
            className="hidden md:inline-flex px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
          >
            {isRoomPage ? 'Reserve Room' : 'Book Now'}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className="block text-foreground/70 hover:text-foreground transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  {link.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onBookNow()
                }}
                className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide"
              >
                {isRoomPage ? 'Reserve Room' : 'Book Now'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
