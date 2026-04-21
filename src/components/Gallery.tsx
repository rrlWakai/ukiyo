import { ChevronLeft } from "lucide-react";
import { MasonryGallery } from "./MasonryGallery";

const allImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/pool.mp4",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/about-1.jpg",
  "/images/executive-4.mp4",
  "images/pool-2.mp4",
  "images/pool-3.mp4",
  "/images/about-2.jpg",
  "/images/package-2.jpg",
  "/images/package-3.jpg",
];

export function Gallery() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <ChevronLeft size={14} />
          Back
        </button>

        <div className="mb-12">
          <p className="section-kicker">Ukiyo Resort</p>
          <h1 className="section-title">Gallery</h1>
          <p className="section-copy max-w-md text-sm">
            A full look at what makes Ukiyo unforgettable — from our suites to
            the scenery that surrounds them.
          </p>
        </div>

        <MasonryGallery images={allImages} />
      </div>
    </div>
  );
}
