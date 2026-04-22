import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Coffee,
  Flame,
  Info,
  LoaderCircle,
  Mic,
  Minus,
  Moon,
  PartyPopper,
  Plus,
  Shield,
  Shirt,
  Sun,
  Ticket,
  Timer,
  Users,
  Waves,
  X,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
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

// ─── static config ────────────────────────────────────────────────────────────

const bookingTypes: Array<{ id: BookingType; label: string; Icon: LucideIcon }> = [
  { id: "room",     label: "Room Stay",      Icon: BedDouble    },
  { id: "event",    label: "Event Package",  Icon: PartyPopper  },
  { id: "entrance", label: "Entrance",       Icon: Ticket       },
];

const ADDON_CONFIG: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  breakfast: { label: "Breakfast",  Icon: Coffee, color: "amber"  },
  grill:     { label: "Grill",      Icon: Flame,  color: "orange" },
  towel:     { label: "Towel",      Icon: Shirt,  color: "sky"    },
};

const STAY_ICON: Record<string, LucideIcon> = {
  day:    Sun,
  night:  Moon,
  "22hrs": Timer,
};

const STANDARD_ADDON_ORDER: AddOnId[] = ["breakfast", "grill", "towel"];

// ─── types ────────────────────────────────────────────────────────────────────

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

// ─── sub-components ───────────────────────────────────────────────────────────

function EchoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polyline points="2,28 32,5 62,28" stroke="url(#eg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8"  y1="28" x2="8"  y2="57" stroke="url(#eg)" strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="28" x2="56" y2="57" stroke="url(#eg)" strokeWidth="3" strokeLinecap="round" />
      <line x1="8"  y1="57" x2="56" y2="57" stroke="url(#eg)" strokeWidth="3" strokeLinecap="round" />
      <rect x="15" y="36" width="6"  height="16" rx="2" fill="url(#eg)" opacity="0.8"  />
      <rect x="23" y="29" width="6"  height="23" rx="2" fill="url(#eg)" />
      <rect x="31" y="40" width="6"  height="12" rx="2" fill="url(#eg)" opacity="0.65" />
      <rect x="39" y="32" width="6"  height="20" rx="2" fill="url(#eg)" opacity="0.9"  />
      <rect x="47" y="37" width="5"  height="15" rx="2" fill="url(#eg)" opacity="0.75" />
      <defs>
        <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#38bdf8" />
          <stop offset="45%"  stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FieldLabel({ Icon, children }: { Icon: LucideIcon; children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
      <Icon size={10} strokeWidth={2.5} />
      {children}
    </p>
  );
}

// ─── shared styles ────────────────────────────────────────────────────────────

const ctrBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-150 hover:border-gray-300 active:scale-95";

const echoTitleCls =
  "bg-linear-to-br from-sky-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-3 text-sm text-gray-900 transition-colors focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100";

