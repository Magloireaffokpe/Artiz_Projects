import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.target;
    const payload = {
      email: form.elements.email.value,
      password: form.elements.password.value,
    };

    try {
      const data = await login(payload); // ← data = { access, refresh, is_artisan, artisan_id }
      console.log("Données reçues :", data);

      const { access, is_artisan, artisan_id } = data;

      if (!access) {
        throw new Error("Le token d'accès est manquant");
      }

      // Les tokens sont déjà stockés dans login() (authService)
      toast.success("Connexion réussie !");

      if (is_artisan && artisan_id) {
        navigate(`/dashboard/artisan/${artisan_id}`);
      } else {
        navigate("/");
      }
    } catch (e) {
      console.error("Erreur connexion :", e);
      toast.error(
        e.response?.data?.detail ||
          "Identifiants incorrects. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-6">
            AT
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Bon retour !
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous pour gérer votre activité ou vos réservations.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
          >
            {isSubmitting ? "Connexion..." : "Se connecter"} <LogIn size={20} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte artisan ?{" "}
          <Link
            to="/devenir-artisan"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Inscrivez-vous ici
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
