import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Check, ChevronLeft, Flame, Mic, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { GalleryModal } from "./GalleryModal";
import {
  echoExperience,
  formatPrice,
  roomHasSeasonalPricing,
  rooms,
  seasonOptions,
  stayTypeOptions,
  type Room,
} from "@/lib/resort-data";

type RoomDetailPageProps = {
  room: Room;
  onBackToRooms: () => void;
  onSelectRoom: (roomName: string) => void;
  onViewRoom: (slug: string) => void;
};

export function RoomDetailPage({
  room,
  onBackToRooms,
  onSelectRoom,
  onViewRoom,
}: RoomDetailPageProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const relatedRooms = rooms.filter((r) => r.slug !== room.slug).slice(0, 2);

  const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);
  const videoSrc = room.gallery.slice(1).find(isVideo);
  const rightItems = videoSrc ? [videoSrc] : room.gallery.slice(1, 3);

  return (
    <>
      <main>
        {/* Hero gallery */}
        <section className="pt-20 pb-0">
          <div className="page-shell">
            <button
              type="button"
              onClick={onBackToRooms}
              className="mb-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <ChevronLeft size={14} />
              Back
            </button>

            <div className="mb-8">
              <p className="section-kicker">Ukiyo Rooms</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-5xl font-medium text-foreground md:text-6xl">
                  {room.name}
                </h1>
                {room.badge && (
                  <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                    {room.badge}
                  </span>
                )}
              </div>
              {room.tagline && (
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  {room.tagline}
                </p>
              )}
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {room.subtitle}
              </p>
            </div>

            <div className="grid gap-2 lg:h-120 lg:grid-cols-[2fr_1fr]">
              {/* Main image */}
              <div className="overflow-hidden">
                <img
                  src={room.gallery[0]}
                  alt={room.name}
                  className="h-75 w-full object-cover lg:h-full"
                />
              </div>
              {/* Right column */}
              <div className={`grid gap-2 ${rightItems.length === 2 ? 'grid-cols-2 lg:grid-cols-1 lg:grid-rows-2' : ''}`}>
                {rightItems.map((src, index) => (
                  <div key={src} className="relative overflow-hidden">
                    {isVideo(src) ? (
                      <video
                        src={src}
                        className="h-60 w-full object-cover lg:h-full"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <>
                        <img
                          src={src}
                          alt={`${room.name} view ${index + 2}`}
                          className="h-36 w-full object-cover lg:h-full"
                        />
                        {index === 1 && (
                          <button
                            type="button"
                            onClick={() => setIsGalleryOpen(true)}
                            className="absolute inset-0 flex items-center justify-center bg-foreground/40 transition-colors duration-300 hover:bg-foreground/55"
                          >
                            <span className="border border-white/80 bg-white/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                              View All Photos
                            </span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Details + Sidebar */}
        <section className="section-shell bg-white">
          <div className="page-shell">
            <div className="max-w-3xl">
              <div className="space-y-12">
                <div className="border-b border-border pb-10">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Capacity
                  </p>
                  <h2 className="mt-3 text-3xl font-medium text-foreground">
                    {room.maxPax
                      ? `${room.capacity}–${room.maxPax} pax`
                      : room.minPax
                        ? `Good for ${room.minPax}–${room.capacity} pax`
                        : `Good for ${room.capacity} pax`}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {room.description}
                  </p>
                  {room.valuePoints && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {room.valuePoints.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
                        >
                          <Check size={14} className="shrink-0 text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-b border-border pb-10">
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Room Features
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {room.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
                      >
                        <Check size={14} className="shrink-0 text-accent" />
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-10">
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Inclusions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.inclusions.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-10">
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Rates
                  </p>
                  {roomHasSeasonalPricing(room) ? (
                    <div className="overflow-hidden rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-background">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                              Stay
                            </th>
                            {seasonOptions.map((s) => (
                              <th
                                key={s.id}
                                className="px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                              >
                                {s.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stayTypeOptions.map((opt) => (
                            <tr
                              key={opt.id}
                              className="border-b border-border last:border-0"
                            >
                              <td className="px-4 py-4">
                                <p className="font-medium text-foreground">
                                  {opt.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {opt.description}
                                </p>
                              </td>
                              {seasonOptions.map((s) => (
                                <td
                                  key={s.id}
                                  className="px-3 py-4 text-center font-serif text-lg text-accent"
                                >
                                  {formatPrice(room.rates[opt.id][s.id])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      {stayTypeOptions.map((option) => (
                        <div
                          key={option.id}
                          className="rounded-xl border border-border bg-white p-5"
                        >
                          <p className="text-lg font-medium text-foreground">
                            {option.label}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {option.description}
                          </p>
                          <p className="mt-4 font-serif text-2xl text-accent">
                            {formatPrice(room.rates[option.id].weekday)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Notes
                  </p>
                  <ul className="space-y-2">
                    {room.notes.map((note) => (
                      <li
                        key={note}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Echo Rooms promo */}
        <section className="section-shell bg-[#080f1e] overflow-hidden">
          <div className="page-shell">
            <div className="relative overflow-hidden rounded-2xl">
              {/* Gradient canvas */}
              <div className="relative bg-linear-to-br from-[#1a053a] via-[#180f60] to-[#0c1a2e] px-6 py-10 md:px-12 md:py-14">
                {/* Glow orbs */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative grid gap-10 md:grid-cols-[1fr_auto]">
                  {/* Left: content */}
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400/70">
                      Featured Experience
                    </p>
                    <h2 className="mb-1 text-4xl font-black text-white md:text-5xl">
                      Echo{" "}
                      <span className="bg-linear-to-r from-sky-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                        Rooms
                      </span>
                    </h2>
                    <p className="mb-8 text-lg font-semibold text-white/50">
                      Sing. Stay. Repeat.
                    </p>

                    {/* Feature grid */}
                    <div className="mb-8 grid gap-3 sm:grid-cols-3">
                      {/* Karaoke */}
                      <div className="rounded-xl border border-sky-400/20 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/15">
                          <Mic size={15} className="text-sky-400" />
                        </div>
                        <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-white">
                          Private Karaoke Room
                        </p>
                        <p className="mb-3 text-xs text-white/40">
                          For {echoExperience.karaokePax}
                        </p>
                        <p className="text-[10px] text-white/30">Starting at</p>
                        <p className="text-xl font-black text-white">
                          {formatPrice(echoExperience.karaokePrice)}
                        </p>
                      </div>

                      {/* Overnight */}
                      <div className="rounded-xl border border-purple-400/20 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/15">
                          <BedDouble size={15} className="text-purple-400" />
                        </div>
                        <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-white">
                          Overnight Stay
                        </p>
                        <p className="mb-3 text-xs text-white/40">
                          {echoExperience.overnightDescription}
                        </p>
                        <p className="text-xl font-black text-white">
                          {formatPrice(echoExperience.overnightPrice)}
                        </p>
                      </div>

                      {/* Pool promo */}
                      <div className="flex flex-col justify-between rounded-xl border border-amber-400/20 bg-amber-500/8 p-4 backdrop-blur-sm">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15">
                          <Flame size={15} className="text-amber-400" />
                        </div>
                        <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-amber-300">
                          Free Pool Access
                        </p>
                        <p className="text-xs text-white/40">
                          {echoExperience.promoExpiry}
                          <br />
                          Day use included
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <Waves size={12} />
                          Included free
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/booking?promo=echo"
                      className="inline-flex items-center gap-2.5 rounded-xl bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 px-7 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-purple-700/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-600/35"
                    >
                      Reserve Echo Experience
                      <ArrowRight size={15} />
                    </Link>
                    <p className="mt-3 text-xs text-white/30">
                      Limited slots daily · Bundle total{" "}
                      {formatPrice(echoExperience.totalPrice)}
                    </p>
                  </div>

                  {/* Right: decorative waveform */}
                  <div className="hidden md:flex items-center">
                    <svg
                      viewBox="0 0 64 120"
                      fill="none"
                      className="h-32 w-16 opacity-30"
                    >
                      {[
                        [28, 64],
                        [16, 90],
                        [24, 74],
                        [10, 100],
                        [20, 80],
                        [30, 60],
                        [18, 84],
                        [26, 70],
                      ].map(([y, h], i) => (
                        <rect
                          key={i}
                          x={i * 8}
                          y={y}
                          width="5"
                          height={h}
                          rx="2.5"
                          fill="url(#rdEchoGrad)"
                        />
                      ))}
                      <defs>
                        <linearGradient id="rdEchoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#c026d3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related rooms */}
        <section className="section-shell bg-white">
          <div className="page-shell">
            <div className="section-header">
              <p className="section-kicker">Explore More</p>
              <h2 className="section-title">You might also like</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              {relatedRooms.map((related, index) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  className="group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-500 hover:shadow-md"
                >
                  <div className="overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-medium text-foreground">
                          {related.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {related.subtitle}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-serif text-2xl text-accent">
                          {formatPrice(
                            related.maxPax
                              ? related.rates.day.weekday
                              : related.rates.night.weekday,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {related.maxPax ? "day tour" : "/ night"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-border pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRoom(related.name);
                          onViewRoom(related.slug);
                        }}
                        className="primary-cta w-full"
                      >
                        View Room
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {isGalleryOpen && (
        <GalleryModal
          images={room.gallery}
          title={room.name}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
}
