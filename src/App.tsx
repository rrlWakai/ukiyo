import { useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Packages } from './components/Packages'
import { Gallery } from './components/Gallery'
import { Accommodation } from './components/Accommodation'
import { Booking } from './components/Booking'
import { Reviews } from './components/Reviews'
import { Occasions } from './components/Occasions'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { RoomDetailPage } from './components/RoomDetailPage'
import { NotFoundPage } from './components/NotFoundPage'
import {
  buildBookingPayload,
  calculateActiveTotal,
  clampGuestsForRoom,
  defaultSubmissionState,
  getDefaultBookingState,
  getRoomByName,
  getRoomBySlug,
  type AddOnId,
  type BookingState,
  type BookingSubmissionState,
  type BookingType,
  type EntranceTime,
  type StayType,
} from './lib/resort-data'

const STORAGE_KEY = 'ukiyo-booking-state'

function getStoredBookingState() {
  const fallback = getDefaultBookingState()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<BookingState>
    return {
      activeType: parsed.activeType ?? fallback.activeType,
      room: { ...fallback.room, ...parsed.room },
      event: { ...fallback.event, ...parsed.event },
      entrance: { ...fallback.entrance, ...parsed.entrance },
    }
  } catch {
    return fallback
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function HomePage(props: {
  bookingState: BookingState
  onHeroBookNow: () => void
  onExploreAbout: () => void
  onSelectPackage: (packageName: string) => void
  onSelectRoom: (roomName: string) => void
  onViewRoomDetails: (slug: string) => void
}) {
  return (
    <main>
      <Hero
        bookingType={props.bookingState.activeType}
        onSelectBookingType={() => {}}
        onBookNow={props.onHeroBookNow}
        onExploreMore={props.onExploreAbout}
      />
      <About />
      <Occasions />
      <Packages
        selectedPackage={props.bookingState.event.selectedPackage}
        onSelectPackage={props.onSelectPackage}
      />
      <Gallery />
      <Accommodation
        selectedRoom={props.bookingState.room.selectedRoom}
        onSelectRoom={props.onSelectRoom}
        onViewDetails={props.onViewRoomDetails}
      />
      <Reviews />
      <Contact />
    </main>
  )
}

function BookingRoutePage(props: {
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
}) {
  return (
    <main className="bg-foreground pt-20">
      <Booking
        bookingState={props.bookingState}
        submissionState={props.submissionState}
        onSelectBookingType={props.onSelectBookingType}
        onSelectRoom={props.onSelectRoom}
        onSelectPackage={props.onSelectPackage}
        onSetRoomDate={props.onSetRoomDate}
        onSetEventDate={props.onSetEventDate}
        onSetEntranceDate={props.onSetEntranceDate}
        onSetRoomGuests={props.onSetRoomGuests}
        onSetEventGuests={props.onSetEventGuests}
        onSetRoomStayType={props.onSetRoomStayType}
        onToggleRoomAddOn={props.onToggleRoomAddOn}
        onSetEntranceTime={props.onSetEntranceTime}
        onSetEntranceGuests={props.onSetEntranceGuests}
        onSubmitBooking={props.onSubmitBooking}
      />
    </main>
  )
}

function RoomRoutePage(props: {
  bookingState: BookingState
  onBackToRooms: () => void
  onSetRoomDate: (date: string) => void
  onSetRoomGuests: (guests: number) => void
  onSetRoomStayType: (stayType: StayType) => void
  onToggleRoomAddOn: (addOn: AddOnId) => void
  onSelectRoom: (roomName: string) => void
  onViewRoom: (slug: string) => void
  onReserveRoom: (roomName: string) => void
}) {
  const { slug = '' } = useParams()
  const room = getRoomBySlug(slug)

  useEffect(() => {
    if (room && props.bookingState.room.selectedRoom !== room.name) {
      props.onSelectRoom(room.name)
    }
  }, [room, props])

  if (!room) {
    return (
      <NotFoundPage
        title="Room Not Found"
        description="The room you selected is no longer available or the link is incorrect."
      />
    )
  }

  return (
    <RoomDetailPage
      room={room}
      bookingState={props.bookingState}
      onBackToRooms={props.onBackToRooms}
      onSetRoomDate={props.onSetRoomDate}
      onSetRoomGuests={props.onSetRoomGuests}
      onSetRoomStayType={props.onSetRoomStayType}
      onToggleRoomAddOn={props.onToggleRoomAddOn}
      onSelectRoom={props.onSelectRoom}
      onViewRoom={props.onViewRoom}
      onReserveRoom={props.onReserveRoom}
    />
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingState, setBookingState] = useState<BookingState>(getStoredBookingState)
  const [submissionState, setSubmissionState] = useState<BookingSubmissionState>(defaultSubmissionState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingState))
  }, [bookingState])

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  const activeTotal = useMemo(() => calculateActiveTotal(bookingState), [bookingState])

  const clearSubmissionState = () => setSubmissionState(defaultSubmissionState)

  const setActiveType = (type: BookingType) => {
    clearSubmissionState()
    setBookingState((current) => ({ ...current, activeType: type }))
  }

  const selectRoom = (roomName: string) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      activeType: 'room',
      room: {
        ...current.room,
        selectedRoom: roomName,
        guests: clampGuestsForRoom(roomName, current.room.guests),
      },
    }))
  }

  const selectPackage = (packageName: string) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      activeType: 'event',
      event: {
        ...current.event,
        selectedPackage: packageName,
      },
    }))
  }

  const setRoomDate = (date: string) => {
    clearSubmissionState()
    setBookingState((current) => ({ ...current, room: { ...current.room, date } }))
  }

  const setEventDate = (date: string) => {
    clearSubmissionState()
    setBookingState((current) => ({ ...current, event: { ...current.event, date } }))
  }

  const setEntranceDate = (date: string) => {
    clearSubmissionState()
    setBookingState((current) => ({ ...current, entrance: { ...current.entrance, date } }))
  }

  const setRoomGuests = (guests: number) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      room: {
        ...current.room,
        guests: clampGuestsForRoom(current.room.selectedRoom, guests),
      },
    }))
  }

  const setEventGuests = (guests: number) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      event: {
        ...current.event,
        guests: Math.max(1, Math.min(120, guests)),
      },
    }))
  }

  const setRoomStayType = (stayType: StayType) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      room: { ...current.room, stayType },
    }))
  }

  const toggleRoomAddOn = (addOn: AddOnId) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      room: {
        ...current.room,
        addOns: current.room.addOns.includes(addOn)
          ? current.room.addOns.filter((item) => item !== addOn)
          : [...current.room.addOns, addOn],
      },
    }))
  }

  const setEntranceTime = (entranceTime: EntranceTime) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      activeType: 'entrance',
      entrance: { ...current.entrance, entranceTime },
    }))
  }

  const setEntranceGuests = (field: 'adults' | 'kids', value: number) => {
    clearSubmissionState()
    setBookingState((current) => ({
      ...current,
      entrance: {
        ...current.entrance,
        [field]: field === 'adults' ? Math.max(1, value) : Math.max(0, value),
      },
    }))
  }

  const navigateToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState({}, '', `/#${sectionId}`)
      return
    }

    navigate({ pathname: '/', hash: `#${sectionId}` })
  }

  const viewRoomDetails = (slug: string) => {
    const room = getRoomBySlug(slug)
    if (!room) {
      navigate('/not-found')
      return
    }

    selectRoom(room.name)
    navigate(`/rooms/${slug}`)
  }

  const reserveSelectedRoom = (roomName: string) => {
    selectRoom(roomName)
    navigate('/booking')
  }

  const validateBooking = () => {
    const today = getToday()

    if (bookingState.activeType === 'room') {
      const room = getRoomByName(bookingState.room.selectedRoom)
      if (!bookingState.room.date) return 'Please choose your preferred room date.'
      if (bookingState.room.date < today) return 'Room bookings cannot be set in the past.'
      if (bookingState.room.guests < 1) return 'Please add at least one guest.'
      const guestMax = room.maxPax ?? room.capacity
      if (bookingState.room.guests > guestMax) {
        return `${room.name} only allows up to ${guestMax} guests.`
      }
      return null
    }

    if (bookingState.activeType === 'event') {
      if (!bookingState.event.date) return 'Please choose your event date.'
      if (bookingState.event.date < today) return 'Event bookings cannot be set in the past.'
      if (bookingState.event.guests < 1) return 'Please enter an expected guest count.'
      return null
    }

    if (!bookingState.entrance.date) return 'Please choose your entrance date.'
    if (bookingState.entrance.date < today) return 'Entrance bookings cannot be set in the past.'
    if (bookingState.entrance.adults + bookingState.entrance.kids < 1) {
      return 'Please add at least one guest for the entrance booking.'
    }

    return null
  }

  const handleSubmitBooking = async () => {
    const error = validateBooking()
    if (error) {
      setSubmissionState({
        status: 'error',
        message: error,
        payload: null,
      })
      return
    }

    const payload = buildBookingPayload(bookingState)
    setSubmissionState({
      status: 'submitting',
      message: 'Sending your reservation details...',
      payload,
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log('BOOKING_SUBMISSION', payload)
      setSubmissionState({
        status: 'success',
        message: `Reservation request received for ${payload.type}. Our team will contact you shortly.`,
        payload,
      })
    } catch {
      setSubmissionState({
        status: 'error',
        message: 'Something went wrong while sending your reservation. Please try again.',
        payload: null,
      })
    }
  }

  const footer = (
    <Footer
      onNavigateHome={() => navigate('/')}
      onNavigateToSection={navigateToSection}
      onNavigateToBooking={() => navigate('/booking')}
    />
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isRoomPage={location.pathname.startsWith('/rooms/')}
        onNavigateHome={() => navigate('/')}
        onNavigateToSection={navigateToSection}
        onBookNow={() => navigate('/booking')}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage
                bookingState={bookingState}
                onHeroBookNow={() => navigate('/booking')}
                onExploreAbout={() => navigateToSection('about')}
                onSelectPackage={(packageName) => {
                  selectPackage(packageName)
                  navigate('/booking')
                }}
                onSelectRoom={(roomName) => {
                  selectRoom(roomName)
                  navigate('/booking')
                }}
                onViewRoomDetails={viewRoomDetails}
              />
              {footer}
            </>
          }
        />
        <Route
          path="/rooms/:slug"
          element={
            <>
              <RoomRoutePage
                bookingState={bookingState}
                onBackToRooms={() => navigateToSection('accommodation')}
                onSetRoomDate={setRoomDate}
                onSetRoomGuests={setRoomGuests}
                onSetRoomStayType={setRoomStayType}
                onToggleRoomAddOn={toggleRoomAddOn}
                onSelectRoom={selectRoom}
                onViewRoom={viewRoomDetails}
                onReserveRoom={reserveSelectedRoom}
              />
              {footer}
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <BookingRoutePage
                bookingState={bookingState}
                submissionState={submissionState}
                onSelectBookingType={setActiveType}
                onSelectRoom={selectRoom}
                onSelectPackage={selectPackage}
                onSetRoomDate={setRoomDate}
                onSetEventDate={setEventDate}
                onSetEntranceDate={setEntranceDate}
                onSetRoomGuests={setRoomGuests}
                onSetEventGuests={setEventGuests}
                onSetRoomStayType={setRoomStayType}
                onToggleRoomAddOn={toggleRoomAddOn}
                onSetEntranceTime={setEntranceTime}
                onSetEntranceGuests={setEntranceGuests}
                onSubmitBooking={handleSubmitBooking}
              />
              {footer}
            </>
          }
        />
        <Route
          path="/not-found"
          element={
            <>
              <NotFoundPage />
              {footer}
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <NotFoundPage />
              {footer}
            </>
          }
        />
      </Routes>
      <div className="sr-only">Current total {activeTotal}</div>
    </div>
  )
}

export default App
