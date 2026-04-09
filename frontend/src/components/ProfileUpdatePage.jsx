import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../services/api";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";

// ============================================================
// Composant InputGroup déplacé en dehors et memoized
// ============================================================
const InputGroup = React.memo(
  ({
    label,
    name,
    type = "text",
    icon,
    isTextArea,
    options,
    value,
    onChange,
    accept,
  }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
              rows="3"
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
            />
          ) : options ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none"
            >
              <option value="">Sélectionner...</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : type === "file" ? (
            <input
              type="file"
              name={name}
              onChange={onChange}
              accept={accept}
              className="w-full pl-4 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 outline-none`}
            />
          )}
        </div>
      </div>
    );
  },
);

// ============================================================
// Composant principal
// ============================================================
const ProfileUpdatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    artisan_id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    description: "",
    tariff_min: "",
    tariff_max: "",
    address: "",
    metier: "",
    whatsapp_number: "",
    profile_picture: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await apiClient.get("/auth/me/");
        const userData = userResponse.data;

        if (!userData.is_artisan || !userData.artisan_id) {
          toast.error("Accès réservé aux artisans.");
          navigate("/");
          return;
        }

        const artisanResponse = await apiClient.get(
          `/artisans/${userData.artisan_id}/`,
        );
        const artisan = artisanResponse.data;

        setFormData({
          artisan_id: userData.artisan_id,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          description: artisan.description || "",
          tariff_min: artisan.tariff_min || "",
          tariff_max: artisan.tariff_max || "",
          address: artisan.address || "",
          metier: artisan.metier || "",
          whatsapp_number: artisan.whatsapp_number || "",
          profile_picture: null,
        });
      } catch (err) {
        console.error("Erreur chargement profil :", err);
        toast.error("Erreur lors du chargement de votre profil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "profile_picture" && formData[key]) {
        data.append(key, formData[key]);
      } else if (
        formData[key] !== null &&
        formData[key] !== "" &&
        key !== "artisan_id" &&
        key !== "profile_picture"
      ) {
        data.append(key, formData[key]);
      }
    });

    try {
      // Utiliser PATCH au lieu de PUT (évite 405)
      await apiClient.patch(`/artisans/${formData.artisan_id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profil mis à jour avec succès !");
      navigate(`/dashboard/artisan/${formData.artisan_id}`);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      toast.error("Échec de la mise à jour. Vérifiez vos données.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Retour au Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">
              Paramètres du profil
            </h1>
            <p className="text-gray-500 mt-1">
              Mettez à jour vos informations pour attirer plus de clients.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                Informations de contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Prénom"
                  name="first_name"
                  icon={<User size={18} />}
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Nom"
                  name="last_name"
                  icon={<User size={18} />}
                  value={formData.last_name}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Email"
                  name="email"
                  type="email"
                  icon={<Mail size={18} />}
                  value={formData.email}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Adresse / Ville"
                  name="address"
                  icon={<MapPin size={18} />}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section Expertise */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                Expertise & Présentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputGroup
                  label="Métier principal"
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
                />
                <InputGroup
                  label="Numéro WhatsApp"
                  name="whatsapp_number"
                  type="tel"
                  icon={<Phone size={18} />}
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                />
              </div>
              <InputGroup
                label="Photo de profil"
                name="profile_picture"
                type="file"
                icon={<ImageIcon size={18} />}
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="mt-6">
                <InputGroup
                  label="Description détaillée"
                  name="description"
                  isTextArea={true}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section Tarifs */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                Tarification (FCFA)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputGroup
                  label="Tarif minimum"
                  name="tariff_min"
                  type="number"
                  icon={<DollarSign size={18} />}
                  value={formData.tariff_min}
                  onChange={handleChange}
                />
                <InputGroup
                  label="Tarif maximum"
                  name="tariff_max"
                  type="number"
                  icon={<DollarSign size={18} />}
                  value={formData.tariff_max}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${isSaving ? "opacity-70 cursor-wait" : ""}`}
              >
                {isSaving
                  ? "Enregistrement..."
                  : "Sauvegarder les modifications"}{" "}
                <Save size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;
