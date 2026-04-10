import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Search,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  ThumbsUp,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "plomberie",
    label: "Plomberie",
    desc: "Canalisations, fuites, installations sanitaires",
    photo:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80&auto=format&fit=crop",
    count: 1247,
  },
  {
    id: "electricite",
    label: "Électricité",
    desc: "Câblage, tableau, dépannage d'urgence",
    photo:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
    count: 982,
  },
  {
    id: "couture",
    label: "Couture",
    desc: "Confection, retouches, créations sur mesure",
    photo:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop",
    count: 2156,
  },
  {
    id: "menuiserie",
    label: "Menuiserie",
    desc: "Meubles, portes, agencement bois",
    photo:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80&auto=format&fit=crop",
    count: 873,
  },
  {
    id: "maconnerie",
    label: "Maçonnerie",
    desc: "Construction, crépissage, carrelage",
    photo:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop",
    count: 1520,
  },
  {
    id: "peinture",
    label: "Peinture",
    desc: "Intérieur, extérieur, finitions",
    photo:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80&auto=format&fit=crop",
    count: 634,
  },
  {
    id: "mecanique",
    label: "Mécanique",
    desc: "Réparation auto/moto, vidange, diagnostic",
    photo:
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80&auto=format&fit=crop",
    count: 1142,
  },
  {
    id: "coiffure",
    label: "Coiffure & Beauté",
    desc: "Coupes, tresses, soins esthétiques",
    photo:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop",
    count: 2460,
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Artisans vérifiés", Icon: Shield },
  { value: 12000, suffix: "+", label: "Clients satisfaits", Icon: ThumbsUp },
  { value: 8, suffix: " métiers", label: "Catégories couvertes", Icon: Star },
  { value: 24, suffix: "h", label: "Délai de réponse moyen", Icon: Clock },
];

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

// ─── ANIMATED COUNT ────────────────────────────────────────────────────────────

