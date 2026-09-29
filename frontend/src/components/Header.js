import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const venueTypes = [
  { value: "banquet-hall", label: "Banquet Halls", icon: "fa-building" },
  { value: "marriage-lawn", label: "Marriage Lawns", icon: "fa-tree" },
  { value: "hotel", label: "Luxury Hotels", icon: "fa-hotel" },
  { value: "destination", label: "Destination Venues", icon: "fa-umbrella-beach" },
];

const cities = ["Lucknow", "Kanpur", "Agra", "Jaipur", "Udaipur", "Goa"];

const vendorCategories = [
  { value: "photography", label: "Photographers", icon: "fa-camera" },
  { value: "videography", label: "Videographers", icon: "fa-video" },
  { value: "makeup", label: "Bridal Makeup", icon: "fa-palette" },
  { value: "mehndi", label: "Mehndi Artists", icon: "fa-hand-sparkles" },
  { value: "catering", label: "Caterers", icon: "fa-utensils" },
  { value: "decoration", label: "Decorators", icon: "fa-ring" },
  { value: "music", label: "DJ & Music", icon: "fa-music" },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null); // "venues" | "vendors" | "city" | "account"
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const headerRef = useRef(null);

  const currentCity =
    location.pathname === "/venues"
      ? new URLSearchParams(location.search).get("city")
      : null;

  // Close every menu on navigation
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname, location.search]);

  // Close desktop dropdowns on outside click or Escape
  useEffect(() => {
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Hover opens on desktop; click toggles for touch and keyboard users
  const menuProps = (name) => ({
    onMouseEnter: () => setOpenMenu(name),
    onMouseLeave: () => setOpenMenu(null),
  });
  const triggerProps = (name) => ({
    type: "button",
    "aria-expanded": openMenu === name,
    "aria-haspopup": "true",
    onClick: () => setOpenMenu(openMenu === name ? null : name),
  });

  const toggleMobileSection = (name) =>
    setMobileSection(mobileSection === name ? null : name);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container main-bar">
        <Link to="/" className="brand" aria-label="Blissful Weddings home">
          <i className="fas fa-heart"></i>
          <span>
            Blissful<em>Weddings</em>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Main">
          <div className="nav-item" {...menuProps("venues")}>
            <button className="nav-trigger" {...triggerProps("venues")}>
              Venues <i className="fas fa-chevron-down"></i>
            </button>
            {openMenu === "venues" && (
              <div className="dropdown mega">
                <div className="dropdown-col">
                  <p className="dropdown-heading">By type</p>
                  {venueTypes.map((t) => (
                    <Link key={t.value} to={`/venues?type=${t.value}`}>
                      <i className={`fas ${t.icon}`}></i>
                      {t.label}
                    </Link>
                  ))}
                </div>
                <div className="dropdown-col">
                  <p className="dropdown-heading">By city</p>
                  {cities.map((c) => (
                    <Link key={c} to={`/venues?city=${c}`}>
                      {c}
                    </Link>
                  ))}
                </div>
                <Link to="/venues" className="dropdown-footer">
                  View all venues <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>

          <div className="nav-item" {...menuProps("vendors")}>
            <button className="nav-trigger" {...triggerProps("vendors")}>
              Vendors <i className="fas fa-chevron-down"></i>
            </button>
            {openMenu === "vendors" && (
              <div className="dropdown">
                <div className="dropdown-col">
                  {vendorCategories.map((v) => (
                    <Link key={v.value} to={`/services?category=${v.value}`}>
                      <i className={`fas ${v.icon}`}></i>
                      {v.label}
                    </Link>
                  ))}
                </div>
                <Link to="/services" className="dropdown-footer">
                  All vendors <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/package-builder" className="nav-link">
            Package Builder
          </NavLink>
        </nav>

        <div className="header-actions">
          <div className="nav-item" {...menuProps("city")}>
            <button className="city-trigger" {...triggerProps("city")}>
              <i className="fas fa-map-marker-alt"></i>
              {currentCity || "All cities"}
              <i className="fas fa-chevron-down"></i>
            </button>
            {openMenu === "city" && (
              <div className="dropdown dropdown-right">
                <div className="dropdown-col">
                  <Link to="/venues">All cities</Link>
                  {cities.map((c) => (
                    <Link
                      key={c}
                      to={`/venues?city=${c}`}
                      className={currentCity === c ? "is-active" : ""}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="nav-item" {...menuProps("account")}>
              <button className="account-trigger" {...triggerProps("account")}>
                <span className="avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <i className="fas fa-chevron-down"></i>
              </button>
              {openMenu === "account" && (
                <div className="dropdown dropdown-right">
                  <div className="dropdown-col">
                    <p className="dropdown-heading">{user.name}</p>
                    <Link to="/profile">
                      <i className="fas fa-user"></i>Profile
                    </Link>
                    <Link to="/bookings">
                      <i className="fas fa-calendar-check"></i>My bookings
                    </Link>
                    <button type="button" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Log in
              </Link>
              <Link to="/register" className="signup-btn">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="menu-button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-panel">
          <button
            type="button"
            className="mobile-section-trigger"
            aria-expanded={mobileSection === "venues"}
            onClick={() => toggleMobileSection("venues")}
          >
            Venues
            <i className={`fas fa-chevron-${mobileSection === "venues" ? "up" : "down"}`}></i>
          </button>
          {mobileSection === "venues" && (
            <div className="mobile-sub">
              <Link to="/venues">All venues</Link>
              {venueTypes.map((t) => (
                <Link key={t.value} to={`/venues?type=${t.value}`}>
                  {t.label}
                </Link>
              ))}
              <p className="dropdown-heading">By city</p>
              <div className="mobile-chips">
                {cities.map((c) => (
                  <Link key={c} to={`/venues?city=${c}`}>
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="mobile-section-trigger"
            aria-expanded={mobileSection === "vendors"}
            onClick={() => toggleMobileSection("vendors")}
          >
            Vendors
            <i className={`fas fa-chevron-${mobileSection === "vendors" ? "up" : "down"}`}></i>
          </button>
          {mobileSection === "vendors" && (
            <div className="mobile-sub">
              <Link to="/services">All vendors</Link>
              {vendorCategories.map((v) => (
                <Link key={v.value} to={`/services?category=${v.value}`}>
                  {v.label}
                </Link>
              ))}
            </div>
          )}

          <Link to="/about" className="mobile-link">
            About Us
          </Link>
          <Link to="/contact" className="mobile-link">
            Contact
          </Link>
          <Link to="/package-builder" className="mobile-link">
            Package Builder
          </Link>

          <div className="mobile-account">
            {user ? (
              <>
                <Link to="/profile" className="mobile-link">
                  Profile
                </Link>
                <Link to="/bookings" className="mobile-link">
                  My bookings
                </Link>
                <button type="button" className="login-link" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-link">
                  Log in
                </Link>
                <Link to="/register" className="signup-btn">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
