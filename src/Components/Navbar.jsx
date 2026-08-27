function Navbar({ onLogout }) {
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
            A
          </div>

          <div>
            <strong>Aayush</strong>
            <small>Entrepreneur</small>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;