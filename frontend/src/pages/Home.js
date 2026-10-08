import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const homeServices = [
  {
    category: "catering",
    title: "Catering Services",
    description: "Delicious food from top chefs",
    icon: "fa-utensils",
    image:
      "/images/1555244162-803834f70033.jpg",
  },
  {
    category: "makeup",
    title: "Makeup Artists",
    description: "Professional bridal makeup",
    icon: "fa-palette",
    image:
      "/images/1596464716127-f2a82984de30.jpg",
  },
  {
    category: "photography",
    title: "Photography",
    description: "Capture special moments",
    icon: "fa-camera",
    image:
      "/images/1554048612-b6a482bc67e5.jpg",
  },
  {
    category: "videography",
    title: "Videography",
    description: "Professional wedding films",
    icon: "fa-video",
    image:
      "/images/1485846234645-a62644f84728.jpg",
  },
];

const Home = () => {
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVenues = async () => {
      try {
        const response = await axios.get("/venues?limit=9");
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
            {homeServices.map((service) => (
              <Link
                key={service.category}
                to={`/services?category=${service.category}`}
                className="home-service-card"
              >
                <div className="home-service-img">
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <div className="service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                </div>
                <div className="home-service-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="home-service-link">
                    Explore <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
