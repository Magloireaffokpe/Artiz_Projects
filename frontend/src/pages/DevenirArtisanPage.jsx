import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../services/api";

const METIERS = [
  { value: "plomberie", label: "Plomberie" },
  { value: "electricite", label: "Électricité" },
  { value: "menuiserie", label: "Menuiserie" },
  { value: "maconnerie", label: "Maçonnerie" },
  { value: "couture", label: "Couture" },
  { value: "mecanique", label: "Mécanique" },
  { value: "coiffure", label: "Coiffure" },
  { value: "peinture", label: "Peinture" },
  { value: "autre", label: "Autre" },
];

const STEPS = ["Compte", "Expertise", "Tarification", "Confirmation"];

const InputField = ({ label, icon, error, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div
      className={`flex items-center bg-gray-50 rounded-xl border transition-all ${error ? "border-red-300" : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"}`}
    >
      {icon && <span className="pl-4 text-gray-400 flex-shrink-0">{icon}</span>}
      {props.type === "select" ? (
        <select
          {...props}
          type={undefined}
          className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
        >
          <option value="">Sélectionner…</option>
          {METIERS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      ) : props.isTextarea ? (
        <textarea
          {...props}
          isTextarea={undefined}
          rows={4}
          className="w-full px-4 py-3 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

const DevenirArtisanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    metier: "",
    address: "",
    whatsapp_number: "",
    tariff_min: "",
    tariff_max: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!data.first_name.trim()) e.first_name = "Prénom requis";
      if (!data.last_name.trim()) e.last_name = "Nom requis";
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
        e.email = "Email invalide";
      if (!data.password || data.password.length < 6)
        e.password = "Min. 6 caractères";
      if (!data.phone.trim()) e.phone = "Téléphone requis";
    }
    if (step === 1) {
      if (!data.metier) e.metier = "Métier requis";
      if (!data.address.trim()) e.address = "Adresse requise";
    }
    if (step === 2) {
      if (!data.tariff_min || isNaN(data.tariff_min))
        e.tariff_min = "Tarif min requis";
      if (!data.tariff_max || isNaN(data.tariff_max))
        e.tariff_max = "Tarif max requis";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/register/artisan/", data);
      toast.success("Compte créé avec succès ! Connectez-vous maintenant.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === "object") {
        const first = Object.values(msg)[0];
        toast.error(Array.isArray(first) ? first[0] : first);
      } else {
        toast.error("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = [
    // Step 0 — Account
    <div className="space-y-5" key="s0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Prénom"
          icon={<User size={17} />}
          name="first_name"
          type="text"
          placeholder="Votre prénom"
          value={data.first_name}
          onChange={(e) => update("first_name", e.target.value)}
          error={errors.first_name}
          aria-required="true"
        />
        <InputField
          label="Nom"
          icon={<User size={17} />}
          name="last_name"
          type="text"
          placeholder="Votre nom"
          value={data.last_name}
          onChange={(e) => update("last_name", e.target.value)}
          error={errors.last_name}
          aria-required="true"
        />
      </div>
      <InputField
        label="Email"
        icon={<Mail size={17} />}
        name="email"
        type="email"
        placeholder="votre@email.com"
        value={data.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
        aria-required="true"
      />
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mot de passe
        </label>
        <div
          className={`flex items-center bg-gray-50 rounded-xl border transition-all ${errors.password ? "border-red-300" : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"}`}
        >
          <Lock size={17} className="ml-4 text-gray-400 flex-shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 caractères"
            value={data.password}
            onChange={(e) => update("password", e.target.value)}
            className="flex-1 px-4 py-3.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            aria-required="true"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="pr-4 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Masquer" : "Afficher"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
        )}
      </div>
      <InputField
        label="Téléphone"
        icon={<Phone size={17} />}
        name="phone"
        type="tel"
        placeholder="+229 …"
        value={data.phone}
        onChange={(e) => update("phone", e.target.value)}
        error={errors.phone}
        aria-required="true"
      />
    </div>,

    // Step 1 — Expertise
    <div className="space-y-5" key="s1">
      <InputField
        label="Votre métier principal"
        icon={<Briefcase size={17} />}
        type="select"
        value={data.metier}
        onChange={(e) => update("metier", e.target.value)}
        error={errors.metier}
        aria-required="true"
      />
      <InputField
        label="Adresse / Ville"
        icon={<MapPin size={17} />}
        name="address"
        type="text"
        placeholder="Cotonou, Akpakpa…"
        value={data.address}
        onChange={(e) => update("address", e.target.value)}
        error={errors.address}
        aria-required="true"
      />
      <InputField
        label="Numéro WhatsApp (optionnel)"
        icon={<Phone size={17} />}
        name="whatsapp_number"
        type="tel"
        placeholder="+229 …"
        value={data.whatsapp_number}
        onChange={(e) => update("whatsapp_number", e.target.value)}
      />
      <InputField
        label="Décrivez votre activité"
        icon={<FileText size={17} />}
        name="description"
        isTextarea
        placeholder="Parlez de votre expérience, vos spécialités, votre zone d'intervention…"
        value={data.description}
        onChange={(e) => update("description", e.target.value)}
      />
    </div>,

    // Step 2 — Tariffs
    <div className="space-y-6" key="s2">
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <p className="text-indigo-700 text-sm font-medium">
          💡 Indiquez une fourchette de tarifs pour attirer plus de clients.
          Vous pourrez les modifier à tout moment.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Tarif minimum (FCFA)"
          icon={<DollarSign size={17} />}
          name="tariff_min"
          type="number"
          placeholder="5000"
          value={data.tariff_min}
          onChange={(e) => update("tariff_min", e.target.value)}
          error={errors.tariff_min}
          aria-required="true"
        />
        <InputField
          label="Tarif maximum (FCFA)"
          icon={<DollarSign size={17} />}
          name="tariff_max"
          type="number"
          placeholder="50000"
          value={data.tariff_max}
          onChange={(e) => update("tariff_max", e.target.value)}
          error={errors.tariff_max}
          aria-required="true"
        />
      </div>
    </div>,

    // Step 3 — Confirm
    <div className="space-y-6" key="s3">
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          Tout est prêt !
        </h3>
        <p className="text-gray-500">
          Vérifiez vos informations avant de créer votre compte.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3 text-sm">
        {[
          ["Nom", `${data.first_name} ${data.last_name}`],
          ["Email", data.email],
          ["Téléphone", data.phone],
          ["Métier", data.metier],
          ["Adresse", data.address],
          [
            "Tarifs",
            data.tariff_min && data.tariff_max
              ? `${Number(data.tariff_min).toLocaleString()} – ${Number(data.tariff_max).toLocaleString()} FCFA`
              : "Non renseigné",
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-start gap-4">
            <span className="text-gray-400 font-medium flex-shrink-0">
              {label}
            </span>
            <span className="text-gray-800 font-semibold text-right capitalize">
              {value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <>
      <Helmet>
        <title>Devenir artisan partenaire – Artiz</title>
        <meta
          name="description"
          content="Rejoignez le réseau Artiz et développez votre activité d'artisan au Bénin. Inscription gratuite, visibilité immédiate."
        />
      </Helmet>

      <main
        className="min-h-screen bg-gray-50 py-16 px-4"
        aria-label="Inscription artisan"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3">
              Rejoignez Artiz
            </h1>
            <p className="text-gray-500 text-lg">
              Créez votre profil gratuit et commencez à recevoir des clients dès
              aujourd'hui.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-10 px-2">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i < step ? "bg-emerald-500 text-white" : i === step ? "text-white shadow-lg shadow-indigo-200" : "bg-gray-200 text-gray-400"}`}
                    style={
                      i === step
                        ? {
                            background:
                              "linear-gradient(135deg, #6366f1, #7c3aed)",
                          }
                        : {}
                    }
                  >
                    {i < step ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${i === step ? "text-indigo-600" : "text-gray-400"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${i < step ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div
              className="h-1"
              style={{
                background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
              }}
            />

            <div className="p-8 md:p-10">
              <h2 className="text-xl font-black text-gray-900 mb-8">
                {STEPS[step]}
              </h2>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepContent[step]}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-3 mt-10">
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft size={18} /> Retour
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-xl hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    }}
                  >
                    Continuer <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-xl hover:shadow-emerald-200 ${isSubmitting ? "opacity-70 cursor-wait" : "hover:scale-[1.02] active:scale-[0.98]"}`}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                    }}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Création du compte…"
                    ) : (
                      <>
                        <CheckCircle size={18} /> Créer mon compte
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trust note */}
          <div className="flex items-center gap-2 justify-center mt-6 text-gray-400 text-xs">
            <Shield size={13} />
            <span>
              Inscription gratuite – Aucune commission sur vos revenus
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default DevenirArtisanPage;
