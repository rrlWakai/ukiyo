import { motion } from "framer-motion";

const POSTERS = [
  { src: "/images/poster.jpg", alt: "Echo Rooms — Sing. Stay. Repeat." },
  { src: "/images/extension-rates.jpg", alt: "Extension rates" },
  { src: "/images/poster-2.jpg", alt: "Echo Rooms rates" },
  { src: "/images/poster-4.jpg", alt: "Echo Rooms amenities" },
];

// Subtle upward stagger per card (px) — creates depth on desktop
const STAGGER_Y = [0, -12, -4, -16];

export function FloatingPosterStrip() {
  return (
    <section className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-28">
      {/* ── Desktop: centered 4-column row with stagger ── */}
      <div className="hidden items-end justify-center gap-6 lg:flex xl:gap-8">
        {POSTERS.map((poster, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: STAGGER_Y[i] }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 + 0.1 * i }}
            className="shrink-0"
          >
            <img
              src={poster.src}
              alt={poster.alt}
              draggable={false}
              className="h-[280px] w-[180px] rounded-2xl object-cover shadow-xl ring-1 ring-amber-400/45 xl:h-[310px] xl:w-[200px]"
            />
          </motion.div>
        ))}
      </div>

      {/* ── Mobile / tablet: horizontal snap-scroll strip ── */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {POSTERS.map((poster, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 * i }}
            className="shrink-0 snap-center"
          >
            <img
              src={poster.src}
              alt={poster.alt}
              draggable={false}
              className="h-[220px] w-[140px] rounded-2xl object-cover shadow-xl ring-1 ring-amber-400/45"
            />
          </motion.div>
        ))}
        {/* trailing spacer so last card can snap into view */}
        <div className="w-10 shrink-0" />
      </div>
    </section>
  );
}
