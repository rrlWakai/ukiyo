import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface MasonryGalleryProps {
  images: string[]
}

function isVideoSrc(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src)
}

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((el, index) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => {
              const next = new Set(prev)
              next.add(index)
              return next
            })
            observer.disconnect()
          }
        },
        { threshold: 0.08 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [images])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    if (selectedItem) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [selectedItem])

  return (
    <>
      <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((src, index) => (
          <div
            key={src + index}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className={`break-inside-avoid transition-[opacity,transform] duration-700 ease-out ${
              visibleItems.has(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <button
              type="button"
              className="group block w-full overflow-hidden"
              onClick={() => setSelectedItem(src)}
            >
              {isVideoSrc(src) ? (
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-6"
          onClick={() => setSelectedItem(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="absolute right-6 top-6 text-white/50 transition-colors duration-200 hover:text-white"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>
          {isVideoSrc(selectedItem) ? (
            <video
              src={selectedItem}
              controls
              autoPlay
              className="max-h-[90vh] max-w-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={selectedItem}
              alt="Gallery preview"
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  )
}
