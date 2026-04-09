import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  User,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { createReservation } from "../services/reservationService";

const ReservationModal = ({ artisan, onClose }) => {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    address: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        address: formData.address,
        description: formData.description,
      };
      await createReservation(artisan.id, payload);
      toast.success("Demande envoyée avec succès !");
      setShowWhatsAppButton(true);
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Échec de l'envoi. Vérifiez vos informations.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (artisan.whatsapp_number) {
      const message = `Bonjour ${artisan.user?.first_name || ""}, je viens de la plateforme Artiz. J'ai besoin de vos services.`;
      const url = `https://wa.me/${artisan.whatsapp_number}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
    onClose();
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contacter {artisan.user?.first_name || "l'artisan"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {showWhatsAppButton
                  ? "Demande envoyée ! Souhaitez-vous contacter directement l'artisan ?"
                  : "Vos coordonnées nous permettent de vous recontacter."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          {!showWhatsAppButton ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    name="client_name"
                    type="text"
                    required
                    placeholder="Votre nom complet"
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    name="client_email"
                    type="email"
                    required
                    placeholder="Votre adresse email"
                    value={formData.client_email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    name="client_phone"
                    type="tel"
                    required
                    placeholder="Votre numéro de téléphone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    name="address"
                    type="text"
                    required
                    placeholder="Lieu d'intervention"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="relative">
                  <textarea
                    name="description"
                    placeholder="Décrivez votre besoin (optionnel)"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"}`}
                >
                  {isSubmitting ? "Envoi..." : "Envoyer la demande"}{" "}
                  {!isSubmitting && <Send size={18} />}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-green-700 font-medium">
                  Votre demande a bien été envoyée à l'artisan.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Vous pouvez aussi le contacter directement sur WhatsApp.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
                {artisan.whatsapp_number && (
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationModal;
