import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import { auth } from "./firebase";

import Dashboard from "./pages/Dashboard";
import SchemeMatcher from "./pages/SchemeMatcher";
import Calculator from "./pages/Calculator";
import Partners from "./pages/Partners";
import Profile from "./pages/Profile";
import SchemeDetails from "./pages/SchemeDetails";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!user) {
    return <Login />;
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
        return <Dashboard onViewScheme={setSelectedScheme} />;
      case "Scheme Matcher":
        return <SchemeMatcher />;
      case "Financial Calculator":
        return <Calculator />;
      case "Channel Partners":
        return <Partners />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard onViewScheme={setSelectedScheme} />;
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
        <Navbar user={user} />
        <main className="content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;