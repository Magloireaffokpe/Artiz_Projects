import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Languages,
  DollarSign,
  ArrowLeft,
  Star,
  FileText,
  CheckCircle,
} from "lucide-react";
import ReservationModal from "../components/ReservationModal";

const API_URL = "http://localhost:8000/api/v1/artisans/";

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await axios.get(`${API_URL}${id}/`);
        setArtisan(response.data);
      } catch (e) {
        setError("Impossible de charger le profil de cet artisan.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-3xl">
          <p className="text-red-600 font-medium text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-full"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Retour aux résultats
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de Gauche : Carte Profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center sticky top-24">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-lg flex items-center justify-center text-5xl mb-6 overflow-hidden relative">
                {artisan.profile_picture ? (
                  <img
                    src={artisan.profile_picture}
                    alt={artisan.user?.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 font-bold">
                    {artisan.user?.first_name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {artisan.user?.first_name || "Artisan Inconnu"}
              </h1>
              <p className="text-indigo-600 font-medium capitalize mb-6">
                {artisan.metier || "Non spécifié"}
              </p>

              <button
                onClick={() => setShowReservationForm(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Demander un service
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100 text-left space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-sm">
                    {artisan.address || "Adresse non spécifiée"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Languages size={18} className="text-gray-400" />
                  <span className="text-sm capitalize">
                    {artisan.languages || "Non spécifiées"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne de Droite : Détails */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-2/3 space-y-6"
          >
            {/* Section Description */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" /> À propos de
                moi
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {artisan.description ||
                  "Cet artisan n'a pas encore rédigé de description détaillée. Contactez-le pour en savoir plus sur ses compétences !"}
              </p>
            </div>

            {/* Section Tarification */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-600" />{" "}
                Tarification & Services
              </h2>

              <div className="flex items-center gap-4 bg-emerald-50 text-emerald-800 p-4 rounded-xl mb-6 font-medium">
                <span className="text-lg font-bold">Fourchette estimée :</span>
                <span className="text-xl">
                  {artisan.tariff_min
                    ? Number(artisan.tariff_min).toFixed(0)
                    : "N/A"}{" "}
                  -{" "}
                  {artisan.tariff_max
                    ? Number(artisan.tariff_max).toFixed(0)
                    : "N/A"}{" "}
                  FCFA
                </span>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Détails des tarifs
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {artisan.tariffs_description ||
                    "Aucune précision supplémentaire sur les tarifs."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modal de Réservation */}
        {showReservationForm && (
          <ReservationModal
            artisan={artisan}
            onClose={() => setShowReservationForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ArtisanDetailPage;
