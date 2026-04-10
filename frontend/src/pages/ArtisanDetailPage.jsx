import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  DollarSign,
  ArrowLeft,
  Star,
  FileText,
  CheckCircle,
  Phone,
  Shield,
  Clock,
} from "lucide-react";
import ReservationModal from "../components/ReservationModal";
import apiClient from "../services/api";

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const { data } = await apiClient.get(`/artisans/${id}/`);
        setArtisan(data);
      } catch {
        setError("Impossible de charger le profil de cet artisan.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [id]);

  if (loading)
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center"
        aria-label="Chargement"
      >
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );

  if (error || !artisan)
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center bg-red-50 p-10 rounded-3xl border border-red-100 max-w-md">
          <p className="text-red-600 font-semibold text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Retour aux résultats
          </button>
        </div>
      </div>
    );

  const fullName =
    `${artisan.user?.first_name || ""} ${artisan.user?.last_name || ""}`.trim() ||
    "Artisan";
  const tariffMin = artisan.tariff_min
    ? Number(artisan.tariff_min).toLocaleString("fr-FR")
    : null;
  const tariffMax = artisan.tariff_max
    ? Number(artisan.tariff_max).toLocaleString("fr-FR")
    : null;

  // Schema.org LocalBusiness structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: fullName,
    description: artisan.description || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: artisan.address || "",
      addressCountry: "BJ",
    },
    telephone: artisan.whatsapp_number || "",
    priceRange:
      tariffMin && tariffMax ? `${tariffMin} – ${tariffMax} FCFA` : "",
    image: artisan.profile_picture || "",
  };

  return (
    <>
      <Helmet>
        <title>
          {fullName} – Artisan {artisan.metier ? `en ${artisan.metier}` : ""} |
          Artiz
        </title>
        <meta
          name="description"
          content={`Contactez ${fullName}, artisan spécialisé en ${artisan.metier || "services"} à ${artisan.address || "Bénin"}. Tarifs : ${tariffMin || "N/A"} – ${tariffMax || "N/A"} FCFA.`}
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <main className="min-h-screen bg-gray-50 pb-16">
        {/* Back */}
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors font-medium mb-8 group"
            aria-label="Retour aux résultats de recherche"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Retour aux résultats
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT — Profile card */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-80 flex-shrink-0"
              aria-label="Profil de l'artisan"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                {/* Cover gradient */}
                <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600" />

                <div className="px-8 pb-8 -mt-12">
                  {/* Avatar */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl mx-auto mb-4">
                    {artisan.profile_picture ? (
                      <img
                        src={artisan.profile_picture}
                        alt={`Photo de ${fullName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-600 bg-indigo-50">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"
                      title="Disponible"
                    />
                  </div>

                  <div className="text-center mb-6">
                    <h1 className="text-xl font-black text-gray-900">
                      {fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 capitalize">
                      <Briefcase size={13} /> {artisan.metier || "Artisan"}
                    </span>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i <= 4
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        4.8 (12 avis)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReservation(true)}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:shadow-xl hover:shadow-indigo-200 hover:scale-105 active:scale-95 mb-6"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    }}
                    aria-label={`Contacter ${fullName}`}
                  >
                    Demander un service
                  </button>

                  {/* Info list */}
                  <ul className="space-y-3 text-sm border-t border-gray-100 pt-6">
                    {artisan.address && (
                      <li className="flex items-start gap-3 text-gray-600">
                        <MapPin
                          size={16}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <span>{artisan.address}</span>
                      </li>
                    )}
                    {tariffMin && tariffMax && (
                      <li className="flex items-start gap-3 text-gray-600">
                        <DollarSign
                          size={16}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          {tariffMin} – {tariffMax} FCFA
                        </span>
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-gray-600">
                      <Shield
                        size={16}
                        className="text-emerald-500 flex-shrink-0"
                      />
                      <span className="text-emerald-700 font-medium">
                        Profil vérifié
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                      <Clock
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>Répond en moins de 24h</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.aside>

            {/* RIGHT — Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-6"
            >
              {/* About */}
              <section
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
                aria-labelledby="about-heading"
              >
                <h2
                  id="about-heading"
                  className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"
                >
                  <FileText size={20} className="text-indigo-600" /> À propos
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {artisan.description ||
                    "Cet artisan n'a pas encore rédigé de description. Contactez-le directement pour en savoir plus sur ses compétences et services."}
                </p>
              </section>

              {/* Pricing */}
              <section
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
                aria-labelledby="pricing-heading"
              >
                <h2
                  id="pricing-heading"
                  className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"
                >
                  <DollarSign size={20} className="text-emerald-600" />{" "}
                  Tarification
                </h2>

                {tariffMin && tariffMax ? (
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                        Fourchette estimée
                      </p>
                      <p className="text-2xl font-black text-emerald-800">
                        {tariffMin} – {tariffMax}{" "}
                        <span className="text-base font-normal text-emerald-600">
                          FCFA
                        </span>
                      </p>
                    </div>
                    <CheckCircle
                      className="ml-auto text-emerald-500 flex-shrink-0"
                      size={28}
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 italic mb-4">
                    Tarif non renseigné. Contactez l'artisan pour un devis.
                  </p>
                )}

                {artisan.tariffs_description && (
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-2 text-sm">
                      Détails
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {artisan.tariffs_description}
                    </p>
                  </div>
                )}
              </section>

              {/* Trust badges */}
              <section
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
                aria-labelledby="trust-heading"
              >
                <h2
                  id="trust-heading"
                  className="text-lg font-black text-gray-900 mb-6"
                >
                  Garanties Artiz
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Shield size={20} className="text-indigo-600" />,
                      label: "Profil vérifié",
                      desc: "Identité et compétences contrôlées",
                    },
                    {
                      icon: <Star size={20} className="text-amber-500" />,
                      label: "Évalué par les clients",
                      desc: "Avis authentiques de vraies personnes",
                    },
                    {
                      icon: <Clock size={20} className="text-emerald-600" />,
                      label: "Réponse rapide",
                      desc: "Délai moyen de 24h",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <div className="mb-2">{item.icon}</div>
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        {item.label}
                      </p>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>

        {showReservation && (
          <ReservationModal
            artisan={artisan}
            onClose={() => setShowReservation(false)}
          />
        )}
      </main>
    </>
  );
};

export default ArtisanDetailPage;
