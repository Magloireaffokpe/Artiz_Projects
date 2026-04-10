import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ArtisanCard from "../components/ArtisanCard";
import { searchArtisans, getAllArtisans } from "../services/artisanService";
import { Search, MapPin, Filter, SlidersHorizontal, X } from "lucide-react";
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
  const location = useLocation();
  const initialState = location.state || { serviceType: "", location: "" };

  const [formData, setFormData] = useState(initialState);
  const [artisans, setArtisans] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (formData.serviceType || formData.location) {
      handleSearchFetch(formData);
    } else {
      fetchAllArtisans();
    }
  }, []);

  const fetchAllArtisans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllArtisans();
      setArtisans(data);
      setError("");
    } catch {
      setError("Impossible de charger les artisans.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFetch = async (searchData) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchArtisans(searchData);
      setArtisans(data);
      setError("");
    } catch {
      setArtisans([]);
      setError("Aucun artisan ne correspond à vos critères.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchFetch(formData);
  };

  const handleReset = () => {
    setFormData({ serviceType: "", location: "" });
    setHasSearched(false);
    fetchAllArtisans();
  };

  const activeMetier = METIERS.find(
    (m) => m.value === formData.serviceType,
  )?.label;

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
        {/* Page Header */}
        <section
          className="bg-white border-b border-gray-100 py-10 px-6"
          aria-labelledby="search-heading"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1
                id="search-heading"
                className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
              >
                {hasSearched && formData.serviceType
                  ? `Artisans en ${activeMetier}`
                  : "Tous les artisans"}
              </h1>
              <p className="text-gray-500">
                {artisans.length > 0
                  ? `${artisans.length} professionnel${artisans.length > 1 ? "s" : ""} trouvé${artisans.length > 1 ? "s" : ""}`
                  : "Parcourez notre catalogue ou filtrez par métier et ville."}
              </p>
            </div>

            {/* Search bar */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-3"
              role="search"
              aria-label="Rechercher un artisan"
            >
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <Filter
                  className="text-gray-400 mr-3 flex-shrink-0"
                  size={18}
                />
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
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
                  name="location"
                  placeholder="Ville, quartier…"
                  value={formData.location}
                  onChange={handleChange}
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
                {(formData.serviceType || formData.location) && (
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

        {/* Results */}
        <section className="py-10 px-6" aria-label="Résultats de recherche">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div
                  className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"
                  aria-label="Chargement en cours"
                />
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
