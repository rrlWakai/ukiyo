import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, Minus, Plus, Info, Check, CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import {
  addOns,
  calculateEntranceTotal,
  calculateEventTotal,
  calculateRoomTotal,
  entranceOptions,
  eventPackages,
  formatPrice,
  getRoomByName,
  rooms,
  stayTypeOptions,
  type AddOnId,
  type BookingState,
  type BookingSubmissionState,
  type BookingType,
  type EntranceTime,
  type StayType,
} from '@/lib/resort-data'

const bookingTypes: Array<{ id: BookingType; label: string }> = [
  { id: 'room', label: 'Room Stay' },
  { id: 'event', label: 'Event Package' },
  { id: 'entrance', label: 'Entrance' },
]

type BookingProps = {
  bookingState: BookingState
  submissionState: BookingSubmissionState
  onSelectBookingType: (type: BookingType) => void
  onSelectRoom: (roomName: string) => void
  onSelectPackage: (packageName: string) => void
  onSetRoomDate: (date: string) => void
  onSetEventDate: (date: string) => void
  onSetEntranceDate: (date: string) => void
  onSetRoomGuests: (guests: number) => void
  onSetEventGuests: (guests: number) => void
  onSetRoomStayType: (stayType: StayType) => void
  onToggleRoomAddOn: (addOn: AddOnId) => void
  onSetEntranceTime: (time: EntranceTime) => void
  onSetEntranceGuests: (field: 'adults' | 'kids', value: number) => void
  onSubmitBooking: () => void
}

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
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const selectedRoom = getRoomByName(bookingState.room.selectedRoom)
  const roomTotal = calculateRoomTotal(bookingState.room)
  const eventTotal = calculateEventTotal(bookingState.event)
  const entranceTotal = calculateEntranceTotal(bookingState.entrance)
  const total =
    bookingState.activeType === 'event'
      ? eventTotal
      : bookingState.activeType === 'entrance'
        ? entranceTotal
        : roomTotal

  return (
    <section id="booking" className="relative py-24 lg:py-32">
      <div className="absolute inset-0">
        <img src="/images/gallery-1.jpg" alt="Ukiyo pool view" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08162d]/90 via-[#102646]/88 to-[#08162d]/92" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">Reserve Your Stay</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-medium text-balance">
            Book Now
          </h2>
          <p className="mt-4 text-primary-foreground/70">
            Secure your perfect getaway in just a few simple steps.
          </p>
        </motion.div>

        {submissionState.status !== 'idle' && (
          <div
            className={`mb-8 flex items-start gap-3 border p-4 ${
              submissionState.status === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : submissionState.status === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : 'border-primary-foreground/20 bg-primary-foreground/10 text-white'
            }`}
          >
            {submissionState.status === 'success' && <CircleCheck size={20} className="mt-0.5 flex-shrink-0" />}
            {submissionState.status === 'error' && <CircleAlert size={20} className="mt-0.5 flex-shrink-0" />}
            {submissionState.status === 'submitting' && <LoaderCircle size={20} className="mt-0.5 animate-spin flex-shrink-0" />}
            <div>
              <p className="font-semibold uppercase tracking-wide text-sm">
                {submissionState.status === 'success'
                  ? 'Reservation Sent'
                  : submissionState.status === 'error'
                    ? 'Reservation Error'
                    : 'Submitting Reservation'}
              </p>
              <p className="mt-1 text-sm">{submissionState.message}</p>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-primary-foreground/10 border border-primary-foreground/20 p-6 mb-8 backdrop-blur-sm"
        >
          <h3 className="text-primary-foreground font-semibold uppercase tracking-wide text-sm mb-4">Entrance Rates</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {entranceOptions.map((option) => (
              <div key={option.id} className="border border-primary-foreground/15 p-4">
                <p className="text-primary-foreground text-sm font-semibold uppercase tracking-wide">{option.label}</p>
                <p className="mt-1 text-primary-foreground/70 text-xs uppercase">{option.schedule}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-primary-foreground/70">Adults</p>
                    <p className="text-primary-foreground font-bold">{formatPrice(option.adultPrice)}</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Kids</p>
                    <p className="text-primary-foreground font-bold">{formatPrice(option.kidPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border p-6 md:p-10"
        >
          <div className="flex flex-wrap gap-2 mb-8">
            {bookingTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onSelectBookingType(type.id)}
                className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors border ${
                  bookingState.activeType === type.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void onSubmitBooking()
            }}
          >
            {bookingState.activeType === 'room' && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Room Type</label>
                    <select
                      value={bookingState.room.selectedRoom}
                      onChange={(event) => onSelectRoom(event.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                    >
                      {rooms.map((room) => (
                        <option key={room.slug} value={room.name}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={bookingState.room.date}
                        onChange={(event) => onSetRoomDate(event.target.value)}
                        className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                      />
                      <Calendar size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Guests</label>
                    <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                      <button type="button" onClick={() => onSetRoomGuests(bookingState.room.guests - 1)} className="p-1 text-foreground transition-colors hover:bg-muted">
                        <Minus size={18} />
                      </button>
                      <span className="font-medium text-foreground">
                        {bookingState.room.guests} / {selectedRoom.capacity} pax
                      </span>
                      <button type="button" onClick={() => onSetRoomGuests(bookingState.room.guests + 1)} className="p-1 text-foreground transition-colors hover:bg-muted">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Stay Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {stayTypeOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => onSetRoomStayType(option.id)}
                          className={`border px-3 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                            bookingState.room.stayType === option.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-foreground hover:border-primary'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border border-border bg-secondary p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected Room</p>
                      <p className="mt-1 font-serif text-2xl text-foreground">{selectedRoom.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Starting Price</p>
                      <p className="mt-1 font-serif text-2xl text-accent">{formatPrice(selectedRoom.rates[bookingState.room.stayType])}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-primary">
                    <Check size={16} />
                    Free entrance included
                  </p>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Add-ons</h4>
                  <div className="grid gap-3 md:grid-cols-4">
                    {addOns.map((addon) => (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => onToggleRoomAddOn(addon.id)}
                        className={`border px-4 py-3 text-left text-sm transition-colors ${
                          bookingState.room.addOns.includes(addon.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        }`}
                      >
                        <span className="block font-medium">{addon.name}</span>
                        <span className={`text-xs ${bookingState.room.addOns.includes(addon.id) ? 'opacity-80' : 'text-accent'}`}>
                          {addon.id === 'grill' ? '₱800-₱1,200' : `${formatPrice(addon.price)}${addon.id === 'extension' ? '/hr' : ''}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {bookingState.activeType === 'event' && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Event Package</label>
                  <div className="grid gap-3">
                    {eventPackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => onSelectPackage(pkg.name)}
                        className={`border p-4 text-left transition-colors ${
                          bookingState.event.selectedPackage === pkg.name
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:border-primary'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold uppercase tracking-wide">{pkg.name}</p>
                            <p className={`mt-1 text-sm ${bookingState.event.selectedPackage === pkg.name ? 'opacity-80' : 'text-muted-foreground'}`}>
                              {pkg.pax}
                            </p>
                          </div>
                          <span className="font-serif text-xl">{formatPrice(pkg.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={bookingState.event.date}
                        onChange={(event) => onSetEventDate(event.target.value)}
                        className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                      />
                      <Calendar size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Expected Guests</label>
                    <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                      <button type="button" onClick={() => onSetEventGuests(bookingState.event.guests - 1)} className="p-1 text-foreground transition-colors hover:bg-muted">
                        <Minus size={18} />
                      </button>
                      <span className="font-medium text-foreground">{bookingState.event.guests} guests</span>
                      <button type="button" onClick={() => onSetEventGuests(bookingState.event.guests + 1)} className="p-1 text-foreground transition-colors hover:bg-muted">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="border border-border bg-secondary p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Package Total</p>
                    <p className="mt-2 font-serif text-3xl text-accent">{formatPrice(eventTotal)}</p>
                    <p className="mt-3 text-sm text-muted-foreground">Event totals are isolated from room add-ons and based only on the selected package.</p>
                  </div>
                </div>
              </div>
            )}

            {bookingState.activeType === 'entrance' && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Time Selector</label>
                  <div className="grid grid-cols-2 gap-2">
                    {entranceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onSetEntranceTime(option.id)}
                        className={`border px-4 py-4 text-left transition-colors ${
                          bookingState.entrance.entranceTime === option.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        }`}
                      >
                        <span className="block font-semibold uppercase tracking-wide">{option.label}</span>
                        <span className={`text-sm ${bookingState.entrance.entranceTime === option.id ? 'opacity-80' : 'text-muted-foreground'}`}>
                          {option.schedule}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Visit Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={bookingState.entrance.date}
                      onChange={(event) => onSetEntranceDate(event.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none"
                    />
                    <Calendar size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="border border-border p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Adults</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button type="button" onClick={() => onSetEntranceGuests('adults', bookingState.entrance.adults - 1)} className="border border-border p-2 hover:border-primary">
                      <Minus size={18} />
                    </button>
                    <span className="font-serif text-3xl text-foreground">{bookingState.entrance.adults}</span>
                    <button type="button" onClick={() => onSetEntranceGuests('adults', bookingState.entrance.adults + 1)} className="border border-border p-2 hover:border-primary">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="border border-border p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Kids</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button type="button" onClick={() => onSetEntranceGuests('kids', bookingState.entrance.kids - 1)} className="border border-border p-2 hover:border-primary">
                      <Minus size={18} />
                    </button>
                    <span className="font-serif text-3xl text-foreground">{bookingState.entrance.kids}</span>
                    <button type="button" onClick={() => onSetEntranceGuests('kids', bookingState.entrance.kids + 1)} className="border border-border p-2 hover:border-primary">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {bookingState.activeType === 'entrance' ? 'Total Entrance Fee' : 'Estimated Total'}
                </p>
                <p className="font-serif text-3xl font-bold text-accent">{formatPrice(total)}</p>
              </div>
              <button
                type="submit"
                disabled={submissionState.status === 'submitting'}
                className="w-full bg-accent px-12 py-4 font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
              >
                {submissionState.status === 'submitting' ? 'Sending...' : 'Reserve Now'}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-primary-foreground/5 border border-primary-foreground/20 p-6"
        >
          <div className="flex items-start gap-3">
            <Info size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-primary-foreground font-semibold text-sm uppercase tracking-wide mb-3">Booking Notes</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>Free entrance for all room guests</li>
                <li>50% downpayment required for peak dates</li>
                <li>Extra guest charges apply beyond room capacity</li>
                <li>Stay options are Day (9AM-5PM), Night (7PM-7AM), and 22 Hours</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
