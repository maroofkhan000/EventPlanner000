import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // Category lives in the URL (?category=) so links from the home page can preselect it
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const setSelectedCategory = (category) =>
    setSearchParams(category ? { category } : {});

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      const params = selectedCategory ? `?category=${selectedCategory}` : "";
      const response = await axios.get(`/services${params}`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get category-specific images
  const getServiceImage = (category, serviceImages) => {
    if (serviceImages && serviceImages.length > 0) {
      return serviceImages[0];
    }

    const categoryImages = {
      catering:
        "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      makeup:
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      photography:
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      videography:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      decoration:
        "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      music:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      mehndi:
        "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
    };

    return (
      categoryImages[category] ||
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    );
  };

  const categories = [
    { value: "catering", label: "Catering", icon: "fa-utensils" },
    { value: "makeup", label: "Makeup Artists", icon: "fa-palette" },
    { value: "photography", label: "Photography", icon: "fa-camera" },
    { value: "videography", label: "Videography", icon: "fa-video" },
    { value: "decoration", label: "Decoration", icon: "fa-ring" },
    { value: "music", label: "DJ & Music", icon: "fa-music" },
    { value: "mehndi", label: "Mehndi Artists", icon: "fa-hand-sparkles" },
  ];

  return (
    <div className="services-page">
      <div className="container">
        {/* Category Filter */}
        <div className="category-section">
          <h2 className="category-title">Browse by Category</h2>
          <div className="category-filters">
            <button
              className={`category-filter ${!selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory("")}
            >
              <i className="fas fa-star"></i>
              All Services
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                className={`category-filter ${
                  selectedCategory === category.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <i className={`fas ${category.icon}`}></i>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-grid-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading premium services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <div key={service._id} className="service-card">
                  <div className="service-image">
                    <img
                      src={getServiceImage(service.category, service.images)}
                      alt={service.name}
                      className="service-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
                      }}
                    />
                    <div className="service-category-badge">
                      {service.category}
                    </div>
                  </div>

                  <div className="service-content">
                    <div className="service-header">
                      <h3 className="service-name">{service.name}</h3>
                      <p className="service-provider">
                        by {service.providerName}
                      </p>
                    </div>

                    <div className="service-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {service.location?.city}, {service.location?.state}
                    </div>

                    <p className="service-description">{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <div className="service-features">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                        {service.features.length > 3 && (
                          <span className="feature-tag">
                            +{service.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="service-footer">
                      <div className="service-price">
                        ₹{service.price?.toLocaleString()}
                      </div>
                      <div className="service-rating">
                        <i className="fas fa-star"></i>
                        <span>{service.rating || "4.5"}/5</span>
                      </div>
                    </div>

                    {service.experience && (
                      <p className="service-experience">
                        <i className="fas fa-award"></i> {service.experience}{" "}
                        experience
                      </p>
                    )}

                    <Link
                      to={`/package-builder?service=${service._id}`}
                      className="add-to-package-btn"
                    >
                      <i className="fas fa-plus"></i> Add to Package
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-search no-results-icon"></i>
              <h3>No Services Found</h3>
              <p>
                We couldn't find any services in this category. Try selecting a
                different category.
              </p>
              <button
                className="clear-filter-btn"
                onClick={() => setSelectedCategory("")}
              >
                Show All Services
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .services-page {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #f8f0e3 0%,
            #fff 50%,
            #f8f0e3 100%
          );
        }

        .category-section {
          padding: 40px 0 30px;
          text-align: center;
        }

        .category-title {
          font-size: 2.2rem;
          color: #333;
          margin-bottom: 30px;
          font-weight: 600;
        }

        .category-filters {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .category-filter {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .category-filter:hover {
          border-color: #d4af37;
          color: #d4af37;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }

        .category-filter.active {
          background: #d4af37;
          border-color: #d4af37;
          color: white;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        .category-filter i {
          font-size: 1rem;
        }

        /* Services Grid */
        .services-grid-section {
          padding: 40px 0 80px;
        }

        .loading-container {
          text-align: center;
          padding: 60px 20px;
          color: #d4af37;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .service-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .service-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .service-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .service-card:hover .service-img {
          transform: scale(1.1);
        }

        .service-category-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(212, 175, 55, 0.95);
          color: white;
          padding: 6px 15px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .service-content {
          padding: 25px;
        }

        .service-header {
          margin-bottom: 15px;
        }

        .service-name {
          font-size: 1.4rem;
          color: #333;
          margin: 0 0 5px 0;
          font-weight: 700;
          line-height: 1.3;
        }

        .service-provider {
          color: #d4af37;
          margin: 0;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .service-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .service-location i {
          color: #d4af37;
        }

        .service-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .service-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature-tag {
          background: #f8f0e3;
          color: #333;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .service-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .service-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #d4af37;
          background: linear-gradient(45deg, #d4af37, #b8941f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .service-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-weight: 600;
        }

        .service-rating i {
          color: #ffd700;
        }

        .service-experience {
          margin: 12px 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .service-experience i {
          color: #d4af37;
          margin-right: 4px;
        }

        .add-to-package-btn {
          display: block;
          margin-top: 18px;
          padding: 12px;
          text-align: center;
          background: #d4af37;
          color: #fff;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .add-to-package-btn:hover {
          background: #b8941f;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .no-results-icon {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 20px;
        }

        .no-results h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .no-results p {
          color: #666;
          margin-bottom: 25px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .clear-filter-btn {
          padding: 12px 30px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .clear-filter-btn:hover {
          background: #b8941f;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        /* Animations */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .category-filters {
            gap: 10px;
          }

          .category-filter {
            padding: 10px 16px;
            font-size: 0.85rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-footer {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .category-section {
            padding: 40px 0 20px;
          }

          .category-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
