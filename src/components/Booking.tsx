import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  Flame,
  Info,
  LoaderCircle,
  Mic,
  Minus,
  Plus,
  Shield,
  Users,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  addOns,
  calculateEntranceTotal,
  calculateEventTotal,
  calculateRoomTotal,
  echoExperience,
  entranceOptions,
  eventPackages,
  extensionRates,
  formatPrice,
  getExtensionPrice,
  getRoomByName,
  getSeasonFromDate,
  rooms,
  stayTypeOptions,
  type AddOnId,
  type BookingState,
  type BookingSubmissionState,
  type BookingType,
  type EntranceTime,
  type ExtensionHours,
  type StayType,
} from "@/lib/resort-data";

const bookingTypes: Array<{ id: BookingType; label: string }> = [
  { id: "room", label: "Room Stay" },
  { id: "event", label: "Event Package" },
  { id: "entrance", label: "Entrance" },
];

const ADDON_META: Record<AddOnId, { label: string }> = {
  breakfast: { label: "Breakfast Set" },
  grill: { label: "Grill Use" },
  towel: { label: "Extra Towel" },
  ktv: { label: "Echo Rooms" },
};

// Ordered without KTV — Echo is its own featured section
const STANDARD_ADDON_ORDER: AddOnId[] = ["breakfast", "grill", "towel"];

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

// Inline Echo Rooms SVG logo (house outline + equalizer bars)
function EchoLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polyline
        points="2,28 32,5 62,28"
        stroke="url(#eg)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="28"
        x2="8"
        y2="57"
        stroke="url(#eg)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="56"
        y1="28"
        x2="56"
        y2="57"
        stroke="url(#eg)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="57"
        x2="56"
        y2="57"
        stroke="url(#eg)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="15"
        y="36"
        width="6"
        height="16"
        rx="2"
        fill="url(#eg)"
        opacity="0.8"
      />
      <rect x="23" y="29" width="6" height="23" rx="2" fill="url(#eg)" />
      <rect
        x="31"
        y="40"
        width="6"
        height="12"
        rx="2"
        fill="url(#eg)"
        opacity="0.65"
      />
      <rect
        x="39"
        y="32"
        width="6"
        height="20"
        rx="2"
        fill="url(#eg)"
        opacity="0.9"
      />
      <rect
        x="47"
        y="37"
        width="5"
        height="15"
        rx="2"
        fill="url(#eg)"
        opacity="0.75"
      />
      <defs>
        <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const ctrBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-150 hover:border-gray-400 active:scale-95";

