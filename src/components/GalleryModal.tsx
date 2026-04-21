import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

function isVideoSrc(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src)
}

type GalleryModalProps = {
  images: string[]
  title: string
  onClose: () => void
}

export function GalleryModal({ images, title, onClose }: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  return (
    <div
      className="fixed inset-0 z-70 flex flex-col bg-foreground/95"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/50">
            {title}
          </p>
          <p className="mt-0.5 text-sm text-white/30">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
          aria-label="Close gallery"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideoSrc(images[activeIndex]) ? (
          <video
            key={activeIndex}
            src={images[activeIndex]}
            controls
            autoPlay
            className="max-h-full max-w-full"
          />
        ) : (
          <img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`${title} photo ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              className="absolute right-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 overflow-hidden transition-opacity duration-200 ${
                i === activeIndex
                  ? 'ring-2 ring-white opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              {isVideoSrc(src) ? (
                <video
                  src={src}
                  muted
                  className="h-14 w-20 object-cover"
                />
              ) : (
                <img
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  className="h-14 w-20 object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
