import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  const fetchVenues = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.city) params.append("city", filters.city);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const response = await axios.get(`/venues?${params}`);
      setVenues(response.data.venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      city: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  // Function to get venue image - special images for 3rd and 5th venues
  const getVenueImage = (venue, index) => {
    // For 3rd venue (index 2) - Luxury Lucknow Palace
    if (index === 2) {
      return "https://images.unsplash.com/photo-1624763149686-1893acf73092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80";
    }
    // For 5th venue (index 4) - Traditional Lucknow Banquet
    if (index === 4) {
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80";
    }
    // Default image for other venues
    return (
      venue.images?.[0] ||
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    );
  };

  return (
    <div
      style={{
        padding: "100px 0 50px",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8f0e3 0%, #fff 50%, #f8f0e3 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              color: "#333",
              marginBottom: "15px",
              position: "relative",
              display: "inline-block",
              fontWeight: "700",
              background: "linear-gradient(45deg, #d4af37, #b8941f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Wedding Venues
            <span
              style={{
                content: '""',
                position: "absolute",
                bottom: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "4px",
                background: "linear-gradient(45deg, #d4af37, #b8941f)",
                borderRadius: "2px",
              }}
            ></span>
          </h1>
          <p
            style={{
              color: "#666",
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "25px auto 0",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            Discover the perfect setting for your special day from our curated
            collection of exquisite venues
          </p>
        </div>

        {/* Filters Section */}
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            marginBottom: "50px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h3
              style={{
                margin: "0",
                color: "#333",
                fontSize: "1.4rem",
                fontWeight: "600",
              }}
            >
              Filter Venues
            </h3>
            <button
              onClick={clearFilters}
              style={{
                background: "transparent",
                border: "2px solid #d4af37",
                color: "#d4af37",
                padding: "8px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#d4af37";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#d4af37";
              }}
            >
              Clear Filters
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                Venue Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23d4af37' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "12px",
                }}
              >
                <option value="">All Venue Types</option>
                <option value="marriage-lawn">Marriage Lawn</option>
                <option value="hotel">Luxury Hotel</option>
                <option value="destination">Destination</option>
                <option value="banquet-hall">Banquet Hall</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="Search by city..."
                value={filters.city}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "#fff",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Minimum budget"
                value={filters.minPrice}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "#fff",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Maximum budget"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "#fff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                fontSize: "1.2rem",
                color: "#d4af37",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #d4af37",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Loading beautiful venues...
            </div>
          ) : venues.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: "30px",
              }}
            >
              {venues.map((venue, index) => (
                <div
                  key={venue._id}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(212, 175, 55, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Venue Image */}
                  <div
                    style={{
                      height: "250px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={getVenueImage(venue, index)}
                      alt={venue.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "rgba(212, 175, 55, 0.95)",
                        color: "#fff",
                        padding: "6px 15px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {venue.type?.replace("-", " ") || "Venue"}
                    </div>
                  </div>

                  {/* Venue Content */}
                  <div
                    style={{
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                      height: "calc(100% - 250px)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "1.4rem",
                        color: "#333",
                        fontWeight: "700",
                        lineHeight: "1.3",
                      }}
                    >
                      {venue.name}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <i
                        className="fas fa-map-marker-alt"
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                        }}
                      ></i>
                      <span
                        style={{
                          color: "#666",
                          fontSize: "0.95rem",
                          fontWeight: "500",
                        }}
                      >
                        {venue.location?.city}, {venue.location?.state}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <i
                        className="fas fa-users"
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                        }}
                      ></i>
                      <span
                        style={{
                          color: "#666",
                          fontSize: "0.95rem",
                        }}
                      >
                        Capacity: {venue.capacity?.min} - {venue.capacity?.max}{" "}
                        guests
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "20px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#d4af37",
                            background:
                              "linear-gradient(45deg, #d4af37, #b8941f)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          ₹{venue.price?.toLocaleString()}
                        </p>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#999",
                          }}
                        >
                          starting price
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <Link
                          to={`/venues/${venue._id}`}
                          style={{
                            padding: "10px 20px",
                            background: "transparent",
                            border: "2px solid #d4af37",
                            color: "#d4af37",
                            borderRadius: "25px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#d4af37";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#d4af37";
                          }}
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/package-builder?venue=${venue._id}`}
                          style={{
                            padding: "10px 20px",
                            background: "#d4af37",
                            color: "#fff",
                            border: "2px solid #d4af37",
                            borderRadius: "25px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#b8941f";
                            e.target.style.borderColor = "#b8941f";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#d4af37";
                            e.target.style.borderColor = "#d4af37";
                          }}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <i
                className="fas fa-search"
                style={{
                  fontSize: "4rem",
                  color: "#ddd",
                  marginBottom: "20px",
                }}
              ></i>
              <h3
                style={{
                  color: "#333",
                  marginBottom: "15px",
                  fontSize: "1.5rem",
                }}
              >
                No Venues Found
              </h3>
              <p
                style={{
                  color: "#666",
                  marginBottom: "25px",
                  maxWidth: "400px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize: "1rem",
                }}
              >
                We couldn't find any venues matching your criteria. Try
                adjusting your filters.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  padding: "12px 30px",
                  background: "#d4af37",
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#b8941f";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#d4af37";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        select:focus,
        input:focus {
          border-color: #d4af37 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr !important;
          }

          .venues-grid {
            grid-template-columns: 1fr !important;
          }

          .venue-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Venues;
