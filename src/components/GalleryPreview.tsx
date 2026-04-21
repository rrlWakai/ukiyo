import { Link } from "react-router-dom";
import { MasonryGallery } from "./MasonryGallery";

const previewImages = [
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
  "/images/pool.mp4",
];

export function GalleryPreview() {
  return (
    <section id="gallery" className="section-shell bg-[#F5F3EF]">
      <div className="page-shell">
        <div className="section-header max-w-xl mb-10">
          <p className="section-kicker">Gallery</p>
          <h2 className="section-title">
            See the place
            <br />
            before you arrive.
          </h2>
          <p className="section-copy text-sm">
            Every image is taken on-site — no styling, no filters. What you see
            is what awaits you.
          </p>
        </div>

        <MasonryGallery images={previewImages} />

        <div className="mt-10 flex justify-center">
          <Link to="/gallery">
            <button
              type="button"
              className="px-6 py-2 bg-black text-white transition hover:bg-neutral-800"
            >
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
