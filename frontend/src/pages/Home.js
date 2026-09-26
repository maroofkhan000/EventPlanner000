import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVenues = async () => {
      try {
        const response = await axios.get("/venues?limit=3");
        setFeaturedVenues(response.data.venues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVenues();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Plan Your Perfect Wedding With Ease</h1>
            <p>
              Everything you need for your special day - venues, catering,
              makeup, photography, and more - all in one place.
            </p>
            <div className="hero-buttons">
              <Link to="/package-builder" className="btn btn-primary">
                Build Your Package
              </Link>
              <Link to="/venues" className="btn btn-secondary">
                Explore Venues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="featured-venues">
        <div className="container">
          <h2>Featured Venues</h2>
          <div className="venues-grid">
            {loading ? (
              <div className="loading">Loading venues...</div>
            ) : (
              featuredVenues.map((venue) => (
                <div key={venue._id} className="venue-card">
                  <div className="venue-img">
                    <img
                      src={venue.images[0] || "/images/placeholder-venue.jpg"}
                      alt={venue.name}
                    />
                  </div>
                  <div className="venue-content">
                    <h3>{venue.name}</h3>
                    <p className="venue-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {venue.location?.city}, {venue.location?.state}
                    </p>
                    <p className="venue-price">
                      Starting at ₹{venue.price?.toLocaleString()}
                    </p>
                    <Link
                      to={`/venues/${venue._id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Catering Services</h3>
              <p>Delicious food from top chefs</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>Makeup Artists</h3>
              <p>Professional bridal makeup</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3>Photography</h3>
              <p>Capture special moments</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3>Videography</h3>
              <p>Professional wedding films</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
