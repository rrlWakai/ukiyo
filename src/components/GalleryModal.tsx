import { X } from 'lucide-react'

type GalleryModalProps = {
  images: string[]
  title: string
  onClose: () => void
}

export function GalleryModal({ images, title, onClose }: GalleryModalProps) {
  return (
    <div className="fixed inset-0 z-[70] bg-foreground/90 p-6" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 border border-white/20 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X size={20} />
      </button>
      <div className="mx-auto flex h-full max-w-6xl items-center">
        <div className="w-full" onClick={(event) => event.stopPropagation()}>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">{title}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="border border-white/15">
                <img src={image} alt={`${title} photo ${index + 1}`} className="h-[300px] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
