import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, ChevronLeft, Minus, Plus } from "lucide-react";
import { GalleryModal } from "./GalleryModal";
import {
  addOns,
  calculateRoomTotal,
  formatPrice,
  getRoomByName,
  roomHasSeasonalPricing,
  rooms,
  seasonOptions,
  stayTypeOptions,
  type AddOnId,
  type BookingState,
  type Room,
  type StayType,
} from "@/lib/resort-data";

type RoomDetailPageProps = {
  room: Room;
  bookingState: BookingState;
  onBackToRooms: () => void;
  onSetRoomDate: (date: string) => void;
  onSetRoomGuests: (guests: number) => void;
  onSetRoomStayType: (stayType: StayType) => void;
  onToggleRoomAddOn: (addOn: AddOnId) => void;
  onSelectRoom: (roomName: string) => void;
  onViewRoom: (slug: string) => void;
  onReserveRoom: (roomName: string) => void;
};

export function RoomDetailPage({
  room,
  bookingState,
  onBackToRooms,
  onSetRoomDate,
  onSetRoomGuests,
  onSetRoomStayType,
  onToggleRoomAddOn,
  onSelectRoom,
  onViewRoom,
  onReserveRoom,
}: RoomDetailPageProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const activeRoom = getRoomByName(room.name);
  const relatedRooms = rooms.filter((r) => r.slug !== room.slug).slice(0, 2);
  const roomBooking = bookingState.room;
  const roomTotal = calculateRoomTotal(roomBooking);

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

            <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={room.gallery[0]}
                  alt={room.name}
                  className="h-full min-h-105 w-full object-cover"
                />
              </div>
              <div className="grid gap-3">
                {room.gallery.slice(1).map((image, index) => (
                  <div
                    key={image}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={image}
                      alt={`${room.name} ${index + 2}`}
                      className="h-52 w-full object-cover"
                    />
                    {index === room.gallery.slice(1).length - 1 && (
                      <button
                        type="button"
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition-colors duration-300 hover:bg-foreground/45"
                      >
                        <span className="rounded-xl border border-white bg-white/90 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
                          View All Photos
                        </span>
                      </button>
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
            <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
              {/* Detail content */}
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
                          <span className="text-sm font-medium text-foreground">{point}</span>
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
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Stay</th>
                            {seasonOptions.map((s) => (
                              <th key={s.id} className="px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{s.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stayTypeOptions.map((opt) => (
                            <tr key={opt.id} className="border-b border-border last:border-0">
                              <td className="px-4 py-4">
                                <p className="font-medium text-foreground">{opt.label}</p>
                                <p className="text-xs text-muted-foreground">{opt.description}</p>
                              </td>
                              {seasonOptions.map((s) => (
                                <td key={s.id} className="px-3 py-4 text-center font-serif text-lg text-accent">
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
                        <div key={option.id} className="rounded-xl border border-border bg-white p-5">
                          <p className="text-lg font-medium text-foreground">{option.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                          <p className="mt-4 font-serif text-2xl text-accent">
                            {formatPrice(room.rates[option.id].weekday)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-b border-border pb-10">
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Add-ons
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {addOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-4"
                      >
                        <span className="text-sm text-foreground">
                          {addon.name}
                        </span>
                        <span className="text-sm text-accent">
                          {addon.id === "grill"
                            ? "₱800–₱1,200"
                            : `${formatPrice(addon.price)}${addon.id === "extension" ? "/hr" : ""}`}
                        </span>
                      </div>
                    ))}
                  </div>
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

              {/* Sticky booking sidebar */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-border bg-background p-6 md:p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Book this room
                  </p>
                  <h2 className="mt-3 text-2xl font-medium text-foreground">
                    {activeRoom.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Starting price
                  </p>
                  <p className="mt-2 font-serif text-5xl text-accent">
                    {formatPrice(activeRoom.rates[roomBooking.stayType].weekday)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent">
                    <Check size={11} /> Free entrance included
                  </span>

                  <div className="mt-7 space-y-5">
                    <div>
                      <label className="field-label">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={roomBooking.date}
                          onChange={(e) => onSetRoomDate(e.target.value)}
                          className="form-input"
                        />
                        <Calendar
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Guests</label>
                      <div className="flex min-h-13 items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            onSetRoomGuests(roomBooking.guests - 1)
                          }
                          className="surface-button h-9 w-9 px-0"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium text-foreground">
                          {roomBooking.guests} guests
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onSetRoomGuests(roomBooking.guests + 1)
                          }
                          className="surface-button h-9 w-9 px-0"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Stay Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {stayTypeOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => onSetRoomStayType(option.id)}
                            className={`min-h-11 rounded-xl border px-2 py-2.5 text-xs font-medium uppercase tracking-wide transition-all duration-300 ${
                              roomBooking.stayType === option.id
                                ? "border-foreground bg-foreground text-white"
                                : "border-border bg-white text-foreground hover:border-foreground/30"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Add-ons</label>
                      <div className="space-y-2">
                        {addOns.map((addon) => (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => onToggleRoomAddOn(addon.id)}
                            className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-300 ${
                              roomBooking.addOns.includes(addon.id)
                                ? "border-foreground bg-foreground text-white"
                                : "border-border bg-white text-foreground hover:border-foreground/30"
                            }`}
                          >
                            <span>{addon.name}</span>
                            <span
                              className={
                                addon.id !== "grill" &&
                                roomBooking.addOns.includes(addon.id)
                                  ? "text-white/70"
                                  : "text-accent"
                              }
                            >
                              {addon.id === "grill"
                                ? "₱800–₱1,200"
                                : formatPrice(addon.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-border pt-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Estimated Total
                    </p>
                    <p className="mt-2 font-serif text-4xl text-accent">
                      {formatPrice(roomTotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onReserveRoom(room.name)}
                      className="primary-cta mt-5 w-full"
                    >
                      Reserve Now
                    </button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Continue to the booking page to confirm.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="section-shell bg-background">
          <div className="page-shell">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/gallery-6.jpg"
                alt="Resort atmosphere"
                className="h-96 w-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="absolute inset-0 flex items-end justify-center p-10 text-center text-white">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/50">
                    Guest Review
                  </p>
                  <p className="mt-4 font-serif text-2xl leading-snug md:text-3xl">
                    {room.testimonial}
                  </p>
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
                          {formatPrice(related.maxPax ? related.rates.day.weekday : related.rates.night.weekday)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {related.maxPax ? 'day tour' : '/ night'}
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
