import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    try {
      const data = await login({
        email: form.email.value,
        password: form.password.value,
      });
      const { access, is_artisan, artisan_id, first_name } = data;
      if (!access) throw new Error("Token manquant");

      // Persist auth state for Header
      if (first_name) localStorage.setItem("first_name", first_name);
      if (is_artisan) localStorage.setItem("is_artisan", "true");
      if (artisan_id) localStorage.setItem("artisan_id", artisan_id);

      toast.success(`Bienvenue ${first_name || ""} !`);
      navigate(
        is_artisan && artisan_id ? `/dashboard/artisan/${artisan_id}` : "/",
      );
    } catch (e) {
      toast.error(
        e.response?.data?.detail || "Identifiants incorrects. Réessayez.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion – Artiz</title>
        <meta
          name="description"
          content="Connectez-vous à votre compte Artiz pour gérer vos réservations et votre profil artisan."
        />
      </Helmet>

      <main
        className="min-h-[88vh] flex items-center justify-center px-4 py-16 bg-gray-50"
        aria-label="Connexion"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top gradient bar */}
            <div
              className="h-2"
              style={{
                background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
              }}
            />

            <div className="p-10">
              {/* Logo */}
              <div className="text-center mb-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl mx-auto mb-5"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  }}
                  aria-hidden="true"
                >
                  AT
                </div>
                <h1 className="text-3xl font-black text-gray-900">
                  Bon retour !
                </h1>
                <p className="text-gray-400 mt-2 text-sm">
                  Connectez-vous pour accéder à votre espace.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="votre@email.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white outline-none transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all hover:shadow-xl hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  }}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Connexion…" : "Se connecter"}{" "}
                  {!isSubmitting && <LogIn size={18} />}
                </button>
              </form>

              {/* Trust note */}
              <div className="flex items-center gap-2 justify-center mt-6 text-gray-400 text-xs">
                <Shield size={13} />
                <span>Connexion sécurisée – vos données sont protégées</span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte artisan ?{" "}
            <Link
              to="/devenir-artisan"
              className="font-bold text-indigo-600 hover:underline"
            >
              Inscrivez-vous gratuitement
            </Link>
          </p>
        </motion.div>
      </main>
    </>
  );
};

export default LoginPage;
