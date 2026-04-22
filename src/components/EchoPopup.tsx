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
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="echo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/*
           * LAYOUT STRATEGY
           * ─────────────────────────────────────────────────────────
           * Mobile (default):
           *   - Anchored to bottom (bottom sheet)
           *   - Image capped at 60svh with object-cover + object-top
           *     so the logo / title / pricing are always visible
           *   - CTA pinned at the bottom, never hidden
           *   - Rounded top corners only
           *
           * sm (≥ 640px — tablet portrait / most iPads):
           *   - Centred vertically with padding
           *   - Image at natural height, capped at 65svh
           *   - Fully rounded corners
           *
           * md (≥ 768px — tablet landscape / desktop):
           *   - Centred, max-w-md
           *   - Image at natural height, no extra cap needed
           * ─────────────────────────────────────────────────────────
           */}

          {/* Positioner */}
          <div
            className="fixed inset-x-0 bottom-0 z-61 flex justify-center sm:inset-0 sm:items-center sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Echo Rooms promotion"
            onClick={(e) => {
              if (e.target === e.currentTarget) dismiss();
            }}
          >
            <motion.div
              key="echo-modal"
              initial={{ opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 56 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className={[
                // base
                "relative flex w-full flex-col overflow-hidden",
                "bg-[#09090f] shadow-2xl ring-1 ring-white/10",
                // mobile: bottom sheet shape
                "rounded-t-2xl",
                // sm+: centred card shape + size cap
                "sm:max-w-sm sm:rounded-2xl",
                // md+: slightly wider
                "md:max-w-md",
              ].join(" ")}
            >
              {/* ── Close button ── */}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close promotion"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white/65 backdrop-blur-sm transition-all duration-200 hover:bg-black/75 hover:text-white active:scale-90"
              >
                <X size={16} />
              </button>

              {/*
               * ── Promo image ──
               *
               * Mobile: capped at 60svh, object-cover + object-top
               *   → logo / tagline / pricing boxes always shown
               *   → bottom pool section cropped (fine — phone number is in CTA strip)
               *
               * sm+: natural height, object-cover keeps full width,
               *   capped at 68svh so the CTA is always reachable without scroll
               */}
              <div className="overflow-hidden">
                <img
                  src="/images/echo-rooms-promo.jpg"
                  alt="Echo Rooms — Sing. Stay. Repeat. Limited promo: Free Pool Access"
                  className={[
                    "block w-full object-cover object-top",
                    // mobile cap
                    "max-h-[60svh]",
                    // sm+: show more of the image
                    "sm:max-h-[65svh]",
                    // md+: relax the cap a little more
                    "md:max-h-[70svh]",
                  ].join(" ")}
                  draggable={false}
                />
              </div>

              {/*
               * ── CTA strip ──
               * shrink-0 + bg keeps this always visible at the bottom.
               * pb-safe handles iPhone home-indicator on all browsers.
               */}
              <div className="shrink-0 px-4 pb-6 pt-3.5 sm:pb-5">
                <button
                  type="button"
                  onClick={handleCTA}
                  className="w-full rounded-xl bg-orange-500 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] hover:bg-orange-600 active:scale-[0.98]"
                >
                  Reserve Echo Experience →
                </button>
                <p className="mt-2.5 text-center text-[10px] text-white/30">
                  Limited slots daily&ensp;·&ensp;0919 999 7740
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
