import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Check,
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  Minus,
  Plus,
} from "lucide-react";
import { useRef } from "react";
import {
  addOns,
  calculateEntranceTotal,
  calculateEventTotal,
  calculateRoomTotal,
  entranceOptions,
  eventPackages,
  formatPrice,
  getEventPackageByName,
  getEntranceOptionById,
  getRoomByName,
  rooms,
  stayTypeOptions,
  type AddOnId,
  type BookingState,
  type BookingSubmissionState,
  type BookingType,
  type EntranceTime,
  type StayType,
} from "@/lib/resort-data";

const bookingTypes: Array<{ id: BookingType; label: string }> = [
  { id: "room", label: "Room Stay" },
  { id: "event", label: "Event Package" },
  { id: "entrance", label: "Entrance" },
];

type BookingProps = {
  bookingState: BookingState;
  submissionState: BookingSubmissionState;
  onSelectBookingType: (type: BookingType) => void;
  onSelectRoom: (roomName: string) => void;
  onSelectPackage: (packageName: string) => void;
  onSetRoomDate: (date: string) => void;
  onSetEventDate: (date: string) => void;
  onSetEntranceDate: (date: string) => void;
  onSetRoomGuests: (guests: number) => void;
  onSetEventGuests: (guests: number) => void;
  onSetRoomStayType: (stayType: StayType) => void;
  onToggleRoomAddOn: (addOn: AddOnId) => void;
  onSetEntranceTime: (time: EntranceTime) => void;
  onSetEntranceGuests: (field: "adults" | "kids", value: number) => void;
  onSubmitBooking: () => void;
};

const counterBtn =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white transition-all duration-300 hover:border-foreground/30";

