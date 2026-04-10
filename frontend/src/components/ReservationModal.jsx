import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { createReservation } from "../services/reservationService";

const Field = ({ icon, error, ...props }) => (
  <div>
    <div
      className={`relative flex items-center bg-gray-50 rounded-xl border transition-colors ${error ? "border-red-300 focus-within:border-red-400" : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"}`}
    >
      <span className="absolute left-3.5 text-gray-400" aria-hidden="true">
        {icon}
      </span>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

const ReservationModal = ({ artisan, onClose }) => {
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    address: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef(null);

  const fullName = `${artisan.user?.first_name || ""}`.trim() || "l'artisan";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const newErrors = {};
    if (!form.client_name.trim()) newErrors.client_name = "Nom requis";
    if (!form.client_email.trim() || !/\S+@\S+\.\S+/.test(form.client_email))
      newErrors.client_email = "Email invalide";
    if (!form.client_phone.trim()) newErrors.client_phone = "Téléphone requis";
    if (!form.address.trim()) newErrors.address = "Lieu d'intervention requis";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await createReservation(artisan.id, form);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Échec de l'envoi. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Bonjour ${fullName}, je vous contacte depuis Artiz. J'aimerais bénéficier de vos services.`;
    window.open(
      `https://wa.me/${artisan.whatsapp_number}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 outline-none"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-100">
            <div
              className="h-1 absolute top-0 left-0 right-0"
              style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
            />
            <div className="flex items-start justify-between mt-1">
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-black text-gray-900"
                >
                  {success ? "Demande envoyée !" : `Contacter ${fullName}`}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {success
                    ? "Votre demande a bien été transmise à l'artisan."
                    : "Remplissez le formulaire pour recevoir un devis rapide."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Fermer la fenêtre"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-3.5"
              noValidate
            >
              <Field
                icon={<User size={16} />}
                name="client_name"
                type="text"
                required
                placeholder="Votre nom complet"
                value={form.client_name}
                onChange={handleChange}
                error={errors.client_name}
                aria-label="Nom complet"
                aria-required="true"
              />
              <Field
                icon={<Mail size={16} />}
                name="client_email"
                type="email"
                required
                placeholder="votre@email.com"
                value={form.client_email}
                onChange={handleChange}
                error={errors.client_email}
                aria-label="Email"
                aria-required="true"
              />
              <Field
                icon={<Phone size={16} />}
                name="client_phone"
                type="tel"
                required
                placeholder="Numéro de téléphone"
                value={form.client_phone}
                onChange={handleChange}
                error={errors.client_phone}
                aria-label="Téléphone"
                aria-required="true"
              />
              <Field
                icon={<MapPin size={16} />}
                name="address"
                type="text"
                required
                placeholder="Lieu d'intervention"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                aria-label="Lieu d'intervention"
                aria-required="true"
              />
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="Décrivez votre besoin (optionnel)…"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-gray-50 outline-none text-sm text-gray-700 placeholder-gray-400 resize-none transition-colors"
                  aria-label="Description du besoin"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-sm transition-all ${isSubmitting ? "opacity-70 cursor-wait" : "hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"}`}
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  }}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    "Envoi…"
                  ) : (
                    <>
                      <Send size={16} /> Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  L'artisan a reçu votre demande. Vous pouvez aussi le contacter
                  directement via WhatsApp pour une réponse immédiate.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Fermer
                </button>
                {artisan.whatsapp_number && (
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm"
                  >
                    <MessageCircle size={16} /> WhatsApp
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
