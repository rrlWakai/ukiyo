import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "echo-popup-seen";
const DELAY_MS = 5000;

export function EchoPopup() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleCTA = () => {
    dismiss();
    navigate("/booking?promo=echo");
  };

  return (
    <AnimatePresence>
      {visible && (
        // ── Full-screen overlay ──
        <motion.div
          key="echo-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Echo Rooms promotion"
        >
          {/* ── Modal card ── */}
          <motion.div
            key="echo-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative h-[80vh] w-full max-w-md cursor-pointer overflow-hidden rounded-2xl"
            onClick={handleCTA}
          >
            {/* Image — fills entire card */}
            <img
              src="/images/echo-rooms-promo.jpg"
              alt="Echo Rooms — Sing. Stay. Repeat."
              className="h-full w-full object-cover"
              draggable={false}
            />

            {/* Close button — floating top-right */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); dismiss(); }}
              aria-label="Close promotion"
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
