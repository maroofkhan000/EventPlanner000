import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-heart"></i>
            <div className="logo-text">
              Blissful<span>Weddings</span>
            </div>
          </Link>

          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/venues" onClick={() => setIsMenuOpen(false)}>
                Venues
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/destination" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/package-builder" onClick={() => setIsMenuOpen(false)}>
                Package Builder
              </Link>
            </li>
          </ul>

          <div className={`auth-buttons ${isMenuOpen ? "active" : ""}`}>
            {user ? (
              <div className="user-menu">
                <Link
                  to="/profile"
                  className="user-name"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user"></i>
                  {user.name}
                </Link>
                <Link
                  to="/bookings"
                  className="btn btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
