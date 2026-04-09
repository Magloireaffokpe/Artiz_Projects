import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ArtisanCard from "../components/ArtisanCard";
import { searchArtisans, getAllArtisans } from "../services/artisanService";
import { Search, MapPin, Filter } from "lucide-react";

function TrouverServicePage() {
  const location = useLocation();
  // Récupérer les paramètres passés depuis l'accueil (HomePage) s'ils existent
  const initialState = location.state || { serviceType: "", location: "" };

  const [formData, setFormData] = useState(initialState);
  const [artisans, setArtisans] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lancer la recherche automatiquement si on vient de l'accueil avec des paramètres
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
    } catch (err) {
      setError("Impossible de charger les artisans.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFetch = async (searchData) => {
    setIsLoading(true);
    try {
      const data = await searchArtisans(searchData);
      setArtisans(data);
      setError("");
    } catch (err) {
      setArtisans([]);
      setError("Aucun artisan ne correspond à vos critères.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchFetch(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de page */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Trouvez le professionnel idéal
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Parcourez notre catalogue d'artisans qualifiés ou utilisez les
            filtres pour affiner votre recherche.
          </p>
        </div>

        {/* Formulaire de recherche horizontal */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
            <Filter className="text-gray-400 mr-3" size={20} />
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-700 font-medium py-3 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="">Tous les métiers</option>
              <option value="plomberie">Plomberie</option>
              <option value="electricite">Électricité</option>
              <option value="menuiserie">Menuiserie</option>
              <option value="maçonnerie">Maçonnerie</option>
              <option value="couture">Couture</option>
              <option value="mecanique">Mécanique</option>
            </select>
          </div>

          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-100 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
            <MapPin className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              name="location"
              placeholder="Ex: Cotonou, Parakou..."
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-700 py-3 focus:outline-none placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search size={20} /> Rechercher
          </button>
        </form>

        {/* Résultats */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-medium border border-red-100">
            {error}
          </div>
        ) : artisans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artisans.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">
              Aucun artisan disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrouverServicePage;