const echoTitleCls =
  "bg-linear-to-br from-sky-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent";

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [searchParams] = useSearchParams();
  const echoRef = useRef<HTMLDivElement>(null);
  const [echoMode, setEchoMode] = useState(() => sessionStorage.getItem('echo-mode') === '1');
  const [echoHighlight, setEchoHighlight] = useState(false);
  const [extensionHours, setExtensionHours] = useState<ExtensionHours | null>(
    null,
  );
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  const selectedRoom = getRoomByName(bookingState.room.selectedRoom);
  const currentExtensionRates = extensionRates[selectedRoom.slug];
  const extensionPrice = extensionHours
    ? getExtensionPrice(selectedRoom.slug, extensionHours)
    : 0;
  const roomTotal = calculateRoomTotal(bookingState.room) + extensionPrice;
  const eventTotal = calculateEventTotal(bookingState.event);
  const entranceTotal = calculateEntranceTotal(bookingState.entrance);
  const baseTotal =
    bookingState.activeType === "event"
      ? eventTotal
      : bookingState.activeType === "entrance"
        ? entranceTotal
        : roomTotal;

  // Echo mode overrides the displayed total with real promo pricing
  const displayTotal =
    echoMode && bookingState.activeType === "room"
      ? echoExperience.totalPrice
      : baseTotal;

  const standardAddOns = STANDARD_ADDON_ORDER.map(
    (id) => addOns.find((a) => a.id === id)!,
  ).filter(Boolean);

  const triggerEchoHighlight = () => {
    setEchoHighlight(true);
    setTimeout(() => setEchoHighlight(false), 3000);
  };

  const scrollToEcho = () => {
    echoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    triggerEchoHighlight();
  };

  const reserveEchoExperience = () => {
    onSelectBookingType("room");
    onSelectRoom(echoExperience.compatibleRoom);
    onSetRoomStayType("22hrs");
    onSetRoomGuests(echoExperience.defaultGuests);
    sessionStorage.setItem('echo-mode', '1');
    setEchoMode(true);
  };

  const cancelEchoMode = () => {
    sessionStorage.removeItem('echo-mode');
    setEchoMode(false);
  };

  useEffect(() => {
    if (searchParams.get("promo") === "echo") {
      const t = setTimeout(() => {
        scrollToEcho();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!roomDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-room-dropdown]"))
        setRoomDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [roomDropdownOpen]);

  return (
    <section
      id="booking"
      className="relative min-h-screen overflow-hidden bg-[#080f1e] pb-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/gallery-1.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#080f1e]/98 via-[#0a1220]/95 to-[#080f1e]" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 pt-6 xl:max-w-5xl xl:px-8">
        {/* Submission banner */}
        {submissionState.status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 rounded-2xl border p-4 ${
              submissionState.status === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : submissionState.status === "error"
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            <div className="flex items-start gap-3">
              {submissionState.status === "success" && (
                <CircleCheck size={15} className="mt-0.5 shrink-0" />
              )}
              {submissionState.status === "error" && (
                <CircleAlert size={15} className="mt-0.5 shrink-0" />
              )}
              {submissionState.status === "submitting" && (
                <LoaderCircle
                  size={15}
                  className="mt-0.5 shrink-0 animate-spin"
                />
              )}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {submissionState.status === "success"
                    ? "Reservation Sent"
                    : submissionState.status === "error"
                      ? "Reservation Error"
                      : "Submitting…"}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed">
                  {submissionState.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={ref} className="xl:grid xl:grid-cols-[1fr_300px] xl:gap-8">
          {/* ── Left column ── */}
          <div className="space-y-3">
            {/* ── Tabs + Echo trigger ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              {/* Mobile: stacked. sm+: side-by-side */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                {/* Filter tabs */}
                <div className="flex flex-1 gap-1 rounded-2xl border border-white/8 bg-white/5 p-1.5 backdrop-blur-md">
                  {bookingTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => onSelectBookingType(type.id)}
                      className={`flex min-h-11 flex-1 items-center justify-center rounded-xl px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                        bookingState.activeType === type.id
                          ? "bg-white text-[#080f1e] shadow-sm"
                          : "text-white/45 hover:text-white/75"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Echo trigger */}
                <button
                  type="button"
                  onClick={scrollToEcho}
                  className={`group flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300 sm:justify-start ${
                    echoHighlight || echoMode
                      ? "border-purple-400/60 bg-purple-500/20 text-purple-200"
                      : "border-purple-500/25 bg-purple-500/8 text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/15"
                  }`}
                >
                  <Mic
                    size={14}
                    className={`shrink-0 transition-colors ${echoMode ? "text-purple-300" : "text-purple-400"}`}
                  />
                  <span className="whitespace-nowrap">Try Echo Rooms</span>
                  <span className="rounded-full bg-purple-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    NEW
                  </span>
                  <ChevronRight
                    size={13}
                    className="shrink-0 text-purple-400/50 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>

            {/* ─────────────────────────────────────────────
                ROOM STAY
            ───────────────────────────────────────────── */}
            {bookingState.activeType === "room" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="space-y-3"
              >
                {/* Main form card */}
                <div className="rounded-2xl bg-white p-5 shadow-2xl">
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
                    Your Stay
                  </p>
                  <h3 className="mb-5 text-lg font-semibold text-gray-900">
                    Choose your room and schedule
                  </h3>

                  {/* Room type */}
                  <div className="mb-4">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Room Type
                    </label>
                    <div className="relative" data-room-dropdown>
                      <button
                        type="button"
                        onClick={() => setRoomDropdownOpen((v) => !v)}
                        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-gray-300 focus:outline-none"
                      >
                        <img
                          src={selectedRoom.image}
                          alt={selectedRoom.name}
                          className="h-9 w-12 shrink-0 rounded-lg object-cover"
                        />
                        <span className="flex-1 truncate text-sm font-medium text-gray-900">
                          {selectedRoom.name}
                        </span>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-gray-400 transition-transform duration-200 ${roomDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {roomDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                          {rooms.map((room) => {
                            const active =
                              bookingState.room.selectedRoom === room.name;
                            return (
                              <button
                                key={room.slug}
                                type="button"
                                onClick={() => {
                                  onSelectRoom(room.name);
                                  setRoomDropdownOpen(false);
                                  if (echoMode) setEchoMode(false);
                                }}
                                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${active ? "bg-gray-50" : ""}`}
                              >
                                <img
                                  src={room.image}
                                  alt={room.name}
                                  className="h-8 w-11 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {room.name}
                                  </p>
                                  <p className="truncate text-xs text-gray-400">
                                    {room.subtitle}
                                  </p>
                                </div>
                                {active && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date + Guests */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar
                          size={13}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="date"
                          value={bookingState.room.date}
                          onChange={(e) => onSetRoomDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 pr-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                        />
                      </div>
                      {bookingState.room.date && (() => {
                        const season = getSeasonFromDate(bookingState.room.date)
                        const rate = selectedRoom.rates[bookingState.room.stayType][season]
                        const label = season === 'peak' ? '🔴 Peak Season' : season === 'weekend' ? '🟡 Weekend' : '🟢 Weekday'
                        return (
                          <p className="mt-1 text-[10px] text-gray-400">
                            {label} · base {formatPrice(rate)}
                          </p>
                        )
                      })()}
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Guests
                      </label>
                      <div className="flex h-12 items-center justify-between gap-1 rounded-xl border border-gray-200 px-2">
                        <button
                          type="button"
                          onClick={() =>
                            onSetRoomGuests(bookingState.room.guests - 1)
                          }
                          className={ctrBtn}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-center text-sm font-semibold text-gray-900">
                          {bookingState.room.guests}&thinsp;/&thinsp;
                          {selectedRoom.maxPax ?? selectedRoom.capacity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onSetRoomGuests(bookingState.room.guests + 1)
                          }
                          className={ctrBtn}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stay type */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Stay Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {stayTypeOptions.map((opt) => {
                        const active = bookingState.room.stayType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSetRoomStayType(opt.id)}
                            className={`flex flex-col items-center justify-center rounded-xl border py-3 transition-all duration-200 ${
                              active
                                ? "border-[#080f1e] bg-[#080f1e]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold uppercase tracking-[0.1em] ${active ? "text-white" : "text-gray-800"}`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`mt-0.5 text-[10px] ${active ? "text-white/55" : "text-gray-400"}`}
                            >
                              {opt.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────
                    ECHO ROOMS — FEATURED EXPERIENCE
                ───────────────────────────────────────────── */}
                <div
                  ref={echoRef}
                  className={`transition-all duration-500 ${echoHighlight && !echoMode ? "scale-[1.015]" : ""}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl transition-all duration-400 ${
                      echoMode
                        ? "ring-2 ring-purple-400/70 shadow-xl shadow-purple-900/40"
                        : echoHighlight
                          ? "ring-2 ring-sky-400/50 shadow-lg shadow-sky-900/30"
                          : ""
                    }`}
                  >
                    {/* Dark gradient canvas */}
                    <div className="relative bg-linear-to-br from-[#1a053a] via-[#180f60] to-[#0c1a2e] p-6">
                      {/* Ambient glow orbs */}
                      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-600/18 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-sky-500/12 blur-3xl" />
                      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl" />

                      {/* ── Header row ── */}
                      <div className="relative mb-5 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <EchoLogo className="h-11 w-11 shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-purple-400/70">
                              Featured Experience
                            </p>
                            <h3
                              className={`text-2xl font-black leading-none tracking-tight ${echoTitleCls}`}
                            >
                              Echo Rooms
                            </h3>
                          </div>
                        </div>

                        {echoMode && (
                          <button
                            type="button"
                            onClick={cancelEchoMode}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/6 px-2 py-1.5 text-[10px] font-medium text-white/45 transition-colors hover:bg-white/10 hover:text-white/70"
                          >
                            <X size={11} />
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* ── Tagline ── */}
                      <p className="relative mb-6 text-3xl font-black leading-tight tracking-tight text-white">
                        Sing.
                        <br />
                        Stay.
                        <br />
                        <span className={echoTitleCls}>Repeat.</span>
                      </p>

                      {/* ── Feature blocks ── */}
                      <div className="relative mb-5 grid grid-cols-[1fr_36px_1fr] items-center gap-2">
                        {/* Karaoke block */}
                        <div className="rounded-xl border border-sky-400/20 bg-white/5 p-4 backdrop-blur-sm">
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-400/15">
                              <Mic size={14} className="text-sky-400" />
                            </div>
                            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-white">
                              Private Karaoke Room
                            </p>
                          </div>
                          <p className="mb-3 text-xs text-white/45">
                            For {echoExperience.karaokePax}
                          </p>
                          <p className="text-[10px] text-white/35">
                            Starting at
                          </p>
                          <p className="text-2xl font-black text-white">
                            ₱{echoExperience.karaokePrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Plus separator */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6">
                          <Plus size={15} className="text-white/40" />
                        </div>

                        {/* Overnight block */}
                        <div className="rounded-xl border border-purple-400/20 bg-white/5 p-4 backdrop-blur-sm">
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-400/15">
                              <BedDouble
                                size={14}
                                className="text-purple-400"
                              />
                            </div>
                            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-white">
                              Overnight Stay
                            </p>
                          </div>
                          <p className="mb-3 text-xs text-white/45">
                            {echoExperience.overnightDescription}
                          </p>
                          <p className="text-2xl font-black text-white">
                            ₱{echoExperience.overnightPrice.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-purple-300/50">
                            Overnight Stay
                          </p>
                        </div>
                      </div>

                      {/* ── Free pool promo bar ── */}
                      <div className="relative mb-5 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 backdrop-blur-sm">
                        <Flame size={18} className="shrink-0 text-amber-400" />
                        <div className="flex-1">
                          <p className="text-sm font-bold uppercase tracking-[0.1em] text-amber-300">
                            Free Pool Access
                          </p>
                          <p className="text-xs text-white/45">
                            {echoExperience.promoExpiry}&nbsp;·&nbsp;Day use
                            included
                          </p>
                        </div>
                        <Waves size={18} className="shrink-0 text-sky-400/40" />
                      </div>

                      {/* ── Reserve CTA ── */}
                      <button
                        type="button"
                        onClick={reserveEchoExperience}
                        className={`relative w-full rounded-xl py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 ${
                          echoMode
                            ? "bg-linear-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-700/30"
                            : "bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-600/25"
                        }`}
                      >
                        {echoMode ? (
                          <span className="flex items-center justify-center gap-2">
                            <CircleCheck size={15} />
                            Echo Experience Selected&ensp;·&ensp;
                            {formatPrice(echoExperience.totalPrice)}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Reserve Echo Experience
                            <ArrowRight size={15} />
                          </span>
                        )}
                      </button>
                      <p className="mt-2.5 text-center text-[10px] text-white/30">
                        Limited slots daily · Now open at the resort
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Add-ons card ── */}
                <div className="rounded-2xl bg-white p-5 shadow-2xl">
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
                    Add-ons
                  </p>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Enhance your stay
                  </h3>

                  {/* Echo mode summary strip */}
                  {echoMode && (
                    <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
                      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
                        <Mic size={12} />
                        Echo Experience Included
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-purple-700">
                          <span className="flex items-center gap-1.5">
                            <Mic size={11} className="text-purple-400" />
                            Karaoke Room (6–12 pax)
                          </span>
                          <span className="font-bold">
                            {formatPrice(echoExperience.karaokePrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-purple-700">
                          <span className="flex items-center gap-1.5">
                            <BedDouble size={11} className="text-purple-400" />
                            Overnight Stay
                          </span>
                          <span className="font-bold">
                            {formatPrice(echoExperience.overnightPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-600">
                          <span className="flex items-center gap-1.5">
                            <Waves size={11} />
                            Pool Access
                          </span>
                          <span className="font-bold">FREE</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between border-t border-purple-200 pt-2 font-bold text-purple-800">
                          <span>Bundle Total</span>
                          <span>{formatPrice(echoExperience.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard add-on grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {standardAddOns.map((addon) => {
                      const meta = ADDON_META[addon.id];
                      const sel = bookingState.room.addOns.includes(addon.id);
                      const addonEmojis: Record<string, string> = {
                        breakfast: "🍳",
                        grill: "🔥",
                        towel: "🛁",
                      };
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => onToggleRoomAddOn(addon.id)}
                          className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 ${
                            sel
                              ? "border-[#080f1e] bg-[#080f1e]"
                              : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                        >
                          <span className="mb-2 text-xl">
                            {addonEmojis[addon.id]}
                          </span>
                          <p
                            className={`text-[11px] font-semibold leading-tight ${sel ? "text-white" : "text-gray-800"}`}
                          >
                            {meta.label}
                          </p>
                          <p
                            className={`mt-1.5 text-[10px] font-bold ${sel ? "text-orange-300" : "text-orange-500"}`}
                          >
                            {addon.id === "grill"
                              ? "₱800+"
                              : formatPrice(addon.price)}
                          </p>
                          <div
                            className={`absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              sel
                                ? "border-orange-400 bg-orange-400"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {sel && (
                              <svg
                                viewBox="0 0 10 10"
                                className="h-2.5 w-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  d="M2 5l2.5 2.5L8 3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Extension rates */}
                  {currentExtensionRates && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                          Extend Your Stay
                        </p>
                        <span className="text-[10px] text-gray-400">
                          Subject to availability
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {([1, 2] as const).map((hrs) => {
                          const sel = extensionHours === hrs;
                          return (
                            <button
                              key={hrs}
                              type="button"
                              onClick={() =>
                                setExtensionHours(sel ? null : hrs)
                              }
                              className={`relative flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                                sel
                                  ? "border-[#080f1e] bg-[#080f1e]"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              {hrs === 2 && (
                                <span
                                  className={`absolute right-2 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                    sel
                                      ? "bg-white/20 text-white"
                                      : "bg-orange-50 text-orange-500"
                                  }`}
                                >
                                  Best Value
                                </span>
                              )}
                              <p
                                className={`text-xs font-semibold ${sel ? "text-white/70" : "text-gray-600"}`}
                              >
                                +{hrs} Hour{hrs > 1 ? "s" : ""}
                              </p>
                              <p
                                className={`mt-0.5 text-base font-bold ${sel ? "text-orange-300" : "text-orange-500"}`}
                              >
                                {formatPrice(currentExtensionRates[hrs])}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Free entrance info */}
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Users size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Free entrance for all room guests
                      </p>
                      <p className="text-xs text-gray-500">
                        Enjoy the resort and all facilities during your stay.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────
                EVENT PACKAGE
            ───────────────────────────────────────────── */}
            {bookingState.activeType === "event" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-2xl bg-white p-5 shadow-2xl space-y-5"
              >
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
                    Your Package
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Choose your event package
                  </h3>
                </div>
                <div className="space-y-2">
                  {eventPackages.map((pkg) => {
                    const sel = bookingState.event.selectedPackage === pkg.name;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => onSelectPackage(pkg.name)}
                        className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                          sel
                            ? "border-[#080f1e] bg-[#080f1e]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`font-semibold text-sm ${sel ? "text-white" : "text-gray-900"}`}
                            >
                              {pkg.name}
                            </p>
                            <p
                              className={`mt-0.5 text-xs ${sel ? "text-white/55" : "text-gray-500"}`}
                            >
                              {pkg.subtitle}
                            </p>
                          </div>
                          <p
                            className={`shrink-0 text-lg font-bold ${sel ? "text-orange-300" : "text-orange-500"}`}
                          >
                            {formatPrice(pkg.price)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
                    Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar
                          size={13}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="date"
                          value={bookingState.event.date}
                          onChange={(e) => onSetEventDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 pr-3 text-sm focus:border-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Expected Guests
                      </label>
                      <div className="flex h-12 items-center justify-between gap-1 rounded-xl border border-gray-200 px-2">
                        <button
                          type="button"
                          onClick={() =>
                            onSetEventGuests(bookingState.event.guests - 1)
                          }
                          className={ctrBtn}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-sm font-semibold text-gray-900">
                          {bookingState.event.guests}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onSetEventGuests(bookingState.event.guests + 1)
                          }
                          className={ctrBtn}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────
                ENTRANCE
            ───────────────────────────────────────────── */}
            {bookingState.activeType === "entrance" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-2xl bg-white p-5 shadow-2xl space-y-5"
              >
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
                    Schedule
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Choose your entrance slot
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {entranceOptions.map((opt) => {
                    const sel = bookingState.entrance.entranceTime === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSetEntranceTime(opt.id)}
                        className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                          sel
                            ? "border-[#080f1e] bg-[#080f1e]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p
                            className={`font-semibold text-sm ${sel ? "text-white" : "text-gray-900"}`}
                          >
                            {opt.label}
                          </p>
                          <span className="text-base">
                            {opt.id === "day" ? "☀️" : "🌙"}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${sel ? "text-white/55" : "text-gray-500"}`}
                        >
                          {opt.schedule}
                        </p>
                        <p
                          className={`mt-2 text-[11px] ${sel ? "text-white/65" : "text-gray-600"}`}
                        >
                          Adults {formatPrice(opt.adultPrice)} · Kids{" "}
                          {formatPrice(opt.kidPrice)}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Visit Date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={13}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={bookingState.entrance.date}
                      onChange={(e) => onSetEntranceDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-8 pr-3 text-sm focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Guest Count
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["adults", "kids"] as const).map((field) => (
                      <div
                        key={field}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
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
                            className={ctrBtn}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-2xl font-bold text-gray-900">
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
                            className={ctrBtn}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Booking notes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <Info size={13} className="mt-0.5 shrink-0 text-white/30" />
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                    Booking Notes
                  </p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-white/40">
                    <li>• Free entrance for all room guests</li>
                    <li>• 50% down payment required for peak dates</li>
                    <li>• Extra guest charges apply beyond capacity</li>
                    <li>• Day 9AM–5PM · Night 7PM–7AM · 22 Hours</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Desktop sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="hidden xl:block space-y-4"
          >
            <div className="sticky top-24 space-y-3">
              {/* Echo sidebar card */}
              {bookingState.activeType === "room" && (
                <button
                  type="button"
                  onClick={scrollToEcho}
                  className="w-full text-left"
                >
                  <div
                    className={`rounded-2xl p-[1.5px] transition-all duration-300 ${
                      echoMode
                        ? "bg-linear-to-r from-purple-400 via-indigo-400 to-sky-400"
                        : "bg-linear-to-r from-purple-600/60 via-indigo-500/60 to-sky-500/60 hover:from-purple-500 hover:via-indigo-400 hover:to-sky-400"
                    }`}
                  >
                    <div className="rounded-2xl bg-[#0c1628] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <EchoLogo className="h-7 w-7 shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400/65">
                            Featured
                          </p>
                          <p className={`text-sm font-bold ${echoTitleCls}`}>
                            Echo Rooms
                          </p>
                        </div>
                        {echoMode && (
                          <CircleCheck
                            size={14}
                            className="ml-auto shrink-0 text-purple-400"
                          />
                        )}
                      </div>
                      <p className="mb-3 text-xs text-white/40">
                        Private karaoke + overnight stay. Sing. Stay. Repeat.
                      </p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-sky-400">
                        <Mic size={11} />
                        {echoMode ? "Experience reserved" : "View experience"}
                        <ChevronRight size={11} className="ml-auto" />
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Quick Reference */}
              <div className="rounded-2xl border border-white/8 bg-white/5 p-5 backdrop-blur-sm">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Quick Reference
                </p>
                <h4 className="mb-4 text-sm font-semibold text-white">
                  Entrance Rates
                </h4>
                <div className="space-y-3">
                  {entranceOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="rounded-xl border border-white/8 bg-white/4 p-4"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                          {opt.label}
                        </p>
                        <span className="text-base">
                          {opt.id === "day" ? "☀️" : "🌙"}
                        </span>
                      </div>
                      <p className="mb-3 text-xs text-white/40">
                        {opt.schedule}
                      </p>
                      <div className="flex gap-5">
                        <div>
                          <p className="text-[10px] text-white/30">Adults</p>
                          <p className="font-semibold text-white">
                            {formatPrice(opt.adultPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/30">Kids</p>
                          <p className="font-semibold text-white">
                            {formatPrice(opt.kidPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Shield size={13} className="text-white/30" />
                  <p className="text-xs font-semibold text-white">
                    Secure Booking
                  </p>
                </div>
                <p className="text-xs text-white/40">
                  Your data is safe with us.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[#080f1e]/96 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 xl:max-w-5xl">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/35">
              {echoMode ? "Echo Experience" : "Total Estimate"}
            </p>
            <p className="text-2xl font-bold leading-none text-white">
              {formatPrice(displayTotal)}
            </p>
            {echoMode ? (
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-purple-400">
                <Mic size={10} />
                Karaoke + Overnight bundle
              </p>
            ) : (
              <button
                type="button"
                className="mt-0.5 flex items-center gap-1 text-xs font-medium text-orange-400"
              >
                View details
                <ChevronDown size={11} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => void onSubmitBooking()}
            disabled={submissionState.status === "submitting"}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
              echoMode
                ? "bg-linear-to-r from-purple-600 to-indigo-600 shadow-purple-700/25 hover:shadow-purple-600/30"
                : "bg-linear-to-r from-orange-500 to-orange-400 shadow-orange-500/20 hover:shadow-orange-500/30"
            }`}
          >
            {submissionState.status === "submitting" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : echoMode ? (
              <>
                Book Echo Experience
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                Proceed to Booking
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
