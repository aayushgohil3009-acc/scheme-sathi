import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Login from "./Pages/Login";
import { onAuthStateChanged, logoutUser } from "./firebase/auth";

import Dashboard from "./Pages/Dashboard";
import SchemeMatcher from "./Pages/SchemeMatcher";
import Calculator from "./Pages/Calculator";
import Partners from "./Pages/Partners";
import Profile from "./Pages/Profile";
import Applications from "./Pages/Applications";
import SchemeDetails from "./Pages/SchemeDetails";

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
        <SchemeDetails
          scheme={selectedScheme}
          onBack={() => setSelectedScheme(null)}
        />
      );
    }

    switch (activePage) {
      case "Dashboard":
        return (
          <Dashboard
            user={user}
            onViewScheme={setSelectedScheme}
            onNavigate={setActivePage}
          />
        );
      case "Scheme Matcher":
        return <SchemeMatcher user={user} />;
      case "Financial Calculator":
        return <Calculator />;
      case "Channel Partners":
        return <Partners user={user} />;
      case "Applications":
        return <Applications user={user} />;
      case "Profile":
        return <Profile user={user} />;
      default:
        return (
          <Dashboard
            user={user}
            onViewScheme={setSelectedScheme}
            onNavigate={setActivePage}
          />
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