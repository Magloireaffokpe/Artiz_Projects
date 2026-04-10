import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    // Read auth state from localStorage
    const access = localStorage.getItem("access");
    const isArtisan = localStorage.getItem("is_artisan") === "true";
    const artisanId = localStorage.getItem("artisan_id");
    const firstName = localStorage.getItem("first_name") || "";
    if (access) setUser({ isArtisan, artisanId, firstName });
    else setUser(null);
  }, [location]);

  const handleLogout = () => {
    ["access", "refresh", "is_artisan", "artisan_id", "first_name"].forEach(
      (k) => localStorage.removeItem(k),
    );
    setUser(null);
    navigate("/");
  };

  const transparent = isHome && !isScrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? "py-5"
          : "py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Artiz – Accueil"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            AT
          </div>
          <span
            className={`text-2xl font-black tracking-tight transition-colors ${transparent ? "text-white" : "text-gray-900"}`}
          >
            Artiz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-2"
        >
          <Link
            to="/trouver-service"
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-all ${
              transparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Search size={17} /> Trouver un artisan
          </Link>
          <Link
            to="/devenir-artisan"
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-all ${
              transparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Briefcase size={17} /> Devenir Artisan
          </Link>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              {user.isArtisan && user.artisanId && (
                <Link
                  to={`/dashboard/artisan/${user.artisanId}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all"
                >
                  <LayoutDashboard size={17} />
                  {user.firstName ? user.firstName : "Dashboard"}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
                aria-label="Se déconnecter"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 ml-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all"
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              }}
            >
              <User size={17} /> Connexion
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${transparent ? "text-white" : "text-gray-900 hover:bg-gray-100"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl py-4 px-6 flex flex-col gap-2"
            role="navigation"
            aria-label="Menu mobile"
          >
            <Link
              to="/trouver-service"
              className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Search size={20} className="text-indigo-600" /> Trouver un
              artisan
            </Link>
            <Link
              to="/devenir-artisan"
              className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Briefcase size={20} className="text-indigo-600" /> Devenir
              Artisan
            </Link>
            {user ? (
              <>
                {user.isArtisan && user.artisanId && (
                  <Link
                    to={`/dashboard/artisan/${user.artisanId}`}
                    className="flex items-center gap-3 text-indigo-700 font-medium p-3 rounded-xl bg-indigo-50"
                  >
                    <LayoutDashboard size={20} /> Mon Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-600 font-medium p-3 rounded-xl hover:bg-red-50 text-left"
                >
                  <LogOut size={20} /> Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-white font-bold p-3 rounded-xl mt-2"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                }}
              >
                <User size={20} /> Se connecter
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
