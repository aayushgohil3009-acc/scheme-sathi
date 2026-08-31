import { useEffect, useState, Suspense, lazy } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Login from "./Pages/Login";
import { onAuthStateChanged, logoutUser } from "./firebase/auth";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const SchemeMatcher = lazy(() => import("./Pages/SchemeMatcher"));
const Calculator = lazy(() => import("./Pages/Calculator"));
const Partners = lazy(() => import("./Pages/Partners"));
const Profile = lazy(() => import("./Pages/Profile"));
const Applications = lazy(() => import("./Pages/Applications"));
const SchemeDetails = lazy(() => import("./Pages/SchemeDetails"));

// Loading component for lazy pages
const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
      <p>Loading...</p>
    </div>
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
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return <div className="auth-loading">Loading...</div>;
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
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setSelectedScheme(null);
        }}
      />

      <div className="main-area">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;