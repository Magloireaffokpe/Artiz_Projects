import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Star, ChevronRight } from "lucide-react";
import ReservationModal from "./ReservationModal";

const ArtisanCard = ({ artisan }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const tariffMin = artisan.tariff_min
    ? Number(artisan.tariff_min).toFixed(0)
    : "N/A";
  const tariffMax = artisan.tariff_max
    ? Number(artisan.tariff_max).toFixed(0)
    : "N/A";

  const fullName =
    `${artisan.user_first_name || ""} ${artisan.user_last_name || ""}`.trim() ||
    artisan.user?.username ||
    "Artisan";
  const getInitials = () => {
    if (artisan.user_first_name && artisan.user_last_name) {
      return (
        artisan.user_first_name[0] + artisan.user_last_name[0]
      ).toUpperCase();
    }
    return artisan.user_first_name?.charAt(0)?.toUpperCase() || "A";
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 flex flex-col items-center text-center relative">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl mb-4 overflow-hidden border-2 border-white">
            {artisan.profile_picture ? (
              <img
                src={artisan.profile_picture}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-bold">{getInitials()}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
          <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm mt-1">
            <Briefcase size={14} />
            <span className="capitalize">
              {artisan.metier || "Non spécifié"}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MapPin size={16} className="text-gray-400" />
            <span className="truncate">
              {artisan.address || "Adresse non spécifiée"}
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {artisan.description ||
              artisan.tariffs_description ||
              "Aucune description fournie par cet artisan."}
          </p>

          <div className="bg-gray-50 rounded-xl p-3 mb-6 flex justify-between items-center">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Tarifs
            </span>
            <span className="font-semibold text-gray-900">
              {tariffMin} - {tariffMax} FCFA
            </span>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg text-sm"
            >
              Réserver
            </button>
            <button
              onClick={() => navigate(`/artisan/${artisan.id}`)}
              className="w-12 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <ReservationModal artisan={artisan} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default ArtisanCard;
