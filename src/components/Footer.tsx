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
              className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-70"
            >
              {!logoError && (
                <img
                  src="/images/logoo.jpg"
                  alt="Ukiyo Resort"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20"
                  onError={() => setLogoError(true)}
                />
              )}
              <span className="font-serif text-2xl tracking-widest text-white">
                Ukiyo Resort
              </span>
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Group-ready resort for barkadas, families, and company events — 3
              pools, water slides, and space for up to 200 guests. Just minutes
              away.
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

        <div className="mt-16 flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between">
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
