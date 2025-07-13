import { useEffect, useState, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { checkAuthStatus } from "./redux/slices/authSlice";
import Test from "./pages/Test";
// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Booking = lazy(() => import("./pages/Booking"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminRooms = lazy(() => import("./pages/AdminRooms"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

// Route configuration
const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/rooms", element: <Rooms /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/contact", element: <Contact /> },
  { path: "/booking", element: <Booking /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/test", element: <Test /> },
  { path: "/admin-login", element: <AdminLogin /> },

  {
    path: "/profile",
    element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/admin/rooms",
    element: <ProtectedRoute requireAdmin={true}><AdminRooms /></ProtectedRoute>,
  },
  {
    path: "/admin/bookings",
    element: <ProtectedRoute requireAdmin={true}><AdminBookings /></ProtectedRoute>,
  },
  {
    path: "/admin/messages",
    element: <ProtectedRoute requireAdmin={true}><AdminMessages /></ProtectedRoute>,
  },
];

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { darkMode, rtl } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (authChecked) return; // Prevent multiple auth checks
      
      try {
        // Only check auth status if we have stored auth data
        if (isAuthenticated || user) {
          await dispatch(checkAuthStatus()).unwrap();
        }
        setAuthChecked(true);
      } catch (error) {
        // Handle error silently - this is expected when user is not logged in
        console.log("Auth check completed:", error.message);
        setAuthChecked(true);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Initialize AOS with better configuration
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
      offset: 50,
      easing: "ease-in-out",
    });
  }, [dispatch, authChecked]); // Add authChecked to dependencies

  useEffect(() => {
    // Apply RTL and dark mode to document
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.body.className = darkMode ? "dark-theme" : "light-theme";

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#1a1a1a" : "#ffffff");
    }
  }, [darkMode, rtl]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";
  const isProfileRoute = location.pathname === "/profile";
  const showNavAndFooter = !isAdminRoute && !isAuthRoute && !isProfileRoute;

  return (
    <ErrorBoundary>
      <div
        className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}>
        {showNavAndFooter && <Navbar />}
        <main className="main-content-wrapper">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location} key={location.pathname}>
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        {showNavAndFooter && <Footer />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={rtl}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
