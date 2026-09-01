import { Component, Suspense, useEffect, useState } from "react";
import { BriefcaseBusiness, LoaderCircle } from "lucide-react";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import SchemeMatcher from "./Pages/SchemeMatcher";
import Calculator from "./Pages/Calculator";
import Partners from "./Pages/Partners";
import Profile from "./Pages/Profile";
import Applications from "./Pages/Applications";
import SchemeDetails from "./Pages/SchemeDetails";
import { onAuthStateChanged, logoutUser } from "./firebase/auth";

const PageLoader = () => <div className="app-loader"><LoaderCircle size={28} /><p>Loading workspace</p></div>;
const AuthLoadingScreen = () => <div className="auth-loading-screen"><BriefcaseBusiness size={30} /><h1>Scheme Sathi</h1><p>Preparing your workspace</p></div>;

class SectionErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false, errorMessage: "" }; }
  static getDerivedStateFromError(error) { return { failed: true, errorMessage: error?.message || "Unknown page error" }; }
  componentDidCatch(error) { console.error("Section render error:", error); }
  render() {
    if (this.state.failed) return <section className="section-error"><p className="eyebrow">Temporary issue</p><h2>This section could not load.</h2><p>Use the navigation to continue, or refresh this page.</p><details><summary>Technical details</summary><code>{this.state.errorMessage}</code></details><button className="primary-button" onClick={() => window.location.reload()}>Refresh page</button></section>;
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedScheme, setSelectedScheme] = useState(null);
  useEffect(() => {
    const cachedAuth = localStorage.getItem("scheme_sathi_auth_cache");
    if (cachedAuth) try { const parsed = JSON.parse(cachedAuth); if (parsed?.uid) { setUser(parsed); setAuthLoading(false); } } catch { localStorage.removeItem("scheme_sathi_auth_cache"); }
    return onAuthStateChanged((currentUser) => { setUser(currentUser); if (currentUser) localStorage.setItem("scheme_sathi_auth_cache", JSON.stringify({ uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, photoURL: currentUser.photoURL })); else localStorage.removeItem("scheme_sathi_auth_cache"); setAuthLoading(false); });
  }, []);

  const navigate = (page) => { setActivePage(page); setSelectedScheme(null); };
  if (authLoading) return <AuthLoadingScreen />;
  if (!user) return <SectionErrorBoundary><Login onLogin={setUser} splineSceneUrl={import.meta.env.VITE_SPLINE_SCENE_URL || ""} /></SectionErrorBoundary>;
  const content = selectedScheme ? <SchemeDetails scheme={selectedScheme} onBack={() => setSelectedScheme(null)} /> : activePage === "Dashboard" ? <Dashboard user={user} onViewScheme={setSelectedScheme} onNavigate={navigate} /> : activePage === "Scheme Matcher" ? <SchemeMatcher user={user} /> : activePage === "Financial Calculator" ? <Calculator /> : activePage === "Channel Partners" ? <Partners user={user} /> : activePage === "Applications" ? <Applications user={user} /> : <Profile user={user} />;

  return <div className="app"><Sidebar activePage={activePage} setActivePage={navigate} /><div className="main-area"><Navbar user={user} onLogout={async () => { await logoutUser(); setUser(null); }} /><main className="content"><SectionErrorBoundary><Suspense fallback={<PageLoader />}>{content}</Suspense></SectionErrorBoundary></main></div></div>;
}

export default App;
