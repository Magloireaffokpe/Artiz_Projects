import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DevenirArtisanPage from "./pages/DevenirArtisanPage";
import TrouverServicePage from "./pages/TrouverServicePage";
import ArtisanDetailPage from "./pages/ArtisanDetailPage";
import DashboardPage from "./DashboardPage";
import ProfileUpdatePage from "./components/ProfileUpdatePage";

const RequireAuth = ({ children }) => {
  const access = localStorage.getItem("access");
  if (!access) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Notifications Toaster Premium */}
        <Toaster position="top-center" reverseOrder={false} />

        <Header />

        {/* Ajout d'un padding-top pour compenser le header fixe */}
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/devenir-artisan" element={<DevenirArtisanPage />} />
            <Route path="/trouver-service" element={<TrouverServicePage />} />
            <Route path="/artisan/:id" element={<ArtisanDetailPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/profil/update"
              element={
                <RequireAuth>
                  <ProfileUpdatePage />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/artisan/:id"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
