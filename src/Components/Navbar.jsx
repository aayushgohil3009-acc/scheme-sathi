import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user }) {
  const userName = user.displayName || user.email?.split("@")[0] || "User";

  return (
    <header className="navbar">

      <div>
        <h2>Scheme Sathi</h2>
        <p>AI-powered scheme discovery platform</p>
      </div>

      <div className="navbar-right">

        <button className="language-btn">
          हिन्दी / English
        </button>

        <div className="notification">
          🔔
        </div>

        <div className="user-mini">
          <div className="avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{userName}</strong>
            <small>Entrepreneur</small>
          </div>
        </div>

        <button className="logout-btn" onClick={() => signOut(auth)}>
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;