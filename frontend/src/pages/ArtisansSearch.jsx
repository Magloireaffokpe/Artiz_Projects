import React, { useState } from "react";
import apiClient from "../services/api";
import ArtisanCard from "../components/ArtisanCard";

export default function ArtisansSearch() {
  const [artisans, setArtisans] = useState([]);
  const [metier, setMetier] = useState("");
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (metier.trim()) params.metier = metier.trim();
      if (ville.trim()) params.location = ville.trim();
      const res = await apiClient.get("/artisans/search/", { params });
      setArtisans(res.data);
    } catch (error) {
      console.error("Erreur de recherche", error);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Trouver un artisan</h2>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Métier (ex: électricité, plomberie...)"
          value={metier}
          onChange={(e) => setMetier(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Ville (ex: Cotonou, Parakou...)"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {loading && <p className="text-center">Chargement...</p>}

      {!loading && artisans.length === 0 && (
        <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </div>
  );
}
