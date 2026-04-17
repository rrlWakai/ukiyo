import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Resort pool at sunset",
    span: "md:col-span-2 md:row-span-2",
  },
  { src: "/images/gallery-2.jpg", alt: "Luxury bedroom", span: "" },
  { src: "/images/gallery-3.jpg", alt: "Gourmet breakfast", span: "" },
  { src: "/images/gallery-4.jpg", alt: "Nature trail", span: "" },
  { src: "/images/gallery-5.jpg", alt: "Spa treatment", span: "" },
];

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <section id="gallery" className="section-shell bg-[#F5F3EF]">
        <div className="page-shell">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="section-header max-w-xl"
          >
            <p className="section-kicker">Gallery</p>
            <h2 className="section-title">
              See the place
              <br />
              before you arrive.
            </h2>
            <p className="section-copy text-sm">
              Every image is taken on-site — no styling, no filters. What you
              see is what awaits you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4 md:gap-5">
            {galleryImages.map((image, index) => (
              <motion.button
                key={image.src}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.09,
                }}
                type="button"
                onClick={() => setSelectedImage(image.src)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${image.span}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/96 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 text-white/50 transition-colors duration-300 hover:text-white"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            src={selectedImage}
            alt="Gallery preview"
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
}