// ─── main component ───────────────────────────────────────────────────────────

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
  const ref                                        = useRef<HTMLDivElement>(null);
  const isInView                                   = useInView(ref, { once: true, margin: "-60px" });
  const [searchParams]                             = useSearchParams();
  const echoRef                                    = useRef<HTMLDivElement>(null);
  const [echoMode, setEchoMode]                    = useState(() => sessionStorage.getItem("echo-mode") === "1");
  const [echoHighlight, setEchoHighlight]          = useState(false);
  const [extensionHours, setExtensionHours]        = useState<ExtensionHours | null>(null);
  const [roomDropdownOpen, setRoomDropdownOpen]    = useState(false);

  const selectedRoom         = getRoomByName(bookingState.room.selectedRoom);
  const currentExtRates      = extensionRates[selectedRoom.slug];
  const extensionPrice       = extensionHours ? getExtensionPrice(selectedRoom.slug, extensionHours) : 0;
  const roomTotal            = calculateRoomTotal(bookingState.room) + extensionPrice;
  const eventTotal           = calculateEventTotal(bookingState.event);
  const entranceTotal        = calculateEntranceTotal(bookingState.entrance);
  const baseTotal            =
    bookingState.activeType === "event"    ? eventTotal    :
    bookingState.activeType === "entrance" ? entranceTotal : roomTotal;
  const displayTotal         =
    echoMode && bookingState.activeType === "room" ? echoExperience.totalPrice : baseTotal;
  const standardAddOns       = STANDARD_ADDON_ORDER.map((id) => addOns.find((a) => a.id === id)!).filter(Boolean);

  const triggerEchoHighlight = () => { setEchoHighlight(true); setTimeout(() => setEchoHighlight(false), 3000); };
  const scrollToEcho         = () => { echoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); triggerEchoHighlight(); };

  const reserveEchoExperience = () => {
    onSelectBookingType("room");
    onSelectRoom(echoExperience.compatibleRoom);
    onSetRoomStayType("22hrs");
    onSetRoomGuests(echoExperience.defaultGuests);
    sessionStorage.setItem("echo-mode", "1");
    setEchoMode(true);
  };

  const cancelEchoMode = () => { sessionStorage.removeItem("echo-mode"); setEchoMode(false); };

  useEffect(() => {
    if (searchParams.get("promo") === "echo") {
      const t = setTimeout(scrollToEcho, 700);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!roomDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-room-dropdown]")) setRoomDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [roomDropdownOpen]);

  // ── season badge helper ──
  const SeasonBadge = () => {
    if (!bookingState.room.date) return null;
    const season = getSeasonFromDate(bookingState.room.date);
    const rate   = selectedRoom.rates[bookingState.room.stayType][season];
    const cfg    = season === "peak"    ? { label: "Peak Season", cls: "bg-red-50 text-red-500"     } :
                   season === "weekend" ? { label: "Weekend Rate", cls: "bg-amber-50 text-amber-600" } :
                                         { label: "Weekday Rate",  cls: "bg-emerald-50 text-emerald-600" };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
        {cfg.label} · {formatPrice(rate)} base
      </span>
    );
  };

  return (
    <section id="booking" className="relative min-h-screen overflow-hidden bg-[#080f1e] pb-32">

      {/* Ambient texture */}
      <div className="pointer-events-none absolute inset-0">
        <img src="/images/gallery-1.jpg" alt="" className="h-full w-full object-cover opacity-[0.04]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#080f1e]/98 via-[#0a1220]/95 to-[#080f1e]" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 xl:max-w-5xl xl:px-8">

        {/* ── Page header ── */}
        <div className="pt-8 pb-6">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-orange-500/70">
            Reservations
          </p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Make a Reservation
          </h2>
          <p className="mt-1.5 text-sm text-white/40">
            Complete your booking details — we'll confirm via WhatsApp.
          </p>
        </div>

        {/* ── Submission banner ── */}
        {submissionState.status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 rounded-2xl border p-4 ${
              submissionState.status === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
              submissionState.status === "error"   ? "border-rose-500/30 bg-rose-500/10 text-rose-300"         :
                                                     "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            <div className="flex items-start gap-3">
              {submissionState.status === "success"    && <CircleCheck   size={15} className="mt-0.5 shrink-0" />}
              {submissionState.status === "error"      && <CircleAlert   size={15} className="mt-0.5 shrink-0" />}
              {submissionState.status === "submitting" && <LoaderCircle  size={15} className="mt-0.5 shrink-0 animate-spin" />}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  {submissionState.status === "success" ? "Reservation Sent" :
                   submissionState.status === "error"   ? "Reservation Error" : "Submitting…"}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed">{submissionState.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={ref} className="xl:grid xl:grid-cols-[1fr_300px] xl:gap-8">

          {/* ══════════════════════════════════════════════
              LEFT COLUMN
          ══════════════════════════════════════════════ */}
          <div className="space-y-3">

            {/* ── Booking type tabs + Echo trigger ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">

                {/* Tab switcher */}
                <div className="flex flex-1 gap-1 rounded-2xl border border-white/8 bg-white/5 p-1.5 backdrop-blur-md">
                  {bookingTypes.map(({ id, label, Icon }) => {
                    const active = bookingState.activeType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelectBookingType(id)}
                        className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                          active ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "text-white/45 hover:text-white/75"
                        }`}
                      >
                        <Icon size={12} strokeWidth={2.5} />
                        {label}
                      </button>
                    );
                  })}
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
                  <Mic size={13} className={`shrink-0 ${echoMode ? "text-purple-300" : "text-purple-400"}`} />
                  <span className="whitespace-nowrap">Echo Rooms</span>
                  <span className="rounded-full bg-purple-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">NEW</span>
                  <ChevronRight size={12} className="shrink-0 text-purple-400/50 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>

            {/* ══════════════════════════════════════════
                ROOM STAY
            ══════════════════════════════════════════ */}
            {bookingState.activeType === "room" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="space-y-3"
              >
                {/* Main form card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/10">

                  {/* Card header */}
                  <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <BedDouble size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500">Your Stay</p>
                      <h3 className="text-sm font-semibold text-gray-900">Room &amp; Schedule</h3>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">

                    {/* Room selector */}
                    <div>
                      <FieldLabel Icon={BedDouble}>Room Type</FieldLabel>
                      <div className="relative" data-room-dropdown>
                        <button
                          type="button"
                          onClick={() => setRoomDropdownOpen((v) => !v)}
                          className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-gray-300 focus:outline-none"
                        >
                          <img src={selectedRoom.image} alt={selectedRoom.name} className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{selectedRoom.name}</p>
                            {selectedRoom.badge && (
                              <p className="truncate text-[10px] text-orange-500">{selectedRoom.badge}</p>
                            )}
                          </div>
                          <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform duration-200 ${roomDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {roomDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                            {rooms.map((room) => {
                              const active = bookingState.room.selectedRoom === room.name;
                              return (
                                <button
                                  key={room.slug}
                                  type="button"
                                  onClick={() => { onSelectRoom(room.name); setRoomDropdownOpen(false); if (echoMode) cancelEchoMode(); }}
                                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50 ${active ? "bg-orange-50" : ""}`}
                                >
                                  <img src={room.image} alt={room.name} className="h-9 w-12 shrink-0 rounded-lg object-cover" />
                                  <div className="min-w-0 flex-1">
                                    <p className={`truncate text-sm font-medium ${active ? "text-orange-600" : "text-gray-900"}`}>{room.name}</p>
                                    <p className="truncate text-[10px] text-gray-400">{room.subtitle}</p>
                                  </div>
                                  {active && <Check size={14} className="shrink-0 text-orange-500" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date + Guests */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel Icon={Calendar}>Preferred Date</FieldLabel>
                        <div className="relative">
                          <Calendar size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            value={bookingState.room.date}
                            onChange={(e) => onSetRoomDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        {bookingState.room.date && (
                          <div className="mt-1.5">
                            <SeasonBadge />
                          </div>
                        )}
                      </div>

                      <div>
                        <FieldLabel Icon={Users}>Guests</FieldLabel>
                        <div className="flex h-12 items-center justify-between gap-1 rounded-xl border border-gray-200 bg-white px-2">
                          <button type="button" onClick={() => onSetRoomGuests(bookingState.room.guests - 1)} className={ctrBtn}>
                            <Minus size={13} />
                          </button>
                          <div className="text-center">
                            <span className="text-base font-bold text-gray-900">{bookingState.room.guests}</span>
                            <span className="text-gray-300"> / </span>
                            <span className="text-sm text-gray-400">{selectedRoom.maxPax ?? selectedRoom.capacity}</span>
                          </div>
                          <button type="button" onClick={() => onSetRoomGuests(bookingState.room.guests + 1)} className={ctrBtn}>
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stay type */}
                    <div>
                      <FieldLabel Icon={Clock}>Stay Type</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {stayTypeOptions.map((opt) => {
                          const active  = bookingState.room.stayType === opt.id;
                          const StayIcon = STAY_ICON[opt.id] ?? Clock;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onSetRoomStayType(opt.id)}
                              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3.5 transition-all duration-200 ${
                                active ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-500/20" : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <StayIcon size={16} className={active ? "text-white" : "text-gray-400"} />
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-white" : "text-gray-700"}`}>
                                {opt.label}
                              </span>
                              <span className={`text-[10px] ${active ? "text-white/65" : "text-gray-400"}`}>
                                {opt.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Echo Rooms featured card ── */}
                <div
                  ref={echoRef}
                  className={`transition-all duration-500 ${echoHighlight && !echoMode ? "scale-[1.015]" : ""}`}
                >
                  <div className={`relative overflow-hidden rounded-2xl transition-all duration-400 ${
                    echoMode      ? "ring-2 ring-purple-400/70 shadow-xl shadow-purple-900/40" :
                    echoHighlight ? "ring-2 ring-sky-400/50 shadow-lg shadow-sky-900/30"       : ""
                  }`}>
                    <div className="relative bg-linear-to-br from-[#1a053a] via-[#180f60] to-[#0c1a2e] p-6">
                      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-600/18 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-sky-500/12 blur-3xl" />

                      <div className="relative mb-5 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <EchoLogo className="h-11 w-11 shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-purple-400/70">Featured Experience</p>
                            <h3 className={`text-2xl font-black leading-none tracking-tight ${echoTitleCls}`}>Echo Rooms</h3>
                          </div>
                        </div>
                        {echoMode && (
                          <button
                            type="button"
                            onClick={cancelEchoMode}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/6 px-2 py-1.5 text-[10px] font-medium text-white/45 transition-colors hover:bg-white/10 hover:text-white/70"
                          >
                            <X size={11} /> Cancel
                          </button>
                        )}
                      </div>

                      <p className="relative mb-6 text-3xl font-black leading-tight tracking-tight text-white">
                        Sing.<br />Stay.<br /><span className={echoTitleCls}>Repeat.</span>
                      </p>

                      <div className="relative mb-5 grid grid-cols-[1fr_36px_1fr] items-center gap-2">
                        <div className="rounded-xl border border-sky-400/20 bg-white/5 p-4 backdrop-blur-sm">
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-400/15">
                              <Mic size={14} className="text-sky-400" />
                            </div>
                            <p className="text-[10px] font-bold uppercase leading-tight tracking-widest text-white">Private Karaoke</p>
                          </div>
                          <p className="mb-3 text-xs text-white/45">For {echoExperience.karaokePax}</p>
                          <p className="text-[10px] text-white/35">Starting at</p>
                          <p className="text-2xl font-black text-white">₱{echoExperience.karaokePrice.toLocaleString()}</p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6">
                          <Plus size={15} className="text-white/40" />
                        </div>

                        <div className="rounded-xl border border-purple-400/20 bg-white/5 p-4 backdrop-blur-sm">
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-400/15">
                              <BedDouble size={14} className="text-purple-400" />
                            </div>
                            <p className="text-[10px] font-bold uppercase leading-tight tracking-widest text-white">Overnight</p>
                          </div>
                          <p className="mb-3 text-xs text-white/45">{echoExperience.overnightDescription}</p>
                          <p className="text-2xl font-black text-white">₱{echoExperience.overnightPrice.toLocaleString()}</p>
                          <p className="text-[10px] text-purple-300/50">Overnight Stay</p>
                        </div>
                      </div>

                      <div className="relative mb-5 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 backdrop-blur-sm">
                        <Flame size={18} className="shrink-0 text-amber-400" />
                        <div className="flex-1">
                          <p className="text-sm font-bold uppercase tracking-widest text-amber-300">Free Pool Access</p>
                          <p className="text-xs text-white/45">{echoExperience.promoExpiry} · Day use included</p>
                        </div>
                        <Waves size={18} className="shrink-0 text-sky-400/40" />
                      </div>

                      <button
                        type="button"
                        onClick={reserveEchoExperience}
                        className={`relative w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 ${
                          echoMode
                            ? "bg-linear-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-700/30"
                            : "bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-600/25"
                        }`}
                      >
                        {echoMode ? (
                          <span className="flex items-center justify-center gap-2">
                            <CircleCheck size={15} /> Echo Experience Selected · {formatPrice(echoExperience.totalPrice)}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Reserve Echo Experience <ArrowRight size={15} />
                          </span>
                        )}
                      </button>
                      <p className="mt-2.5 text-center text-[10px] text-white/30">Limited slots daily · Now open at the resort</p>
                    </div>
                  </div>
                </div>

                {/* ── Add-ons card ── */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/10">

                  <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <Plus size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500">Optional</p>
                      <h3 className="text-sm font-semibold text-gray-900">Add-ons &amp; Extras</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">

                    {/* Echo mode summary */}
                    {echoMode && (
                      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-700">
                          <Mic size={11} /> Echo Experience Included
                        </p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-purple-700">
                            <span className="flex items-center gap-1.5"><Mic size={11} className="text-purple-400" /> Karaoke Room (6–12 pax)</span>
                            <span className="font-bold">{formatPrice(echoExperience.karaokePrice)}</span>
                          </div>
                          <div className="flex items-center justify-between text-purple-700">
                            <span className="flex items-center gap-1.5"><BedDouble size={11} className="text-purple-400" /> Overnight Stay</span>
                            <span className="font-bold">{formatPrice(echoExperience.overnightPrice)}</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-600">
                            <span className="flex items-center gap-1.5"><Waves size={11} /> Pool Access</span>
                            <span className="font-bold">FREE</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between border-t border-purple-200 pt-2 font-bold text-purple-800">
                            <span>Bundle Total</span>
                            <span>{formatPrice(echoExperience.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Standard add-ons */}
                    <div>
                      <FieldLabel Icon={Plus}>Enhance Your Stay</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {standardAddOns.map((addon) => {
                          const cfg = ADDON_CONFIG[addon.id];
                          if (!cfg) return null;
                          const sel     = bookingState.room.addOns.includes(addon.id);
                          const AddonIcon = cfg.Icon;
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => onToggleRoomAddOn(addon.id)}
                              className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                sel ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-500/20" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                              }`}
                            >
                              <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${sel ? "bg-white/20" : "bg-white"}`}>
                                <AddonIcon size={15} className={sel ? "text-white" : "text-orange-500"} />
                              </div>
                              <p className={`text-[11px] font-semibold leading-tight ${sel ? "text-white" : "text-gray-800"}`}>
                                {cfg.label}
                              </p>
                              <p className={`mt-1 text-[10px] font-bold ${sel ? "text-white/75" : "text-orange-500"}`}>
                                {addon.id === "grill" ? "₱800+" : formatPrice(addon.price)}
                              </p>
                              <div className={`absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded border transition-all ${
                                sel ? "border-white/40 bg-white/20" : "border-gray-300 bg-white"
                              }`}>
                                {sel && <Check size={10} className="text-white" strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Extension */}
                    {currentExtRates && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <FieldLabel Icon={Timer}>Extend Your Stay</FieldLabel>
                          <span className="text-[10px] text-gray-400">Subject to availability</span>
                        </div>
                        <div className="flex gap-2">
                          {([1, 2] as const).map((hrs) => {
                            const sel = extensionHours === hrs;
                            return (
                              <button
                                key={hrs}
                                type="button"
                                onClick={() => setExtensionHours(sel ? null : hrs)}
                                className={`relative flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                                  sel ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-500/20" : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                {hrs === 2 && (
                                  <span className={`absolute right-2 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                    sel ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500"
                                  }`}>Best Value</span>
                                )}
                                <p className={`text-xs font-semibold ${sel ? "text-white/80" : "text-gray-600"}`}>+{hrs} Hour{hrs > 1 ? "s" : ""}</p>
                                <p className={`mt-0.5 text-base font-bold ${sel ? "text-white" : "text-orange-500"}`}>
                                  {formatPrice(currentExtRates[hrs])}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Free entrance strip */}
                    <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                        <Users size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Free entrance for all room guests</p>
                        <p className="text-xs text-gray-500">Pool &amp; resort access included during your stay.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                EVENT PACKAGE
            ══════════════════════════════════════════ */}
            {bookingState.activeType === "event" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/10">

                  <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <PartyPopper size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500">Your Package</p>
                      <h3 className="text-sm font-semibold text-gray-900">Event &amp; Function</h3>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">

                    {/* Package selector */}
                    <div className="space-y-2">
                      <FieldLabel Icon={PartyPopper}>Choose Package</FieldLabel>
                      {eventPackages.map((pkg) => {
                        const sel = bookingState.event.selectedPackage === pkg.name;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => onSelectPackage(pkg.name)}
                            className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                              sel ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-500/15" : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-semibold text-sm ${sel ? "text-white" : "text-gray-900"}`}>{pkg.name}</p>
                                  {pkg.featured && (
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                                      sel ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
                                    }`}>Popular</span>
                                  )}
                                </div>
                                <p className={`mt-0.5 text-xs ${sel ? "text-white/65" : "text-gray-500"}`}>{pkg.subtitle}</p>
                                {sel && (
                                  <div className="mt-3 space-y-1">
                                    {pkg.features.slice(0, 3).map((f) => (
                                      <p key={f} className="flex items-center gap-1.5 text-[10px] text-white/75">
                                        <Check size={10} strokeWidth={3} className="shrink-0 text-white/50" /> {f}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <p className={`text-lg font-bold ${sel ? "text-white" : "text-orange-500"}`}>{formatPrice(pkg.price)}</p>
                                <p className={`text-[10px] ${sel ? "text-white/50" : "text-gray-400"}`}>{pkg.pax}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Date + Guests */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel Icon={Calendar}>Event Date</FieldLabel>
                        <div className="relative">
                          <Calendar size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            value={bookingState.event.date}
                            onChange={(e) => onSetEventDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <FieldLabel Icon={Users}>Expected Guests</FieldLabel>
                        <div className="flex h-12 items-center justify-between gap-1 rounded-xl border border-gray-200 px-2">
                          <button type="button" onClick={() => onSetEventGuests(bookingState.event.guests - 1)} className={ctrBtn}><Minus size={13} /></button>
                          <span className="text-base font-bold text-gray-900">{bookingState.event.guests}</span>
                          <button type="button" onClick={() => onSetEventGuests(bookingState.event.guests + 1)} className={ctrBtn}><Plus size={13} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                ENTRANCE
            ══════════════════════════════════════════ */}
            {bookingState.activeType === "entrance" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/10">

                  <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <Ticket size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500">Day / Night</p>
                      <h3 className="text-sm font-semibold text-gray-900">Entrance Schedule</h3>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">

                    {/* Time slot */}
                    <div>
                      <FieldLabel Icon={Clock}>Choose Slot</FieldLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {entranceOptions.map((opt) => {
                          const sel      = bookingState.entrance.entranceTime === opt.id;
                          const SlotIcon = opt.id === "day" ? Sun : Moon;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onSetEntranceTime(opt.id)}
                              className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                                sel ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-500/20" : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${sel ? "bg-white/20" : opt.id === "day" ? "bg-amber-50" : "bg-indigo-50"}`}>
                                  <SlotIcon size={15} className={sel ? "text-white" : opt.id === "day" ? "text-amber-500" : "text-indigo-500"} />
                                </div>
                                <p className={`font-semibold text-sm ${sel ? "text-white" : "text-gray-900"}`}>{opt.label}</p>
                              </div>
                              <p className={`mb-2 text-xs ${sel ? "text-white/65" : "text-gray-500"}`}>{opt.schedule}</p>
                              <div className={`text-[11px] ${sel ? "text-white/75" : "text-gray-600"}`}>
                                <span>Adults {formatPrice(opt.adultPrice)}</span>
                                <span className="mx-1 opacity-50">·</span>
                                <span>Kids {formatPrice(opt.kidPrice)}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <FieldLabel Icon={Calendar}>Visit Date</FieldLabel>
                      <div className="relative">
                        <Calendar size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={bookingState.entrance.date}
                          onChange={(e) => onSetEntranceDate(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Guest count */}
                    <div>
                      <FieldLabel Icon={Users}>Guest Count</FieldLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {(["adults", "kids"] as const).map((field) => (
                          <div key={field} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="mb-3 flex items-center gap-1.5">
                              {field === "adults" ? <Users size={11} className="text-gray-400" /> : <Users size={11} className="text-gray-300" />}
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                {field === "adults" ? "Adults" : "Kids"}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <button type="button" onClick={() => onSetEntranceGuests(field, bookingState.entrance[field] - 1)} className={ctrBtn}>
                                <Minus size={13} />
                              </button>
                              <span className="text-2xl font-bold text-gray-900">{bookingState.entrance[field]}</span>
                              <button type="button" onClick={() => onSetEntranceGuests(field, bookingState.entrance[field] + 1)} className={ctrBtn}>
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Booking notes ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-2xl border border-white/8 bg-white/5 px-5 py-4 backdrop-blur-sm"
            >
              <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                <Info size={11} /> Booking Notes
              </p>
              <ul className="space-y-2">
                {[
                  { Icon: Users,    text: "Free entrance included for all room guests" },
                  { Icon: Shield,   text: "50% down payment required for peak dates" },
                  { Icon: Info,     text: "Extra guest charges apply beyond room capacity" },
                  { Icon: Clock,    text: "Day 9AM–5PM · Night 7PM–7AM · 22 Hours" },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-2 text-xs leading-relaxed text-white/40">
                    <Icon size={11} className="mt-0.5 shrink-0 text-white/25" />
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════
              DESKTOP SIDEBAR
          ══════════════════════════════════════════════ */}
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="hidden xl:block"
          >
            <div className="sticky top-24 space-y-3">

              {/* Echo sidebar card */}
              {bookingState.activeType === "room" && (
                <button type="button" onClick={scrollToEcho} className="w-full text-left">
                  <div className={`rounded-2xl p-[1.5px] transition-all duration-300 ${
                    echoMode
                      ? "bg-linear-to-r from-purple-400 via-indigo-400 to-sky-400"
                      : "bg-linear-to-r from-purple-600/60 via-indigo-500/60 to-sky-500/60 hover:from-purple-500 hover:via-indigo-400 hover:to-sky-400"
                  }`}>
                    <div className="rounded-2xl bg-[#0c1628] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <EchoLogo className="h-7 w-7 shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-purple-400/65">Featured</p>
                          <p className={`text-sm font-bold ${echoTitleCls}`}>Echo Rooms</p>
                        </div>
                        {echoMode && <CircleCheck size={14} className="ml-auto shrink-0 text-purple-400" />}
                      </div>
                      <p className="mb-3 text-xs text-white/40">Private karaoke + overnight stay. Sing. Stay. Repeat.</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-sky-400">
                        <Mic size={11} />
                        {echoMode ? "Experience reserved" : "View experience"}
                        <ChevronRight size={11} className="ml-auto" />
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Entrance rate reference */}
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm">
                <div className="border-b border-white/6 px-5 py-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Quick Reference</p>
                  <h4 className="mt-0.5 text-sm font-semibold text-white">Entrance Rates</h4>
                </div>
                <div className="divide-y divide-white/6">
                  {entranceOptions.map((opt) => {
                    const SlotIcon = opt.id === "day" ? Sun : Moon;
                    return (
                      <div key={opt.id} className="px-5 py-4">
                        <div className="mb-2 flex items-center gap-2">
                          <SlotIcon size={13} className={opt.id === "day" ? "text-amber-400" : "text-indigo-400"} />
                          <p className="text-xs font-semibold text-white">{opt.label}</p>
                          <span className="ml-auto text-[10px] text-white/35">{opt.schedule}</span>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[10px] text-white/30">Adults</p>
                            <p className="text-sm font-semibold text-white">{formatPrice(opt.adultPrice)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30">Kids</p>
                            <p className="text-sm font-semibold text-white">{formatPrice(opt.kidPrice)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secure booking */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
                <Shield size={15} className="shrink-0 text-white/25" />
                <div>
                  <p className="text-xs font-semibold text-white">Secure Booking</p>
                  <p className="text-[10px] text-white/35">Confirmed directly via WhatsApp</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STICKY FOOTER
      ══════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[#080f1e]/96 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 xl:max-w-5xl">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/35">
              {echoMode ? "Echo Experience" : "Estimated Total"}
            </p>
            <p className="text-2xl font-bold leading-none text-white">{formatPrice(displayTotal)}</p>
            {echoMode ? (
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-purple-400">
                <Mic size={10} /> Karaoke + Overnight bundle
              </p>
            ) : (
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/30">
                <Info size={10} /> Estimate only — final price on confirmation
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onSubmitBooking}
            disabled={submissionState.status === "submitting"}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
              echoMode
                ? "bg-linear-to-r from-purple-600 to-indigo-600 shadow-purple-700/25 hover:shadow-purple-600/30"
                : "bg-linear-to-r from-orange-500 to-orange-400 shadow-orange-500/20 hover:shadow-orange-500/30"
            }`}
          >
            {submissionState.status === "submitting" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : echoMode ? (
              <><span>Book Echo</span><ArrowRight size={14} /></>
            ) : (
              <><span>Reserve Now</span><ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
