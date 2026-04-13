import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ArtisanCard from "../components/ArtisanCard";
import { searchArtisans, getAllArtisans } from "../services/artisanService";
import { Search, MapPin, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const METIERS = [
  { value: "", label: "Tous les métiers" },
  { value: "plomberie", label: "Plomberie" },
  { value: "electricite", label: "Électricité" },
  { value: "menuiserie", label: "Menuiserie" },
  { value: "maconnerie", label: "Maçonnerie" },
  { value: "couture", label: "Couture" },
  { value: "mecanique", label: "Mécanique" },
  { value: "coiffure", label: "Coiffure" },
  { value: "peinture", label: "Peinture" },
];

function TrouverServicePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [service, setService] = useState(searchParams.get("service") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [artisans, setArtisans] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ Debounce uniquement pour le champ texte (ville)
  const debounceTimer = useRef(null);

  const fetchArtisans = async (metier, loc) => {
    let cancelled = false;
    setIsLoading(true);
    setHasSearched(true);
    try {
      let data;
      if (metier || loc) {
        data = await searchArtisans({ metier, location: loc });
      } else {
        data = await getAllArtisans();
      }
      if (!cancelled) {
        setArtisans(data);
        setError("");
      }
    } catch {
      if (!cancelled) {
        setArtisans([]);
        setError("Aucun artisan ne correspond à vos critères.");
      }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
    return () => {
      cancelled = true;
    };
  };

  // ✅ Chargement initial
  useEffect(() => {
    fetchArtisans(service, location);
  }, []); // une seule fois au montage

  // ✅ Le select métier déclenche immédiatement
  const handleServiceChange = (e) => {
    const val = e.target.value;
    setService(val);
    const params = new URLSearchParams();
    if (val) params.append("service", val);
    if (location) params.append("location", location);
    setSearchParams(params);
    fetchArtisans(val, location); // immédiat
  };

  // ✅ Le champ ville attend 500ms après la dernière frappe (debounce)
  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (service) params.append("service", service);
      if (val) params.append("location", val);
      setSearchParams(params);
      fetchArtisans(service, val); // déclenché après 500ms
    }, 500);
  };

  const handleReset = () => {
    setService("");
    setLocation("");
    setSearchParams({});
    fetchArtisans("", "");
  };

  // Le bouton Filtrer reste utile pour forcer une recherche (ex: après Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceTimer.current);
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    if (location) params.append("location", location);
    setSearchParams(params);
    fetchArtisans(service, location);
  };

  const activeMetier = METIERS.find((m) => m.value === service)?.label;

  return (
    <>
      <Helmet>
        <title>
          {activeMetier && activeMetier !== "Tous les métiers"
            ? `${activeMetier} au Bénin`
            : "Trouver un artisan"}{" "}
          – Artiz
        </title>
        <meta
          name="description"
          content={`Trouvez des artisans qualifiés${activeMetier ? ` en ${activeMetier}` : ""} au Bénin. Profils vérifiés, tarifs transparents, réservation rapide.`}
        />
      </Helmet>

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100 py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {hasSearched && service
                  ? `Artisans en ${activeMetier}`
                  : "Tous les artisans"}
              </h1>
              <p className="text-gray-500">
                {artisans.length > 0
                  ? `${artisans.length} professionnel${artisans.length > 1 ? "s" : ""} trouvé${artisans.length > 1 ? "s" : ""}`
                  : "Parcourez notre catalogue ou filtrez par métier et ville."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-3"
              role="search"
            >
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <Filter
                  className="text-gray-400 mr-3 flex-shrink-0"
                  size={18}
                />
                <select
                  value={service}
                  onChange={handleServiceChange} // ✅ immédiat
                  className="w-full bg-transparent text-gray-700 font-medium py-3.5 focus:outline-none cursor-pointer"
                  aria-label="Filtrer par métier"
                >
                  {METIERS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <MapPin
                  className="text-gray-400 mr-3 flex-shrink-0"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Ville, quartier…"
                  value={location}
                  onChange={handleLocationChange} // ✅ debounce 500ms
                  className="w-full bg-transparent text-gray-700 py-3.5 focus:outline-none placeholder-gray-400"
                  aria-label="Filtrer par ville"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 md:flex-none px-8 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  }}
                >
                  <Search size={18} /> Filtrer
                </button>
                {(service || location) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-xl font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                    aria-label="Réinitialiser les filtres"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-medium">Recherche en cours…</p>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                  Aucun résultat
                </h2>
                <p className="text-gray-400 mb-8">
                  Essayez d'autres critères ou explorez tous les artisans.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Voir tous les artisans
                </button>
              </motion.div>
            ) : artisans.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {artisans.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ArtisanCard artisan={a} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                <h2 className="text-xl font-bold text-gray-400">
                  Aucun artisan disponible
                </h2>
                <p className="text-gray-300 mt-2">
                  Revenez bientôt, notre réseau s'agrandit chaque jour.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default TrouverServicePage;
