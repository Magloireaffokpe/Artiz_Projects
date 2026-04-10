import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Adjoua Koffi",
    city: "Cotonou",
    rating: 5,
    initials: "AK",
    text: "J'ai trouvé un excellent électricien en moins de 2 heures. Service irréprochable, je recommande à 100 %.",
  },
  {
    name: "Moussa Dembélé",
    city: "Parakou",
    rating: 5,
    initials: "MD",
    text: "Plateforme super intuitive. Mon artisan est arrivé à l'heure et a fait un travail soigné. Merci Artiz !",
  },
  {
    name: "Fatou Traoré",
    city: "Bohicon",
    rating: 5,
    initials: "FT",
    text: "Enfin une solution fiable pour trouver de bons artisans. Les profils sont bien détaillés et les tarifs clairs.",
  },
];

export default function Testimonials() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const autoRef = useRef(null);

  useEffect(() => {
    autoRef.current = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      5000,
    );
    return () => clearInterval(autoRef.current);
  }, []);

  const pauseAuto = () => clearInterval(autoRef.current);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 sm:py-28 bg-white overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-14">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900"
          >
            Ils nous font confiance
          </h2>
        </div>

        <div
          role="region"
          aria-label="Témoignages clients"
          aria-roledescription="carrousel"
        >
          <div className="relative" style={{ minHeight: 280 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                role="group"
                aria-roledescription="diapositive"
                aria-label={`Témoignage ${i + 1} sur ${TESTIMONIALS.length}`}
                aria-hidden={i !== testimonialIdx}
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: 0,
                  opacity: i === testimonialIdx ? 1 : 0,
                  transform: `translateY(${i === testimonialIdx ? 0 : 14}px)`,
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  pointerEvents: i === testimonialIdx ? "auto" : "none",
                }}
              >
                <blockquote className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-gray-100">
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={18}
                        className={
                          j < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-base sm:text-xl text-gray-700 italic leading-relaxed mb-6 sm:mb-8">
                    "{t.text}"
                  </p>
                  <footer className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                      }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <div>
                      <cite className="font-black text-gray-900 not-italic block text-sm sm:text-base">
                        {t.name}
                      </cite>
                      <span className="text-gray-400 text-xs sm:text-sm">
                        {t.city}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
            <button
              onClick={() => {
                pauseAuto();
                setTestimonialIdx(
                  (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                );
              }}
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div
              role="tablist"
              aria-label="Navigation témoignages"
              className="flex gap-2"
            >
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === testimonialIdx}
                  aria-label={`Témoignage ${i + 1}`}
                  onClick={() => {
                    pauseAuto();
                    setTestimonialIdx(i);
                  }}
                  className="rounded-full transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                  style={{
                    width: i === testimonialIdx ? 24 : 8,
                    height: 8,
                    background: i === testimonialIdx ? "#6366f1" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => {
                pauseAuto();
                setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
              }}
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Témoignage suivant"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
