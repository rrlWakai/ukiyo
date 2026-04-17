import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'

const galleryImages = [
  {
    src: '/images/gallery-1.jpg',
    alt: 'Resort pool at sunset',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/images/gallery-2.jpg',
    alt: 'Luxury bedroom',
    span: '',
  },
  {
    src: '/images/gallery-3.jpg',
    alt: 'Gourmet breakfast',
    span: '',
  },
  {
    src: '/images/gallery-4.jpg',
    alt: 'Nature trail',
    span: '',
  },
  {
    src: '/images/gallery-5.jpg',
    alt: 'Spa treatment',
    span: '',
  },
  {
    src: '/images/gallery-6.jpg',
    alt: 'Sunset view',
    span: 'md:col-span-2',
  },
]

export function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <section id="gallery" className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-accent text-sm tracking-[0.2em] uppercase mb-4 font-semibold">Our Gallery</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium text-balance">
              Gallery
            </h2>
            <p className="mt-4 text-muted-foreground">
              Take a visual journey through our resort and discover the beauty that awaits you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
            {galleryImages.map((image, index) => (
              <motion.button
                key={image.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                type="button"
                onClick={() => setSelectedImage(image.src)}
                className={`relative overflow-hidden border border-border group cursor-pointer ${image.span}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/25" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </motion.div>
      )}
    </>
  )
}
