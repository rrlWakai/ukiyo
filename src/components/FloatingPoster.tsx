import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const SHOW_PROMO = true;

export function FloatingPoster() {
  const { scrollY } = useScroll();
  // poster moves down slightly slower than page — creates a mid-ground depth layer
  // background: 0→160px, poster: 0→40px, text: 0px (normal scroll)
  const posterY = useTransform(scrollY, [0, 600], [0, 40]);

  if (!SHOW_PROMO) return null;

  return (
    // entry animation: fade up from below
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
      className="mx-auto shrink-0 md:mx-0"
    >
      {/* scroll-parallax wrapper — separate from entry animation to avoid y conflict */}
      <motion.div style={{ y: posterY }}>
        <Link to="/booking?promo=echo" aria-label="Book Echo Rooms">
          <div className="poster-shadow w-50 scale-[0.97] cursor-pointer transition-[transform,box-shadow] duration-500 ease-out hover:scale-100 sm:w-50 md:w-60">
            <img
              src="/images/echo-rooms-promo.jpg"
              alt="Echo Rooms — Sing. Stay. Repeat."
              draggable={false}
              className="w-full object-cover"
            />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
