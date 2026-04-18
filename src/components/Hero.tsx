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
  const y = useTransform(scrollY, [0, 600], [0, 160]);

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-20">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="/images/hero.webp"
          alt="Ukiyo Resort"
          className="h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#08162d]/85 via-[#08162d]/25 to-transparent" />
      </motion.div>

      <div className="page-shell relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="max-w-2xl space-y-6"
        >
          <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/50">
            Ukiyo Resort
          </p>

          <h1 className="text-5xl font-medium leading-[1.06] text-white md:text-6xl lg:text-7xl">
            Your group's
            <br />
            escape starts here.
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            Ukiyo Resort is built for barkadas, families, and company teams. 3
            connected pools, water slides, poolfront rooms — and space for
            100–200 guests. Minutes away. No long drive. No hassle.
          </p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onBookNow}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-medium tracking-wide text-foreground transition-all duration-500 ease-out hover:opacity-90 sm:w-auto"
            >
              Book Your Escape Today
            </button>
            <button
              type="button"
              onClick={onExploreMore}
              className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white"
            >
              See what's included
            </button>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onExploreMore}
        className="absolute bottom-8 right-10 text-white/30 transition-colors duration-300 hover:text-white/70"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </button>
    </section>
  );
}
