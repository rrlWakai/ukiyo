import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { BookingType } from "@/lib/resort-data";

type HeroProps = {
  bookingType: BookingType;
  onSelectBookingType: (type: BookingType) => void;
  onBookNow: () => void;
  onExploreMore: () => void;
};

export function Hero({ onBookNow, onExploreMore }: HeroProps) {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 160]);

  return (
    <section className="relative flex min-h-[80vh] flex-col overflow-hidden lg:min-h-[90vh]">
      {/* ── Parallax background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img
          src="/images/hero.webp"
          alt="Ukiyo Resort"
          className="h-full w-full scale-110 object-cover"
        />
        {/* bottom-to-top vignette for text legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-[#08162d]/90 via-[#08162d]/30 to-transparent" />
      </motion.div>

      {/* ── Left-to-right depth gradient ── */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-[#08162d]/65 via-[#08162d]/25 to-transparent" />

      {/* ── Hero text — upper section, below navbar ── */}
      <div className="relative z-10 mt-26 sm:mt-30 lg:mt-28">
        <div className="page-shell pb-14 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="max-w-xl space-y-4 text-center sm:text-left sm:space-y-5"
          >
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/50">
              Ukiyo Resort
            </p>

            <h1 className="text-[2.5rem] font-medium leading-[1.06] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your group's
              <br />
              escape starts here.
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-white/65 sm:text-base md:text-lg">
              Ukiyo Resort is built for barkadas, families, and company teams.
            </p>

            <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:items-center sm:justify-start">
              <button
                type="button"
                onClick={onBookNow}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-medium tracking-wide text-foreground transition-all duration-500 ease-out hover:opacity-90 sm:w-auto"
              >
                Book Your Escape Today
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
    </section>
  );
}
