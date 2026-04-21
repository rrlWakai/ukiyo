import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SHOW_PROMO = true;
const ROTATE_INTERVAL = 4000;

const CARDS = [
  { src: "/images/poster.jpg", alt: "Echo Rooms — Sing. Stay. Repeat." },
  { src: "/images/extension-rates.jpg", alt: "Extension rates" },
  { src: "/images/poster-2.jpg", alt: "Echo Rooms rates" },
  { src: "/images/poster-4.jpg", alt: "Echo Rooms amenities" },
];

// One class-string per position slot — avoids all inline styles.
// JIT scanner picks these up as static string literals.
const POSITION_CLASSES = [
  // front  (position 0)
  "translate-x-0   translate-y-0   scale-100    opacity-100 z-30",
  // middle (position 1)
  "translate-x-2.5 translate-y-2.5 scale-[0.96] opacity-80  z-20",
  // back   (position 2)
  "translate-x-5   translate-y-5   scale-[0.92] opacity-60  z-10",
  // hidden (position 3)
  "translate-x-8   translate-y-8   scale-[0.88] opacity-0   z-0  pointer-events-none",
] as const;

export function LayeredCards() {
  const { scrollY } = useScroll();
  const scrollY_motion = useTransform(scrollY, [0, 600], [0, 40]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CARDS.length);
    }, ROTATE_INTERVAL);
  }, [stop]);

  // Auto-rotation on mount, stopped on unmount
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  if (!SHOW_PROMO) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      className="absolute right-10 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
    >
      <motion.div style={{ y: scrollY_motion }}>
        <div
          className="relative h-100 w-64 xl:h-110 xl:w-72"
          onMouseEnter={stop}
          onMouseLeave={start}
        >
          {CARDS.map((card, index) => {
            /*
             * position = 0 → front (active)
             * position = 1 → middle
             * position = 2 → back
             * Wraps around so all cards cycle through each slot.
             */
            const position =
              (index - activeIndex + CARDS.length) % CARDS.length;
            const isFront = position === 0;

            return (
              <img
                key={index}
                src={card.src}
                alt={card.alt}
                draggable={false}
                title={isFront ? "Click to book" : "Click to view"}
                onClick={() => {
                  if (isFront) {
                    navigate("/booking");
                  } else {
                    // Bring clicked card to front; interval resumes on mouse-leave
                    setActiveIndex(index);
                  }
                }}
                className={`absolute left-0 top-0 h-full w-full cursor-pointer object-cover shadow-2xl transition-all duration-700 ease-in-out ${POSITION_CLASSES[position]}`}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
