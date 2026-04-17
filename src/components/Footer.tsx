import { Instagram, Facebook, Twitter } from 'lucide-react'

type FooterProps = {
  onNavigateHome: () => void
  onNavigateToSection: (sectionId: string) => void
  onNavigateToBooking: () => void
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/' },
  { name: 'Twitter', icon: Twitter, href: 'https://x.com/' },
]

export function Footer({ onNavigateHome, onNavigateToSection, onNavigateToBooking }: FooterProps) {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <button type="button" onClick={onNavigateHome} className="font-serif text-3xl font-bold tracking-tight">
              UKIYO
            </button>
            <p className="mt-4 text-white/70 max-w-sm leading-relaxed">
              Booking-focused resort stays, entrance passes, and event packages with a cleaner path from browsing to reservation.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Resort</h4>
            <ul className="space-y-3">
              <li><button type="button" onClick={() => onNavigateToSection('about')} className="text-white/70 hover:text-white transition-colors text-sm">About Us</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('accommodation')} className="text-white/70 hover:text-white transition-colors text-sm">Accommodation</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('gallery')} className="text-white/70 hover:text-white transition-colors text-sm">Gallery</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('packages')} className="text-white/70 hover:text-white transition-colors text-sm">Packages</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Services</h4>
            <ul className="space-y-3">
              <li><button type="button" onClick={onNavigateToBooking} className="text-white/70 hover:text-white transition-colors text-sm">Room Stays</button></li>
              <li><button type="button" onClick={onNavigateToBooking} className="text-white/70 hover:text-white transition-colors text-sm">Entrance Passes</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('packages')} className="text-white/70 hover:text-white transition-colors text-sm">Events</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('gallery')} className="text-white/70 hover:text-white transition-colors text-sm">Activities</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">Support</h4>
            <ul className="space-y-3">
              <li><button type="button" onClick={() => onNavigateToSection('contact')} className="text-white/70 hover:text-white transition-colors text-sm">Contact Us</button></li>
              <li><button type="button" onClick={() => onNavigateToSection('contact')} className="text-white/70 hover:text-white transition-colors text-sm">FAQs</button></li>
              <li><span className="text-white/50 text-sm">Privacy Policy</span></li>
              <li><span className="text-white/50 text-sm">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Ukiyo Resort. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Designed with care for your perfect getaway.
          </p>
        </div>
      </div>
    </footer>
  )
}
