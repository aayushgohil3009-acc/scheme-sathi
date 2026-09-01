import { lazy, Suspense, useEffect, useState } from "react";
import { BriefcaseBusiness, LoaderCircle } from "lucide-react";
import { onAuthStateChanged, logoutUser } from "./firebase/auth";

// Login (and its optional Spline scene) stays outside the authenticated app bundle.
const Login = lazy(() => import("./Pages/Login"));
const Navbar = lazy(() => import("./Components/Navbar"));
const Sidebar = lazy(() => import("./Components/Sidebar"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const SchemeMatcher = lazy(() => import("./Pages/SchemeMatcher"));
const Calculator = lazy(() => import("./Pages/Calculator"));
const Partners = lazy(() => import("./Pages/Partners"));
const Profile = lazy(() => import("./Pages/Profile"));
const Applications = lazy(() => import("./Pages/Applications"));
const SchemeDetails = lazy(() => import("./Pages/SchemeDetails"));

const PageLoader = () => <div className="app-loader"><LoaderCircle size={28} /><p>Loading workspace</p></div>;
const AuthLoadingScreen = () => <div className="auth-loading-screen"><BriefcaseBusiness size={30} /><h1>Scheme Sathi</h1><p>Preparing your workspace</p></div>;

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const handleLogin = (authenticatedUser) => setUser(authenticatedUser);
  const handleLogout = async () => { await logoutUser(); setUser(null); };

  useEffect(() => {
    const cachedAuth = localStorage.getItem("scheme_sathi_auth_cache");
    if (cachedAuth) try { const parsed = JSON.parse(cachedAuth); if (parsed?.uid) { setUser(parsed); setAuthLoading(false); } } catch (error) { console.log("Cache parse error:", error); }
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) localStorage.setItem("scheme_sathi_auth_cache", JSON.stringify({ uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, photoURL: currentUser.photoURL }));
      else localStorage.removeItem("scheme_sathi_auth_cache");
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (authLoading) return <AuthLoadingScreen />;
  if (!user) return <Suspense fallback={<AuthLoadingScreen />}><Login onLogin={handleLogin} splineSceneUrl={import.meta.env.VITE_SPLINE_SCENE_URL || ""} /></Suspense>;

  const pageProps = { user, onViewScheme: setSelectedScheme, onNavigate: setActivePage };
  const renderPage = () => {
    if (selectedScheme) return <Suspense fallback={<PageLoader />}><SchemeDetails scheme={selectedScheme} onBack={() => setSelectedScheme(null)} /></Suspense>;
    const Page = { "Dashboard": Dashboard, "Scheme Matcher": SchemeMatcher, "Financial Calculator": Calculator, "Channel Partners": Partners, "Applications": Applications, "Profile": Profile }[activePage] || Dashboard;
    return <Suspense fallback={<PageLoader />}>{activePage === "Dashboard" ? <Page {...pageProps} /> : activePage === "Scheme Matcher" || activePage === "Channel Partners" || activePage === "Applications" || activePage === "Profile" ? <Page user={user} /> : <Page />}</Suspense>;
  };

  return <div className="app"><Suspense fallback={null}><Sidebar activePage={activePage} setActivePage={(page) => { setActivePage(page); setSelectedScheme(null); }} /></Suspense><div className="main-area"><Suspense fallback={null}><Navbar user={user} onLogout={handleLogout} /></Suspense><main className="content">{renderPage()}</main></div></div>;
}

export default App;
