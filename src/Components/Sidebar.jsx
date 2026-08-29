function Sidebar({ activePage, setActivePage }) {

  const menuItems = [
    {
      name: "Dashboard",
      icon: "⌂"
    },
    {
      name: "Scheme Matcher",
      icon: "✦"
    },
    {
      name: "Financial Calculator",
      icon: "₹"
    },
    {
      name: "Channel Partners",
      icon: "⌖"
    },
    {
      name: "Applications",
      icon: "▣"
    },
    {
      name: "Profile",
      icon: "◉"
    }
  ];

  return (
    <aside className="sidebar">

      <div className="logo">

        <div className="logo-icon">
          S
        </div>

        <div>
          <h2>Scheme Sathi</h2>
          <span>Empowering Entrepreneurs</span>
        </div>

      </div>

      <div className="menu">

        <p className="menu-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (

          <button
            key={item.name}
            className={`menu-item ${
              activePage === item.name
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(item.name)
            }
          >

            <span className="menu-icon">
              {item.icon}
            </span>

            {item.name}

          </button>

        ))}

      </div>

      <div className="sidebar-bottom">

        <div className="help-card">

          <div className="help-icon">
            ?
          </div>

          <strong>Need Help?</strong>

          <p>
            Get assistance finding the right scheme.
          </p>

          <button>
            Contact Support
          </button>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;