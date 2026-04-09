import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  MapPin,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { register } from "../services/authService";

// ============================================================
// COMPOSANT INPUT FIELD RÉUTILISABLE (memoized)
// ============================================================
const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    icon,
    placeholder,
    isTextArea,
    options,
    value,
    onChange,
    error,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    accept,
  }) => {
    const [localShowPassword, setLocalShowPassword] = useState(false);
    const [localShowConfirm, setLocalShowConfirm] = useState(false);

    const isPassword = name === "password";
    const isConfirm = name === "confirm_password";
    const show = isPassword
      ? (showPassword ?? localShowPassword)
      : (showConfirmPassword ?? localShowConfirm);

    const handleToggle = () => {
      if (isPassword) {
        if (setShowPassword) setShowPassword(!showPassword);
        else setLocalShowPassword(!localShowPassword);
      } else if (isConfirm) {
        if (setShowConfirmPassword)
          setShowConfirmPassword(!showConfirmPassword);
        else setLocalShowConfirm(!localShowConfirm);
      }
    };

    return (
      <div className="mb-5 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          {!isTextArea && !options && type !== "file" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          {isTextArea ? (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              rows="3"
              className={`w-full pl-4 pr-4 py-3 rounded-xl border ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              } transition-all bg-gray-50 focus:bg-white outline-none`}
            />
          ) : options ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              className={`w-full pl-4 pr-10 py-3 rounded-xl border ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              } transition-all bg-gray-50 focus:bg-white outline-none appearance-none`}
            >
              <option value="">Sélectionnez une option...</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : type === "file" ? (
            <input
              type="file"
              name={name}
              accept={accept}
              onChange={onChange}
              className={`w-full pl-4 pr-4 py-2 rounded-xl border ${
                error ? "border-red-500" : "border-gray-200"
              } transition-all bg-gray-50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`}
            />
          ) : (
            <input
              type={type === "number" ? "text" : type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              } transition-all bg-gray-50 focus:bg-white outline-none`}
            />
          )}

          {(isPassword || isConfirm) && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
        )}
      </div>
    );
  },
);

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const DevenirArtisanPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    metier: "",
    description: "",
    address: "",
    tariff_min: "",
    tariff_max: "",
    whatsapp_number: "",
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: "Identité", icon: <User size={18} /> },
    { id: 2, title: "Sécurité", icon: <Lock size={18} /> },
    { id: 3, title: "Profil Pro", icon: <Briefcase size={18} /> },
    { id: 4, title: "Tarifs", icon: <DollarSign size={18} /> },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (currentStep === 1) {
      if (!formData.first_name.trim())
        newErrors.first_name = "Le prénom est requis";
      if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
      if (!formData.email.trim() || !emailRegex.test(formData.email))
        newErrors.email = "Email invalide";
      if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    } else if (currentStep === 2) {
      if (formData.password.length < 6)
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères";
      if (formData.password !== formData.confirm_password)
        newErrors.confirm_password = "Les mots de passe ne correspondent pas";
    } else if (currentStep === 3) {
      if (!formData.metier)
        newErrors.metier = "Veuillez sélectionner un métier";
      if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
      if (!formData.whatsapp_number.trim())
        newErrors.whatsapp_number = "Le numéro WhatsApp est requis";
    } else if (currentStep === 4) {
      if (!formData.tariff_min) newErrors.tariff_min = "Tarif minimum requis";
      if (!formData.tariff_max) newErrors.tariff_max = "Tarif maximum requis";
      if (Number(formData.tariff_min) > Number(formData.tariff_max)) {
        newErrors.tariff_max = "Le tarif max doit être supérieur au min";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
    else toast.error("Veuillez corriger les erreurs avant de continuer.");
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      toast.error("Veuillez vérifier les champs du formulaire.");
      return;
    }

    setIsSubmitting(true);
    try {
      localStorage.removeItem("access");

      const submitData = new FormData();
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append("is_artisan", true);

      await register(submitData);

      toast.success("Compte artisan créé avec succès ! Connectez-vous.");
      navigate("/login");
    } catch (error) {
      console.error("Détails de l'erreur :", error.response?.data);
      toast.error(
        error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Rejoignez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Artiz
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Proposez vos services à des milliers de clients près de chez vous.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Stepper Header */}
          <div className="bg-gray-50/50 border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex flex-col items-center ${currentStep >= step.id ? "text-indigo-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                        currentStep > step.id
                          ? "bg-indigo-600 text-white"
                          : currentStep === step.id
                            ? "bg-indigo-100 border-2 border-indigo-600"
                            : "bg-gray-100"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle size={20} />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        currentStep > step.id ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Étape 1 : Identité */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Informations Personnelles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Prénom"
                        name="first_name"
                        icon={<User size={18} />}
                        placeholder="Ex: Jean"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                      />
                      <InputField
                        label="Nom"
                        name="last_name"
                        icon={<User size={18} />}
                        placeholder="Ex: Dupont"
                        value={formData.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                      />
                    </div>
                    <InputField
                      label="Adresse Email"
                      name="email"
                      type="email"
                      icon={<Mail size={18} />}
                      placeholder="jean@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <InputField
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      icon={<Phone size={18} />}
                      placeholder="+229 XX XX XX XX"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                    />
                  </div>
                )}

                {/* Étape 2 : Sécurité */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Sécurité de votre compte
                    </h3>
                    <InputField
                      label="Mot de passe"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      icon={<Lock size={18} />}
                      placeholder="Minimum 6 caractères"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                    <InputField
                      label="Confirmer le mot de passe"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      icon={<Lock size={18} />}
                      placeholder="Retapez votre mot de passe"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      error={errors.confirm_password}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                    />
                  </div>
                )}

                {/* Étape 3 : Profil Pro */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Votre Expertise
                    </h3>
                    <InputField
                      label="Domaine d'expertise (Métier)"
                      name="metier"
                      options={[
                        { value: "plomberie", label: "Plomberie" },
                        { value: "electricite", label: "Électricité" },
                        { value: "menuiserie", label: "Menuiserie" },
                        { value: "couture", label: "Couture" },
                        { value: "mecanique", label: "Mécanique" },
                        { value: "coiffure", label: "Coiffure" },
                        { value: "autre", label: "Autre" },
                      ]}
                      value={formData.metier}
                      onChange={handleChange}
                      error={errors.metier}
                    />
                    <InputField
                      label="Adresse / Ville"
                      name="address"
                      icon={<MapPin size={18} />}
                      placeholder="Ex: Cotonou, Haie Vive"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                    />
                    <InputField
                      label="Numéro WhatsApp"
                      name="whatsapp_number"
                      type="tel"
                      icon={<Phone size={18} />}
                      placeholder="+229 XX XX XX XX"
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      error={errors.whatsapp_number}
                    />
                    <InputField
                      label="Photo de profil (optionnelle)"
                      name="profile_picture"
                      type="file"
                      accept="image/*"
                      icon={<ImageIcon size={18} />}
                      onChange={handleChange}
                      error={errors.profile_picture}
                    />
                    <InputField
                      label="Description de vos services"
                      name="description"
                      isTextArea={true}
                      placeholder="Décrivez votre expérience et ce qui vous démarque..."
                      value={formData.description}
                      onChange={handleChange}
                      error={errors.description}
                    />
                  </div>
                )}

                {/* Étape 4 : Tarifs */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Votre Tarification
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Tarif Min (FCFA)"
                        name="tariff_min"
                        type="number"
                        icon={<DollarSign size={18} />}
                        placeholder="5000"
                        value={formData.tariff_min}
                        onChange={handleChange}
                        error={errors.tariff_min}
                      />
                      <InputField
                        label="Tarif Max (FCFA)"
                        name="tariff_max"
                        type="number"
                        icon={<DollarSign size={18} />}
                        placeholder="50000"
                        value={formData.tariff_max}
                        onChange={handleChange}
                        error={errors.tariff_max}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentStep === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={20} /> Retour
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Suivant <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                    isSubmitting ? "opacity-70 cursor-wait" : ""
                  }`}
                >
                  {isSubmitting
                    ? "Création en cours..."
                    : "Terminer l'inscription"}{" "}
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DevenirArtisanPage;
