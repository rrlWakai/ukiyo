import { motion, useScroll, useTransform } from "framer-motion";

import type { BookingType } from "@/lib/resort-data";

type HeroProps = {
  bookingType: BookingType;
  onSelectBookingType: (type: BookingType) => void;
  onBookNow: () => void;
  onExploreMore: () => void;
};

export function Hero({ onBookNow }: HeroProps) {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 160]);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Parallax background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img
          src="/images/herou.png"
          alt="Ukiyo Resort"
          className="h-full w-full scale-110 object-cover"
        />
        {/* soft black base */}
        <div className="absolute inset-0 bg-black/40" />
        {/* vignette for text legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-[#08162d]/80 via-[#08162d]/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-[#08162d]/30 via-transparent to-transparent" />
      </motion.div>

      {/* ── Hero text — centered, below navbar ── */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="page-shell pb-14 sm:pb-20 pt-28 sm:pt-32 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="mx-auto max-w-2xl space-y-5 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/50">
              Ukiyo Resort
            </p>

            <h1 className="font-serif text-[2.5rem] font-medium leading-[1.06] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Your group's
              <br />
              escape starts here.
            </h1>

            <p className="font-serif mx-auto max-w-lg text-sm leading-relaxed text-white/65 sm:text-base md:text-lg">
              Ukiyo Resort is built for barkadas, families, and company teams.
            </p>

            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={onBookNow}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-orange-600 active:scale-95"
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
