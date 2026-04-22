import { motion } from "framer-motion";

export function FloatingPosterStrip() {
  return (
    <section className="relative z-20 -mt-16 flex justify-center sm:-mt-20 lg:-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        whileHover={{ scale: 1.02, y: -6 }}
        className="cursor-default"
      >
        <img
          src="/images/poster.jpg"
          alt="Echo Rooms — Sing. Stay. Repeat."
          draggable={false}
          className="h-70 w-45 rounded-2xl object-cover shadow-2xl ring-1 ring-amber-400/45 xl:h-80 xl:w-52.5"
        />
      </motion.div>
    </section>
  );
}
