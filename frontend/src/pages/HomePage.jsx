import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Wrench,
  Zap,
  Scissors,
  Hammer,
  Star,
  PaintRoller,
  BrickWall,
  ChefHat,
  Car,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

// --- MOCK DATA pour les services (en attendant l'API backend) ---
// Ces données peuvent être remplacées plus tard par un appel à votre API /api/services/
const mockServices = [
  {
    id: "plomberie",
    name: "Plomberie",
    icon: <Wrench size={24} />,
    color: "bg-blue-100 text-blue-600",
    description: "Installation, réparation et dépannage de canalisations",
    demandCount: 1247,
    rating: 4.8,
    imagePlaceholder: "🔧",
  },
  {
    id: "electricite",
    name: "Électricité",
    icon: <Zap size={24} />,
    color: "bg-yellow-100 text-yellow-600",
    description: "Câblage, tableau électrique, dépannage d'urgence",
    demandCount: 982,
    rating: 4.7,
    imagePlaceholder: "⚡",
  },
  {
    id: "couture",
    name: "Couture",
    icon: <Scissors size={24} />,
    color: "bg-pink-100 text-pink-600",
    description: "Confection, retouches et création sur mesure",
    demandCount: 2156,
    rating: 4.9,
    imagePlaceholder: "✂️",
  },
  {
    id: "menuiserie",
    name: "Menuiserie",
    icon: <Hammer size={24} />,
    color: "bg-amber-100 text-amber-600",
    description: "Meubles, agencement, pose de portes et fenêtres",
    demandCount: 873,
    rating: 4.6,
    imagePlaceholder: "🪵",
  },
  {
    id: "macconnerie",
    name: "Maçonnerie",
    icon: <BrickWall size={24} />,
    color: "bg-stone-100 text-stone-600",
    description: "Construction, crépissage, carrelage",
    demandCount: 1520,
    rating: 4.7,
    imagePlaceholder: "🧱",
  },
  {
    id: "peinture",
    name: "Peinture",
    icon: <PaintRoller size={24} />,
    color: "bg-purple-100 text-purple-600",
    description: "Peinture intérieure/extérieure, papier peint",
    demandCount: 634,
    rating: 4.5,
    imagePlaceholder: "🎨",
  },
  {
    id: "mecanique",
    name: "Mécanique",
    icon: <Car size={24} />,
    color: "bg-green-100 text-green-600",
    description: "Réparation auto/moto, vidange, diagnostic",
    demandCount: 1142,
    rating: 4.8,
    imagePlaceholder: "🚗",
  },
  {
    id: "coiffure",
    name: "Coiffure & Beauté",
    icon: <Scissors size={24} />,
    color: "bg-red-100 text-red-600",
    description: "Coupes, tresses, soins esthétiques",
    demandCount: 2460,
    rating: 4.9,
    imagePlaceholder: "💇",
  },
];

// Option supplémentaire "Autre"
const allServices = [
  ...mockServices,
  {
    id: "autre",
    name: "Autre service",
    icon: <Users size={24} />,
    color: "bg-gray-100 text-gray-600",
    description: "Vous ne trouvez pas ? Contactez-nous",
    demandCount: 0,
    rating: 0,
    imagePlaceholder: "🤝",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!serviceType && !location) {
      toast.error("Veuillez préciser un métier ou une ville.");
      return;
    }
    navigate("/trouver-service", { state: { serviceType, location } });
  };

  return (
    <div className="w-full">
      {/* Hero Section avec vraie image d'artisans en action */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900 mt-[-80px]">
        {/* Image de fond : artisans maçons sur un chantier */}
        <div
          className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-0" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8"
          >
            <Star className="text-yellow-400" size={16} fill="currentColor" />
            La 1ère plateforme d'artisans au Bénin
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
          >
            Trouvez le bon artisan,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              au bon moment.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12"
          >
            Connectez-vous avec les meilleurs professionnels locaux, vérifiés et
            évalués par la communauté.
          </motion.p>

          {/* Barre de recherche */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onSubmit={handleSearch}
            className="w-full max-w-4xl bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="text-gray-400 mr-3" size={20} />
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="">Quel service recherchez-vous ?</option>
                {allServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex items-center px-4 py-2 md:py-0">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Ville ou quartier (ex: Cotonou)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-gray-700 focus:outline-none placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl md:rounded-full font-bold transition-colors w-full md:w-auto shadow-lg hover:shadow-indigo-500/30"
            >
              Rechercher
            </button>
          </motion.form>
        </div>
      </section>

      {/* Section Services enrichie (avec mock data) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Nos services les plus demandés
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les métiers qui répondent le mieux aux besoins des
              Béninois. Des professionnels vérifiés et disponibles près de chez
              vous.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() =>
                  navigate("/trouver-service", {
                    state: { serviceType: service.id },
                  })
                }
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
              >
                <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative">
                  <div
                    className={`absolute inset-0 flex items-center justify-center text-5xl opacity-20 group-hover:opacity-30 transition-opacity`}
                  >
                    {service.imagePlaceholder}
                  </div>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color} z-10 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {service.icon}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-medium text-gray-700">
                        {service.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      📋 {service.demandCount.toLocaleString()} demandes
                    </span>
                    <span className="text-indigo-600 group-hover:underline">
                      Voir les pros →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message pour "Autre service" */}
          <div className="text-center mt-12">
            <button
              onClick={() =>
                navigate("/trouver-service", {
                  state: { serviceType: "autre" },
                })
              }
              className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-colors"
            >
              + Autres services disponibles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
