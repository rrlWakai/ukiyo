import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { BookingType } from "@/lib/resort-data";
import { LayeredCards } from "./LayeredCards";

const MOBILE_CARDS = [
  { src: "/images/poster.jpg", alt: "Echo Rooms — Sing. Stay. Repeat." },
  { src: "/images/extension-rates.jpg", alt: "Extension rates" },
  { src: "/images/poster-2.jpg", alt: "Echo Rooms rates" },
  { src: "/images/poster-4.jpg", alt: "Echo Rooms amenities" },
];

type HeroProps = {
  bookingType: BookingType;
  onSelectBookingType: (type: BookingType) => void;
  onBookNow: () => void;
  onExploreMore: () => void;
};

export function Hero({ onBookNow, onExploreMore }: HeroProps) {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 160]);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const pointerStartX = useRef(0);

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setMobileCardIndex((i) => (i + 1) % MOBILE_CARDS.length);
      else setMobileCardIndex((i) => (i - 1 + MOBILE_CARDS.length) % MOBILE_CARDS.length);
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">

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

      {/* ── Left-to-right depth gradient — darkens text side, fades toward cards ── */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-[#08162d]/65 via-[#08162d]/25 to-transparent" />

      {/* ── Hero text — single column, bottom-left ── */}
      <div className="relative z-10 mt-auto">
        <div className="page-shell pb-14 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="max-w-xl space-y-4 sm:space-y-6"
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
              3 connected pools, water slides, poolfront rooms — and space for
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

            {/* Mobile card carousel — hidden on lg+ where LayeredCards takes over */}
            <div className="pt-4 lg:hidden">
              <div
                className="relative select-none touch-pan-y overflow-hidden rounded-2xl shadow-2xl"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <img
                  src={MOBILE_CARDS[mobileCardIndex].src}
                  alt={MOBILE_CARDS[mobileCardIndex].alt}
                  draggable={false}
                  className="w-full max-h-52 object-cover"
                />
              </div>
              {/* Dot indicators */}
              <div className="mt-3 flex justify-center gap-1.5">
                {MOBILE_CARDS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMobileCardIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === mobileCardIndex ? "w-6 bg-white" : "w-1.5 bg-white/35"
                    }`}
                    aria-label={`Card ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stacked promo cards — absolutely centered on right ── */}
      <LayeredCards />

      {/* ── Scroll indicator ── */}
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
