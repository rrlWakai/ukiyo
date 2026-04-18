import { useState } from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";

type FooterProps = {
  onNavigateHome: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToBooking: () => void;
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/" },
];

export function Footer({
  onNavigateHome,
  onNavigateToSection,
  onNavigateToBooking,
}: FooterProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-foreground text-white">
      <div className="page-shell py-16 md:py-24">
        <div className="mb-16 flex flex-col gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="transition-opacity duration-300 hover:opacity-70"
            >
              {logoError ? (
                <span className="font-serif text-3xl tracking-widest">
                  UKIYO
                </span>
              ) : (
                <img
                  src="/logo.jpg"
                  alt="Ukiyo Resort"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
                  onError={() => setLogoError(true)}
                />
              )}
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Group-ready resort for barkadas, families, and company events — 3 pools, water slides, and space for up to 200 guests. Just minutes away.
            </p>
          </div>

          <div className="flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white"
                aria-label={social.name}
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              Resort
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("experience")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("accommodation")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Accommodation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("gallery")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("packages")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Packages
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={onNavigateToBooking}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Room Stays
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateToBooking}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Entrance Passes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("packages")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("gallery")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Activities
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("contact")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateToSection("contact")}
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  FAQs
                </button>
              </li>
              <li>
                <span className="text-sm text-white/30">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-white/30">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Ukiyo Resort. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Designed for your perfect getaway.
          </p>
        </div>
      </div>
    </footer>
  );
}
