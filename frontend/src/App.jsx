import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
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
  return access ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div
          className="min-h-screen bg-gray-50 text-gray-900"
          style={{
            fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontWeight: "600",
              },
              success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
            }}
          />

          <Header />

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
    </HelmetProvider>
  );
}

export default App;
