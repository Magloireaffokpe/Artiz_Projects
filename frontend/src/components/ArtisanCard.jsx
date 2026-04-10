import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import ReservationModal from "./ReservationModal";

const ArtisanCard = ({ artisan }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const tariffMin = artisan.tariff_min
    ? Number(artisan.tariff_min).toLocaleString("fr-FR")
    : "N/A";
  const tariffMax = artisan.tariff_max
    ? Number(artisan.tariff_max).toLocaleString("fr-FR")
    : "N/A";

  const fullName =
    `${artisan.user_first_name || ""} ${artisan.user_last_name || ""}`.trim() ||
    artisan.user?.username ||
    "Artisan";

  const getInitials = () => {
    if (artisan.user_first_name && artisan.user_last_name)
      return (
        artisan.user_first_name[0] + artisan.user_last_name[0]
      ).toUpperCase();
    return artisan.user_first_name?.charAt(0)?.toUpperCase() || "A";
  };

  const metierColors = {
    plomberie: "bg-sky-50 text-sky-700 border-sky-100",
    electricite: "bg-amber-50 text-amber-700 border-amber-100",
    couture: "bg-rose-50 text-rose-700 border-rose-100",
    menuiserie: "bg-orange-50 text-orange-700 border-orange-100",
    mecanique: "bg-emerald-50 text-emerald-700 border-emerald-100",
    coiffure: "bg-red-50 text-red-700 border-red-100",
    peinture: "bg-violet-50 text-violet-700 border-violet-100",
  };
  const badgeClass =
    metierColors[artisan.metier] ||
    "bg-indigo-50 text-indigo-700 border-indigo-100";

  return (
    <>
      <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Card Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-gray-50 to-indigo-50/30">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-100 border-2 border-white shadow-md flex items-center justify-center">
                {artisan.profile_picture ? (
                  <img
                    src={artisan.profile_picture}
                    alt={`Photo de ${fullName}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-indigo-600 font-black text-xl">
                    {getInitials()}
                  </span>
                )}
              </div>
              {/* Online dot */}
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"
                aria-label="Disponible"
                title="Disponible"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">
                {fullName}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1 capitalize ${badgeClass}`}
              >
                <Briefcase size={11} />
                {artisan.metier || "Artisan"}
              </span>
            </div>

            {/* Rating placeholder */}
            <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-semibold text-gray-600">4.8</span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex flex-col flex-grow">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">
              {artisan.address || "Localisation non précisée"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5 flex-grow">
            {artisan.description ||
              artisan.tariffs_description ||
              "Professionnel qualifié disponible pour vos projets."}
          </p>

          {/* Tarif */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Tarifs
            </span>
            <span className="font-bold text-gray-900 text-sm">
              {tariffMin} – {tariffMax}{" "}
              <span className="text-gray-400 font-normal">FCFA</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              }}
              aria-label={`Réserver ${fullName}`}
            >
              Réserver
            </button>
            <button
              onClick={() => navigate(`/artisan/${artisan.id}`)}
              className="w-11 flex items-center justify-center bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-xl transition-all"
              aria-label={`Voir le profil de ${fullName}`}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </article>

      {open && (
        <ReservationModal artisan={artisan} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default ArtisanCard;
