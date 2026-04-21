import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Salvadorr Luminarios",
    rating: 5,
    text: "its a good place for leisure and relaxation.",
  },
  {
    name: "Gabriel DelaCruz",
    rating: 5,
    text: "Nice",
  },
  {
    name: "Bryan Advincula",
    rating: 5,
    text: "The place is very spacious and the pool is very big, there's also a lot of space to hang out inside, and the parking area is also big, solid!",
  },
];

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="reviews" className="section-shell bg-background">
      <div className="page-shell">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-header text-center"
        >
          <p className="section-kicker">Guest Reviews</p>
          <h2 className="section-title mx-auto max-w-xl">
            Told in their
            <br />
            own words.
          </h2>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="space-y-5"
            >
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-base leading-relaxed text-foreground md:text-lg">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="border-t border-border pt-5">
                <p className="text-sm font-medium text-foreground">
                  {review.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