function AnimatedCount({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let frame;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref} aria-label={`${target}${suffix}`}>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

// ─── SERVICE CARD (améliorée responsive) ─────────────────────────────────────

function ServiceCard({ service, onClick }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Trouver un artisan en ${service.label}`}
      className="group relative rounded-2xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      style={{ aspectRatio: "4/3" }}
    >
      <img
        src={service.photo}
        alt={`Artisan travaillant en ${service.label}`}
        loading="lazy"
        decoding="async"
        width={600}
        height={450}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient overlay plus prononcé en bas pour lisibilité */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,25,0.95) 0%, rgba(8,8,25,0.6) 50%, transparent 100%)",
        }}
      />

      {/* Badge demandes */}
      <div
        className="absolute top-3 right-3 px-2 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {service.count.toLocaleString("fr-FR")} demandes
      </div>

      {/* Texte – padding responsive, tailles adaptées */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5">
        <h3 className="text-white font-black text-sm sm:text-base md:text-lg leading-tight mb-0.5">
          {service.label}
        </h3>
        <p className="text-white/80 text-[10px] sm:text-xs mb-2 line-clamp-2">
          {service.desc}
        </p>
        <span
          className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full text-white bg-indigo-600/90 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          Voir les artisans <ArrowRight size={10} />
        </span>
      </div>
    </motion.article>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!serviceType && !location.trim()) {
      toast.error("Précisez un service ou une ville pour lancer la recherche.");
      return;
    }
    navigate("/trouver-service", { state: { serviceType, location } });
  };

  return (
    <>
      <Helmet>
        <title>Artiz – Trouvez le meilleur artisan au Bénin</title>
        <meta
          name="description"
          content="Artiz connecte clients et artisans qualifiés au Bénin : plombiers, électriciens, menuisiers, couturiers… Trouvez le bon professionnel près de chez vous et réservez en quelques clics."
        />
        <meta
          property="og:title"
          content="Artiz – La plateforme des artisans au Bénin"
        />
        <meta
          property="og:description"
          content="500+ artisans vérifiés, disponibles rapidement."
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:font-bold"
      >
        Aller au contenu principal
      </a>

      <main id="main-content">
        {/* ========== HERO ========== */}
        <section
          aria-label="Bienvenue sur Artiz"
          className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20"
        >
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=2070&auto=format&fit=crop"
            alt="Artisans maçons travaillant sur un chantier de construction"
            fetchpriority="high"
            width={2070}
            height={1380}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, rgba(5,5,20,0.50) 0%, rgba(5,5,20,0.72) 60%, rgba(5,5,20,0.94) 100%)",
            }}
          />
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center pt-36 pb-28">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(255,255,255,0.11)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-white/90 text-sm font-semibold">
                Plateforme #1 des artisans au Bénin
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight"
            >
              L'artisan qu'il vous faut,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #a5b4fc, #c084fc, #f9a8d4)",
                }}
              >
                à portée de main.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="text-lg md:text-xl text-white/60 max-w-xl mb-14 leading-relaxed"
            >
              Professionnels locaux vérifiés par la communauté. Réservez en
              toute confiance, sans intermédiaire.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.42 }}
              onSubmit={handleSearch}
              aria-label="Recherche d'artisan"
              className="w-full max-w-3xl rounded-2xl p-2"
              style={{
                background: "rgba(255,255,255,0.11)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div
                  className="flex-1 flex items-center rounded-xl px-4 py-1 border border-white/15 focus-within:border-indigo-400 transition-all"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Search
                    size={18}
                    className="text-white/45 mr-3"
                    aria-hidden="true"
                  />
                  <label htmlFor="hero-service" className="sr-only">
                    Type de service recherché
                  </label>
                  <select
                    id="hero-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-transparent py-3.5 focus:outline-none cursor-pointer text-sm font-medium text-white placeholder-white/40"
                  >
                    <option value="" className="text-gray-900">
                      Quel service ?
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id} className="text-gray-900">
                        {s.label}
                      </option>
                    ))}
                    <option value="autre" className="text-gray-900">
                      Autre service
                    </option>
                  </select>
                </div>
                <div
                  className="flex-1 flex items-center rounded-xl px-4 py-1 border border-white/15 focus-within:border-indigo-400 transition-all"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <MapPin
                    size={18}
                    className="text-white/45 mr-3"
                    aria-hidden="true"
                  />
                  <label htmlFor="hero-location" className="sr-only">
                    Ville ou quartier
                  </label>
                  <input
                    id="hero-location"
                    type="text"
                    placeholder="Ville ou quartier…"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent py-3.5 focus:outline-none text-sm text-white placeholder-white/40 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  }}
                >
                  Rechercher
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-18 pt-10"
            >
              {STATS.map(({ value, suffix, label, Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-indigo-300"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-2xl font-black text-white leading-none">
                      <AnimatedCount target={value} suffix={suffix} />
                    </p>
                    <p className="text-xs text-white/48 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
            aria-hidden="true"
          >
            <ChevronDown size={28} />
          </motion.div>
        </section>

        {/* ========== SERVICES (responsive amélioré) ========== */}
        <section
          aria-labelledby="services-heading"
          className="py-20 sm:py-28 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-indigo-700 bg-indigo-50 mb-4"
                >
                  Nos services
                </motion.span>
                <motion.h2
                  id="services-heading"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight"
                >
                  Les métiers
                  <br className="hidden sm:block" /> les plus demandés
                </motion.h2>
              </div>
              <p className="text-gray-500 text-sm sm:text-base max-w-xs">
                Professionnels qualifiés, vérifiés et évalués par des milliers
                de clients béninois.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {SERVICES.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onClick={() =>
                    navigate("/trouver-service", {
                      state: { serviceType: s.id },
                    })
                  }
                />
              ))}
            </div>

            <div className="text-center mt-10 sm:mt-12">
              <button
                onClick={() => navigate("/trouver-service")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-indigo-200 text-indigo-700 font-bold text-sm sm:text-base hover:bg-indigo-50 transition-colors"
              >
                Voir tous les artisans <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ========== COMMENT ÇA MARCHE ========== */}
        <section
          aria-labelledby="how-heading"
          className="py-20 sm:py-28 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2
                id="how-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-5"
              >
                Réservez en 3 étapes
              </h2>
              <p className="text-gray-500 text-base sm:text-lg">
                Moins de 5 minutes suffisent.
              </p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  n: "01",
                  title: "Décrivez votre besoin",
                  desc: "Choisissez le type de service et votre localisation.",
                  Icon: Search,
                },
                {
                  n: "02",
                  title: "Choisissez un artisan",
                  desc: "Comparez les profils, tarifs et avis clients vérifiés.",
                  Icon: Star,
                },
                {
                  n: "03",
                  title: "Confirmez la réservation",
                  desc: "Contactez directement l'artisan ou envoyez une demande.",
                  Icon: ThumbsUp,
                },
              ].map(({ n, title, desc, Icon }, i) => (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.14 }}
                  className="relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm"
                >
                  <span
                    className="text-6xl sm:text-8xl font-black text-gray-50 absolute top-3 sm:top-4 right-4 sm:right-5 select-none leading-none"
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-white flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    {desc}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ========== TÉMOIGNAGES ========== */}
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
                            background:
                              "linear-gradient(135deg, #6366f1, #7c3aed)",
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
                      (i) =>
                        (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                    );
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
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
                        background:
                          i === testimonialIdx ? "#6366f1" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    pauseAuto();
                    setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CTA ARTISAN ========== */}
        <section
          aria-labelledby="cta-heading"
          className="py-20 sm:py-24 px-6 bg-gray-50"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative px-6 py-12 sm:px-12 md:px-20 md:py-20 text-center">
                <h2
                  id="cta-heading"
                  className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-5"
                >
                  Vous êtes artisan ?
                </h2>
                <p className="text-white/75 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                  Rejoignez notre réseau et développez votre activité.
                  Visibilité gratuite, clients qualifiés, zéro commission.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/devenir-artisan")}
                    className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-indigo-700 rounded-full font-black text-sm sm:text-base hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Devenir partenaire
                  </button>
                  <button
                    onClick={() => navigate("/trouver-service")}
                    className="px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-white text-sm sm:text-base hover:bg-white/10 transition-all"
                    style={{ border: "1.5px solid rgba(255,255,255,0.38)" }}
                  >
                    Explorer la plateforme
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer
          className="bg-gray-950 text-white pt-12 sm:pt-16 pb-6 sm:pb-8 px-6"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-14">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm sm:text-lg text-white"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    }}
                    aria-hidden="true"
                  >
                    AT
                  </div>
                  <span className="text-xl sm:text-2xl font-black">Artiz</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                  La première plateforme de mise en relation entre artisans
                  qualifiés et clients au Bénin. Simple, rapide, fiable.
                </p>
              </div>

              <nav aria-label="Liens de la plateforme">
                <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4 sm:mb-5">
                  Plateforme
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    ["Trouver un artisan", "/trouver-service"],
                    ["Devenir artisan", "/devenir-artisan"],
                    ["Se connecter", "/login"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Liens légaux">
                <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4 sm:mb-5">
                  Légal
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Conditions d'utilisation",
                    "Politique de confidentialité",
                    "Mentions légales",
                  ].map((label) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="border-t border-white/10 pt-6 sm:pt-8 text-center text-gray-600 text-xs sm:text-sm">
              © {new Date().getFullYear()} Artiz – Tous droits réservés. Fait
              avec ♥ au Bénin.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
