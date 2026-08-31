import { useEffect, useState, Suspense, lazy } from "react";
import Login from "./Pages/Login";
import { onAuthStateChanged, logoutUser } from "./firebase/auth";

// Lazy load components for better performance
const Navbar = lazy(() => import("./Components/Navbar"));
const Sidebar = lazy(() => import("./Components/Sidebar"));

// Lazy load pages
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const SchemeMatcher = lazy(() => import("./Pages/SchemeMatcher"));
const Calculator = lazy(() => import("./Pages/Calculator"));
const Partners = lazy(() => import("./Pages/Partners"));
const Profile = lazy(() => import("./Pages/Profile"));
const Applications = lazy(() => import("./Pages/Applications"));
const SchemeDetails = lazy(() => import("./Pages/SchemeDetails"));

const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "10px", animation: "spin 1s linear infinite" }}>⚡</div>
      <p style={{ fontSize: "16px", color: "#666" }}>Loading...</p>
    </div>
  </div>
);

const AuthLoadingScreen = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif"
  }}>
    <div style={{ textAlign: "center", color: "white" }}>
      <div style={{
        fontSize: "48px",
        marginBottom: "20px",
        animation: "pulse 2s ease-in-out infinite"
      }}>💼</div>
      <h1 style={{ fontSize: "24px", margin: "0 0 10px 0", fontWeight: "600" }}>Scheme Sathi</h1>
      <p style={{ fontSize: "14px", margin: "0", opacity: "0.9" }}>Finding the perfect scheme for you...</p>
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    // Fast path: Check localStorage cache first
    const cachedAuth = localStorage.getItem("scheme_sathi_auth_cache");
    if (cachedAuth) {
      try {
        const parsed = JSON.parse(cachedAuth);
        if (parsed && parsed.uid) {
          setUser(parsed);
          // Still verify with Firebase in background
          setAuthLoading(false);
        }
      } catch (e) {
        console.log("Cache parse error:", e);
      }
    }

    // Verify with Firebase
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      // Cache the auth state for fast next load
      if (currentUser) {
        localStorage.setItem(
          "scheme_sathi_auth_cache",
          JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          })
        );
      } else {
        localStorage.removeItem("scheme_sathi_auth_cache");
      }
      
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    if (selectedScheme) {
      return (
        <Suspense fallback={<PageLoader />}>
          <SchemeDetails
            scheme={selectedScheme}
            onBack={() => setSelectedScheme(null)}
          />
        </Suspense>
      );
    }

    switch (activePage) {
      case "Dashboard":
        return (
          <Suspense fallback={<PageLoader />}>
            <Dashboard
              user={user}
              onViewScheme={setSelectedScheme}
              onNavigate={setActivePage}
            />
          </Suspense>
        );
      case "Scheme Matcher":
        return (
          <Suspense fallback={<PageLoader />}>
            <SchemeMatcher user={user} />
          </Suspense>
        );
      case "Financial Calculator":
        return (
          <Suspense fallback={<PageLoader />}>
            <Calculator />
          </Suspense>
        );
      case "Channel Partners":
        return (
          <Suspense fallback={<PageLoader />}>
            <Partners user={user} />
          </Suspense>
        );
      case "Applications":
        return (
          <Suspense fallback={<PageLoader />}>
            <Applications user={user} />
          </Suspense>
        );
      case "Profile":
        return (
          <Suspense fallback={<PageLoader />}>
            <Profile user={user} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<PageLoader />}>
            <Dashboard
              user={user}
              onViewScheme={setSelectedScheme}
              onNavigate={setActivePage}
            />
          </Suspense>
        );
    }
  };

  return (
    <div className="app">
      <Suspense fallback={null}>
        <Sidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedScheme(null);
          }}
        />
      </Suspense>

      <div className="main-area">
        <Suspense fallback={null}>
          <Navbar user={user} onLogout={handleLogout} />
        </Suspense>
        <main className="content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;