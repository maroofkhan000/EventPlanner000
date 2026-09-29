import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Blissful Weddings</h3>
            <p>
              Your one-stop solution for planning the perfect wedding. We bring
              together the best venues and services to make your special day
              unforgettable.
            </p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/venues">Venues</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/package-builder">Package Builder</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul className="footer-links">
              <li>
                <Link to="/services">Marriage Lawns</Link>
              </li>
              <li>
                <Link to="/services">Hotel Weddings</Link>
              </li>
              <li>
                <Link to="/venues?type=destination">Destination Weddings</Link>
              </li>
              <li>
                <Link to="/services">Makeup Artists</Link>
              </li>
              <li>
                <Link to="/services">Photography</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="footer-links">
              <li>
                <i className="fas fa-map-marker-alt"></i> 123 Wedding Street,
                Lucknow
              </li>
              <li>
                <i className="fas fa-phone"></i> +91 98765 43210
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@blissfulweddings.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Blissful Weddings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
