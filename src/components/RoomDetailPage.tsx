import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Check, ChevronLeft, Minus, Plus } from 'lucide-react'
import { GalleryModal } from './GalleryModal'
import {
  addOns,
  calculateRoomTotal,
  formatPrice,
  getRoomByName,
  rooms,
  stayTypeOptions,
  type AddOnId,
  type BookingState,
  type Room,
  type StayType,
} from '@/lib/resort-data'

type RoomDetailPageProps = {
  room: Room
  bookingState: BookingState
  onBackToRooms: () => void
  onSetRoomDate: (date: string) => void
  onSetRoomGuests: (guests: number) => void
  onSetRoomStayType: (stayType: StayType) => void
  onToggleRoomAddOn: (addOn: AddOnId) => void
  onSelectRoom: (roomName: string) => void
  onViewRoom: (slug: string) => void
  onReserveRoom: (roomName: string) => void
}

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const activeRoom = getRoomByName(room.name)
  const relatedRooms = rooms.filter((item) => item.slug !== room.slug).slice(0, 2)
  const roomBooking = bookingState.room
  const roomTotal = calculateRoomTotal(roomBooking)

  return (
    <>
      <main className="pt-28">
        <section className="px-6 pb-20 pt-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <button
              type="button"
              onClick={onBackToRooms}
              className="mb-8 inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={16} />
              Back to Rooms
            </button>

            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Ukiyo Rooms</p>
              <h1 className="mt-4 font-serif text-4xl text-foreground md:text-6xl">{room.name}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{room.subtitle}</p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="border border-border">
                <img src={room.gallery[0]} alt={room.name} className="h-full min-h-[460px] w-full object-cover" />
              </div>
              <div className="grid gap-6">
                {room.gallery.slice(1).map((image, index) => (
                  <div key={image} className="relative border border-border">
                    <img src={image} alt={`${room.name} gallery ${index + 2}`} className="h-[217px] w-full object-cover" />
                    {index === room.gallery.slice(1).length - 1 && (
                      <button
                        type="button"
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute inset-0 flex items-center justify-center bg-[#08162d]/35 transition-colors hover:bg-[#08162d]/50"
                      >
                        <div className="border border-white bg-white px-8 py-8 text-center font-semibold uppercase tracking-wide text-foreground">
                          More Photos
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_420px]">
              <div className="space-y-10">
                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
                  <h2 className="mt-3 font-serif text-3xl text-foreground">Good for {room.capacity} pax</h2>
                </div>

                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Room Features</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {room.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 border border-border px-4 py-3">
                        <Check size={16} className="text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Inclusions</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {room.inclusions.map((item) => (
                      <div key={item} className="border border-border px-4 py-4 text-sm text-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Stay Options</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {stayTypeOptions.map((option) => (
                      <div key={option.id} className="border border-border px-5 py-5">
                        <p className="font-serif text-2xl text-foreground">{option.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                        <p className="mt-4 text-lg font-semibold text-accent">{formatPrice(room.rates[option.id])}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Add-ons</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {addOns.map((addon) => (
                      <div key={addon.id} className="border border-border px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-foreground">{addon.name}</span>
                          <span className="text-accent">
                            {addon.id === 'grill' ? '₱800-₱1,200' : `${formatPrice(addon.price)}${addon.id === 'extension' ? '/hr' : ''}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-border pb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
                  <div className="mt-5 space-y-3">
                    {room.notes.map((note) => (
                      <div key={note} className="border border-border px-4 py-4 text-sm text-foreground">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="max-w-3xl text-lg leading-relaxed text-foreground">
                  <p>{room.description}</p>
                </div>
              </div>

              <aside className="lg:sticky lg:top-[100px]">
                <div className="border border-border bg-secondary p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Book Your Best Room</p>
                  <h2 className="mt-4 font-serif text-3xl text-foreground">{activeRoom.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Starting price</p>
                  <p className="mt-2 font-serif text-5xl text-accent">{formatPrice(activeRoom.rates[roomBooking.stayType])}</p>
                  <p className="mt-4 inline-flex items-center gap-2 border border-accent px-3 py-2 text-sm font-semibold text-accent">
                    <Check size={16} />
                    Free entrance included
                  </p>

                  <div className="mt-8 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-foreground">Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={roomBooking.date}
                          onChange={(event) => onSetRoomDate(event.target.value)}
                          className="w-full border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                        />
                        <Calendar size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-foreground">Guests</label>
                      <div className="flex items-center justify-between border border-border bg-white px-4 py-3">
                        <button type="button" onClick={() => onSetRoomGuests(roomBooking.guests - 1)} className="border border-border p-2 hover:border-primary">
                          <Minus size={16} />
                        </button>
                        <span className="font-medium text-foreground">{roomBooking.guests} guests</span>
                        <button type="button" onClick={() => onSetRoomGuests(roomBooking.guests + 1)} className="border border-border p-2 hover:border-primary">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-foreground">Stay Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {stayTypeOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => onSetRoomStayType(option.id)}
                            className={`border px-3 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                              roomBooking.stayType === option.id
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-white text-foreground hover:border-primary'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-foreground">Add-ons</label>
                      <div className="space-y-2">
                        {addOns.map((addon) => (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => onToggleRoomAddOn(addon.id)}
                            className={`flex w-full items-center justify-between border px-4 py-3 text-left text-sm transition-colors ${
                              roomBooking.addOns.includes(addon.id)
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-white text-foreground hover:border-primary'
                            }`}
                          >
                            <span>{addon.name}</span>
                            <span>{addon.id === 'grill' ? '₱800-₱1,200' : formatPrice(addon.price)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Estimated Total</p>
                    <p className="mt-3 font-serif text-4xl text-accent">{formatPrice(roomTotal)}</p>
                    <button
                      type="button"
                      onClick={() => onReserveRoom(room.name)}
                      className="mt-6 w-full bg-primary px-6 py-4 font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Reserve Now
                    </button>
                    <p className="mt-4 text-center text-sm text-muted-foreground">Continue to the booking page to submit your reservation.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden border border-border">
              <img src="/images/gallery-6.jpg" alt="Ukiyo testimonial" className="h-[420px] w-full object-cover" />
              <div className="absolute inset-0 bg-[#08162d]/45" />
              <div className="absolute inset-0 flex items-end justify-center p-8 text-center text-white">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/75">Guest Review</p>
                  <p className="mt-4 font-serif text-3xl leading-tight md:text-4xl">{room.testimonial}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Related Rooms</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">You Might Be Interested</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {relatedRooms.map((relatedRoom, index) => (
                <motion.div
                  key={relatedRoom.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-border bg-card"
                >
                  <img src={relatedRoom.image} alt={relatedRoom.name} className="h-[320px] w-full object-cover" />
                  <div className="p-8">
                    <h3 className="font-serif text-3xl text-foreground">{relatedRoom.name}</h3>
                    <p className="mt-3 text-muted-foreground">{relatedRoom.subtitle}</p>
                    <p className="mt-5 text-lg font-semibold text-accent">Starting from {formatPrice(relatedRoom.rates.night)}</p>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRoom(relatedRoom.name)
                        onViewRoom(relatedRoom.slug)
                      }}
                      className="mt-8 w-full border border-primary bg-secondary px-6 py-4 font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Room Detail
                    </button>
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
  )
}
