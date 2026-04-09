import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "./services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Users,
  Clock,
  CheckCircle,
  LogOut,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {
  getReservations,
  updateReservationStatus,
} from "./services/reservationService";

const STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndReservations = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          toast.error("Veuillez vous connecter.");
          navigate("/login");
          return;
        }

        const userResponse = await apiClient.get("/auth/me/");
        const userData = userResponse.data;
        setUser(userData);

        const artisanId = Number(id);
        if (!userData.is_artisan || userData.artisan_id !== artisanId) {
          toast.error("Accès non autorisé.");
          navigate("/");
          return;
        }

        const reservationsData = await getReservations();
        const sortedData = (reservationsData || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 20);
        setReservations(sortedData);
      } catch (err) {
        console.error("Erreur Dashboard:", err);
        setError("Impossible de charger vos données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndReservations();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      toast.success(
        `Demande ${newStatus === STATUS.ACCEPTED ? "acceptée" : "refusée"} avec succès`,
      );
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: newStatus } : r,
        ),
      );
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Chargement de votre espace pro...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-3xl">
          <p className="text-red-600 font-medium text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary px-6 py-2 rounded-full"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalRequests = reservations.length;
  const pendingRequests = reservations.filter(
    (r) => r.status === STATUS.PENDING || !r.status,
  ).length;
  const handledRequests = totalRequests - pendingRequests;

  const statCards = [
    {
      title: "Total Demandes",
      value: totalRequests,
      icon: <Users size={24} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      title: "En Attente",
      value: pendingRequests,
      icon: <Clock size={24} className="text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      title: "Traitées",
      value: handledRequests,
      icon: <CheckCircle size={24} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Bonjour, {user?.first_name || user?.username}
            </h1>
            <p className="text-gray-500 mt-1">
              Voici le récapitulatif de votre activité.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profil/update")}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
            >
              <Edit3 size={18} /> Modifier profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <LogOut size={18} /> Quitter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">
              Demandes récentes
            </h2>
          </div>

          {reservations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Aucune demande pour l'instant
              </h3>
              <p className="text-gray-500">
                Dès qu'un client vous contactera, sa demande apparaîtra ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reservations.map((res, idx) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 md:p-8 hover:bg-gray-50 transition-colors flex flex-col lg:flex-row gap-6 justify-between"
                >
                  {/* Info Client avec nom complet et initiales */}
                  <div className="flex gap-5 items-start lg:w-1/3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                      {res.client_name
                        ? res.client_name.charAt(0).toUpperCase()
                        : "C"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {res.client_name || "Client"}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        {res.address || "Lieu non précisé"}
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div className="flex flex-col gap-2 lg:w-1/3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <span className="font-medium">
                        {res.client_phone || "Non renseigné"}
                      </span>
                      {res.client_phone && (
                        <button
                          onClick={() => {
                            const message = `Bonjour ${res.client_name || ""}, j'ai bien reçu votre demande du ${new Date(res.created_at).toLocaleDateString("fr-FR")}. Je vous recontacte dès que possible.`;
                            window.open(
                              `https://wa.me/${res.client_phone}?text=${encodeURIComponent(message)}`,
                              "_blank",
                            );
                          }}
                          className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full hover:bg-green-100 transition-colors"
                        >
                          WhatsApp
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <span>
                        {res.client_email ||
                          res.description?.substring(0, 60) ||
                          "Demande"}
                      </span>
                    </div>
                  </div>

                  {/* Statut et actions */}
                  <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-3 lg:w-1/4">
                    <div
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${!res.status || res.status === STATUS.PENDING ? "bg-amber-100 text-amber-700" : res.status === STATUS.ACCEPTED ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {res.status === STATUS.ACCEPTED
                        ? "Acceptée"
                        : res.status === STATUS.REJECTED
                          ? "Refusée"
                          : "En attente"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Calendar size={14} />
                      {res.created_at
                        ? new Date(res.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date inconnue"}
                    </div>
                    {(!res.status || res.status === STATUS.PENDING) && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleStatusChange(res.id, STATUS.ACCEPTED)
                          }
                          className="p-1 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200"
                          title="Accepter"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(res.id, STATUS.REJECTED)
                          }
                          className="p-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                          title="Refuser"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex items-center justify-end">
                    <button className="text-gray-300 hover:text-indigo-600 transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
