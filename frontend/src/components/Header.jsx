import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Search, User, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            AT
          </div>
          <span
            className={`text-2xl font-extrabold tracking-tight ${isScrolled || location.pathname !== "/" ? "text-gray-900" : "text-white"}`}
          >
            Artiz
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/trouver-service"
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors ${
              isScrolled || location.pathname !== "/"
                ? "text-gray-600 hover:bg-gray-100"
                : "text-white/90 hover:bg-white/20"
            }`}
          >
            <Search size={18} /> Trouver un artisan
          </Link>
          <Link
            to="/devenir-artisan"
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-colors ${
              isScrolled || location.pathname !== "/"
                ? "text-gray-600 hover:bg-gray-100"
                : "text-white/90 hover:bg-white/20"
            }`}
          >
            <Briefcase size={18} /> Devenir Artisan
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
          >
            <User size={18} /> Connexion
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 bg-white/50 p-2 rounded-lg backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-xl py-4 px-6 flex flex-col gap-4">
          <Link
            to="/trouver-service"
            className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-50"
          >
            <Search size={20} className="text-indigo-600" /> Trouver un service
          </Link>
          <Link
            to="/devenir-artisan"
            className="flex items-center gap-3 text-gray-700 font-medium p-3 rounded-lg hover:bg-gray-50"
          >
            <Briefcase size={20} className="text-indigo-600" /> Devenir Artisan
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg font-medium mt-2"
          >
            <User size={20} /> Se connecter
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