export function Booking({
  bookingState,
  submissionState,
  onSelectBookingType,
  onSelectRoom,
  onSelectPackage,
  onSetRoomDate,
  onSetEventDate,
  onSetEntranceDate,
  onSetRoomGuests,
  onSetEventGuests,
  onSetRoomStayType,
  onToggleRoomAddOn,
  onSetEntranceTime,
  onSetEntranceGuests,
  onSubmitBooking,
}: BookingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const selectedRoom = getRoomByName(bookingState.room.selectedRoom);
  const selectedPackage = getEventPackageByName(
    bookingState.event.selectedPackage,
  );
  const selectedEntrance = getEntranceOptionById(
    bookingState.entrance.entranceTime,
  );
  const roomTotal = calculateRoomTotal(bookingState.room);
  const eventTotal = calculateEventTotal(bookingState.event);
  const entranceTotal = calculateEntranceTotal(bookingState.entrance);
  const total =
    bookingState.activeType === "event"
      ? eventTotal
      : bookingState.activeType === "entrance"
        ? entranceTotal
        : roomTotal;

  return (
    <section
      id="booking"
      className="section-shell relative overflow-hidden bg-foreground"
    >
      <div className="absolute inset-0">
        <img
          src="/images/gallery-1.jpg"
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,45,0.95),rgba(13,23,38,0.92))]" />
      </div>

      <div className="page-shell relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-header max-w-xl"
        >
          <p className="section-kicker text-white/40">Reserve Your Stay</p>
          <h2 className="section-title text-white">
            Begin your
            <br />
            reservation.
          </h2>
          <p className="section-copy text-sm text-white/50">
            Choose your experience, set the details, and we&rsquo;ll confirm
            everything with you directly.
          </p>
        </motion.div>

        {submissionState.status !== "idle" && (
          <div
            className={`mb-8 rounded-2xl border p-5 ${
              submissionState.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : submissionState.status === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-white/15 bg-white/8 text-white backdrop-blur-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              {submissionState.status === "success" && (
                <CircleCheck size={18} className="mt-0.5 shrink-0" />
              )}
              {submissionState.status === "error" && (
                <CircleAlert size={18} className="mt-0.5 shrink-0" />
              )}
              {submissionState.status === "submitting" && (
                <LoaderCircle
                  size={18}
                  className="mt-0.5 shrink-0 animate-spin"
                />
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em]">
                  {submissionState.status === "success"
                    ? "Reservation Sent"
                    : submissionState.status === "error"
                      ? "Reservation Error"
                      : "Submitting Reservation"}
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {submissionState.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="space-y-6"
          >
            {/* Type selector */}
            <div className="flex gap-1 rounded-2xl border border-white/8 bg-white/5 p-1.5 backdrop-blur-sm">
              {bookingTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onSelectBookingType(type.id)}
                  className={`flex-1 min-h-11 rounded-xl px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                    bookingState.activeType === type.id
                      ? "bg-white text-foreground shadow-sm"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void onSubmitBooking();
              }}
              className="space-y-6 rounded-2xl bg-white p-6 md:p-8"
            >
              {bookingState.activeType === "room" && (
                <>
                  <div className="step-card space-y-6">
                    <div>
                      <p className="section-kicker mb-1">Your Stay</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Choose your room and schedule
                      </h3>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="field-label">Room Type</label>
                        <select
                          value={bookingState.room.selectedRoom}
                          onChange={(e) => onSelectRoom(e.target.value)}
                          className="form-input"
                        >
                          {rooms.map((room) => (
                            <option key={room.slug} value={room.name}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Preferred Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={bookingState.room.date}
                            onChange={(e) => onSetRoomDate(e.target.value)}
                            className="form-input"
                          />
                          <Calendar
                            size={16}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="field-label">Guests</label>
                        <div className="flex min-h-13 items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              onSetRoomGuests(bookingState.room.guests - 1)
                            }
                            className={counterBtn}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-medium text-foreground">
                            {bookingState.room.guests} / {selectedRoom.capacity}{" "}
                            pax
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onSetRoomGuests(bookingState.room.guests + 1)
                            }
                            className={counterBtn}
                          >
                            <Plus size={16} />
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
                              className={`min-h-13 rounded-xl border px-2 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
                                bookingState.room.stayType === option.id
                                  ? "border-foreground bg-foreground text-white"
                                  : "border-border bg-white text-foreground hover:border-foreground/30"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="step-card space-y-6">
                    <div>
                      <p className="section-kicker mb-1">Add-ons</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Enhance your stay
                      </h3>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Selected Room
                          </p>
                          <p className="mt-1.5 text-lg font-medium text-foreground">
                            {selectedRoom.name}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedRoom.subtitle}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Starting at
                          </p>
                          <p className="mt-1.5 font-serif text-3xl text-accent">
                            {formatPrice(
                              selectedRoom.rates[bookingState.room.stayType],
                            )}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-foreground">
                            <Check size={12} className="text-accent" /> Free
                            entrance included
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {addOns.map((addon) => (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => onToggleRoomAddOn(addon.id)}
                          className={`flex min-h-16 items-center justify-between rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                            bookingState.room.addOns.includes(addon.id)
                              ? "border-foreground bg-foreground text-white"
                              : "border-border bg-white text-foreground hover:border-foreground/25"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {addon.name}
                          </span>
                          <span
                            className={`text-sm ${bookingState.room.addOns.includes(addon.id) ? "text-white/70" : "text-accent"}`}
                          >
                            {addon.id === "grill"
                              ? "₱800–₱1,200"
                              : `${formatPrice(addon.price)}${addon.id === "extension" ? "/hr" : ""}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {bookingState.activeType === "event" && (
                <>
                  <div className="step-card space-y-5">
                    <div>
                      <p className="section-kicker mb-1">Your Package</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Choose your event package
                      </h3>
                    </div>
                    <div className="grid gap-3">
                      {eventPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => onSelectPackage(pkg.name)}
                          className={`rounded-xl border p-5 text-left transition-all duration-300 ${
                            bookingState.event.selectedPackage === pkg.name
                              ? "border-foreground bg-foreground text-white"
                              : "border-border bg-white hover:border-foreground/25"
                          }`}
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{pkg.name}</p>
                              <p
                                className={`text-sm ${bookingState.event.selectedPackage === pkg.name ? "text-white/65" : "text-muted-foreground"}`}
                              >
                                {pkg.subtitle} · {pkg.pax}
                              </p>
                            </div>
                            <span className="font-serif text-2xl">
                              {formatPrice(pkg.price)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="step-card space-y-5">
                    <div>
                      <p className="section-kicker mb-1">Details</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Date and guest count
                      </h3>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="field-label">Preferred Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={bookingState.event.date}
                            onChange={(e) => onSetEventDate(e.target.value)}
                            className="form-input"
                          />
                          <Calendar
                            size={16}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="field-label">Expected Guests</label>
                        <div className="flex min-h-13 items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              onSetEventGuests(bookingState.event.guests - 1)
                            }
                            className={counterBtn}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-medium text-foreground">
                            {bookingState.event.guests} guests
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onSetEventGuests(bookingState.event.guests + 1)
                            }
                            className={counterBtn}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {bookingState.activeType === "entrance" && (
                <>
                  <div className="step-card space-y-5">
                    <div>
                      <p className="section-kicker mb-1">Schedule</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Choose your entrance slot
                      </h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {entranceOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => onSetEntranceTime(option.id)}
                          className={`rounded-xl border p-5 text-left transition-all duration-300 ${
                            bookingState.entrance.entranceTime === option.id
                              ? "border-foreground bg-foreground text-white"
                              : "border-border bg-white hover:border-foreground/25"
                          }`}
                        >
                          <span className="block font-medium">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 block text-sm ${bookingState.entrance.entranceTime === option.id ? "text-white/65" : "text-muted-foreground"}`}
                          >
                            {option.schedule}
                          </span>
                          <span className="mt-3 block text-xs font-medium">
                            Adults {formatPrice(option.adultPrice)} · Kids{" "}
                            {formatPrice(option.kidPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="step-card space-y-5">
                    <div>
                      <p className="section-kicker mb-1">Guests</p>
                      <h3 className="text-xl font-medium text-foreground">
                        Visit date and headcount
                      </h3>
                    </div>
                    <div>
                      <label className="field-label">Visit Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingState.entrance.date}
                          onChange={(e) => onSetEntranceDate(e.target.value)}
                          className="form-input"
                        />
                        <Calendar
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      {(["adults", "kids"] as const).map((field) => (
                        <div
                          key={field}
                          className="rounded-xl border border-border bg-white p-5"
                        >
                          <p className="field-label">
                            {field === "adults" ? "Adults" : "Kids"}
                          </p>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                onSetEntranceGuests(
                                  field,
                                  bookingState.entrance[field] - 1,
                                )
                              }
                              className={counterBtn}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-serif text-4xl text-foreground">
                              {bookingState.entrance[field]}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onSetEntranceGuests(
                                  field,
                                  bookingState.entrance[field] + 1,
                                )
                              }
                              className={counterBtn}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Summary */}
              <div className="step-card space-y-5">
                <div>
                  <p className="section-kicker mb-1">Summary</p>
                  <h3 className="text-xl font-medium text-foreground">
                    Review your reservation
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {bookingState.activeType === "room" && (
                    <>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Room
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {selectedRoom.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {bookingState.room.stayType} stay ·{" "}
                          {bookingState.room.guests} guests
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Add-ons
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {bookingState.room.addOns.length > 0
                            ? bookingState.room.addOns
                                .map(
                                  (id) => addOns.find((a) => a.id === id)?.name,
                                )
                                .filter(Boolean)
                                .join(", ")
                            : "None selected"}
                        </p>
                      </div>
                    </>
                  )}
                  {bookingState.activeType === "event" && (
                    <>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Package
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {selectedPackage.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedPackage.pax}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Guests
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {bookingState.event.guests} expected guests
                        </p>
                      </div>
                    </>
                  )}
                  {bookingState.activeType === "entrance" && (
                    <>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Schedule
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {selectedEntrance.label}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedEntrance.schedule}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Guests
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {bookingState.entrance.adults} adults ·{" "}
                          {bookingState.entrance.kids} kids
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-5 rounded-xl bg-foreground px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {bookingState.activeType === "entrance"
                        ? "Total Entrance Fee"
                        : "Estimated Total"}
                    </p>
                    <p className="mt-2 font-serif text-4xl text-white">
                      {formatPrice(total)}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={submissionState.status === "submitting"}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-medium text-foreground transition-all duration-300 hover:opacity-90 disabled:opacity-50 md:w-auto"
                  >
                    {submissionState.status === "submitting"
                      ? "Sending..."
                      : "Reserve Now"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="space-y-5"
          >
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm">
              <p className="section-kicker mb-1 text-white/35">
                Quick Reference
              </p>
              <h3 className="mb-5 text-base font-medium text-white">
                Entrance Rates
              </h3>
              <div className="space-y-3">
                {entranceOptions.map((option) => (
                  <div
                    key={option.id}
                    className="rounded-xl border border-white/8 bg-white/4 p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs text-white/45">
                      {option.schedule}
                    </p>
                    <div className="mt-3 flex gap-6 text-sm">
                      <div>
                        <p className="text-xs text-white/40">Adults</p>
                        <p className="mt-0.5 font-medium text-white">
                          {formatPrice(option.adultPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Kids</p>
                        <p className="mt-0.5 font-medium text-white">
                          {formatPrice(option.kidPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Info size={16} className="mt-0.5 shrink-0 text-white/40" />
                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    Booking Notes
                  </h4>
                  <ul className="space-y-2 text-xs leading-relaxed text-white/50">
                    <li>Free entrance for all room guests</li>
                    <li>50% downpayment required for peak dates</li>
                    <li>Extra guest charges apply beyond capacity</li>
                    <li>Day 9AM–5PM · Night 7PM–7AM · 22 Hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
