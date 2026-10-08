import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { todayIST } from "../utils/dates";
import { toast } from "react-toastify";

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  // null = not checked yet, otherwise { available, message }
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const today = todayIST();

  useEffect(() => {
    fetchVenueDetails();
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await axios.get(`/venues/${id}`);
      setVenue(response.data);
    } catch (error) {
      console.error("Error fetching venue details:", error);
      toast.error("Failed to load venue details");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate) {
      toast.error("Please select a date to check availability");
      return;
    }
    setChecking(true);
    try {
      const { data } = await axios.get(
        `/venues/${id}/availability?date=${selectedDate}`
      );
      setAvailability(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not check availability"
      );
    } finally {
      setChecking(false);
    }
  };

  // Function to get venue image - same logic as Venues.js
  const getVenueImages = (venue) => {
    // If venue has custom images, use them
    if (venue.images && venue.images.length > 0) {
      return venue.images;
    }

    // Default image for venues
    return [
      "/images/1519225421980-715cb0215aed.jpg",
    ];
  };

  // Get the current active image
  const getCurrentImage = () => {
    const images = getVenueImages(venue);
    return images[activeImage];
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "120px 0",
          textAlign: "center",
          background: "linear-gradient(135deg, #f8f0e3 0%, #fff 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #d4af37",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <p style={{ color: "#d4af37", fontSize: "1.2rem" }}>
          Loading venue details...
        </p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div
        style={{
          padding: "120px 0",
          textAlign: "center",
          background: "linear-gradient(135deg, #f8f0e3 0%, #fff 100%)",
          minHeight: "100vh",
        }}
      >
        <i
          className="fas fa-exclamation-triangle"
          style={{ fontSize: "4rem", color: "#ddd", marginBottom: "20px" }}
        ></i>
        <h2 style={{ color: "#333", marginBottom: "15px" }}>Venue Not Found</h2>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          The venue you're looking for doesn't exist.
        </p>
        <Link
          to="/venues"
          style={{
            padding: "12px 30px",
            background: "#d4af37",
            color: "#fff",
            borderRadius: "25px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "all 0.3s ease",
          }}
        >
          Back to Venues
        </Link>
      </div>
    );
  }

  const venueImages = getVenueImages(venue);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #f8f0e3 0%, #fff 50%, #f8f0e3 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
          color: "#fff",
          padding: "18px 0 16px",
        }}
      >
        <div className="container">
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              fontSize: "0.78rem",
            }}
          >
            <Link
              to="/"
              style={{ color: "#fff", textDecoration: "none", opacity: 0.9 }}
            >
              Home
            </Link>
            <span style={{ opacity: 0.7 }}>›</span>
            <Link
              to="/venues"
              style={{ color: "#fff", textDecoration: "none", opacity: 0.9 }}
            >
              Venues
            </Link>
            <span style={{ opacity: 0.7 }}>›</span>
            <span style={{ opacity: 0.7 }}>{venue.name}</span>
          </nav>

          <h1
            style={{
              fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)",
              lineHeight: 1.2,
              margin: 0,
              fontWeight: "700",
              textShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {venue.name}
          </h1>

        </div>
      </div>

      {/* Main Content */}
      <div
        className="container"
        style={{ paddingTop: "32px", paddingBottom: "50px" }}
      >
        <div
          className="main-content"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left Column - Gallery & Details */}
          <div>
            {/* Image Gallery */}
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  height: "400px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={getCurrentImage()}
                  alt={venue.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {venueImages.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "20px",
                    overflowX: "auto",
                  }}
                >
                  {venueImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${venue.name} ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border:
                          index === activeImage
                            ? "3px solid #d4af37"
                            : "2px solid #e0e0e0",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setActiveImage(index)}
                      onMouseEnter={(e) => {
                        if (index !== activeImage) {
                          e.target.style.borderColor = "#d4af37";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== activeImage) {
                          e.target.style.borderColor = "#e0e0e0";
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Venue Details */}
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 25px 0",
                  color: "#333",
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i
                  className="fas fa-info-circle"
                  style={{ color: "#d4af37" }}
                ></i>
                About This Venue
              </h2>
              <p
                style={{
                  color: "#666",
                  lineHeight: "1.7",
                  fontSize: "1.05rem",
                  marginBottom: "20px",
                }}
              >
                {venue.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "#444",
                  fontSize: "1rem",
                  marginBottom: "25px",
                }}
              >
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "#d4af37", marginTop: "4px" }}
                ></i>
                <span>
                  {venue.location?.address}, {venue.location?.city},{" "}
                  {venue.location?.state}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#f8f0e3",
                    borderRadius: "12px",
                  }}
                >
                  <i
                    className="fas fa-tag"
                    style={{
                      fontSize: "2rem",
                      color: "#d4af37",
                      marginBottom: "10px",
                    }}
                  ></i>
                  <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>
                    Starting Price
                  </h4>
                  <p style={{ margin: 0, color: "#666", fontWeight: "600" }}>
                    ₹{venue.price?.toLocaleString()}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#f8f0e3",
                    borderRadius: "12px",
                  }}
                >
                  <i
                    className="fas fa-users"
                    style={{
                      fontSize: "2rem",
                      color: "#d4af37",
                      marginBottom: "10px",
                    }}
                  ></i>
                  <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>
                    Capacity
                  </h4>
                  <p style={{ margin: 0, color: "#666", fontWeight: "600" }}>
                    {venue.capacity?.min} - {venue.capacity?.max} guests
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#f8f0e3",
                    borderRadius: "12px",
                  }}
                >
                  <i
                    className="fas fa-home"
                    style={{
                      fontSize: "2rem",
                      color: "#d4af37",
                      marginBottom: "10px",
                    }}
                  ></i>
                  <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>
                    Venue Type
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {venue.type?.replace("-", " ")}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#f8f0e3",
                    borderRadius: "12px",
                  }}
                >
                  <i
                    className="fas fa-star"
                    style={{
                      fontSize: "2rem",
                      color: "#d4af37",
                      marginBottom: "10px",
                    }}
                  ></i>
                  <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Rating</h4>
                  <p style={{ margin: 0, color: "#666", fontWeight: "600" }}>
                    {venue.rating}/5
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div
            className="booking-card"
            style={{
              position: "sticky",
              top: "100px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "2px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  color: "#333",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Book This Venue
              </h3>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#d4af37",
                    background: "linear-gradient(45deg, #d4af37, #b8941f)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "5px",
                  }}
                >
                  ₹{venue.price?.toLocaleString()}
                </div>
                <span style={{ color: "#999", fontSize: "0.9rem" }}>
                  Starting Price
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  Check Availability
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setAvailability(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              {availability && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    background: availability.available ? "#e8f5e9" : "#fdecea",
                    color: availability.available ? "#2e7d32" : "#c62828",
                  }}
                >
                  <i
                    className={`fas ${
                      availability.available ? "fa-check-circle" : "fa-times-circle"
                    }`}
                    style={{ marginRight: "8px" }}
                  ></i>
                  {availability.message}
                </div>
              )}

              <button
                onClick={checkAvailability}
                disabled={checking}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "transparent",
                  border: "2px solid #d4af37",
                  color: "#d4af37",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  marginBottom: "15px",
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
                {checking ? "Checking..." : "Check Availability"}
              </button>

              <Link
                to={`/package-builder?venue=${venue._id}${
                  selectedDate && availability?.available
                    ? `&date=${selectedDate}`
                    : ""
                }`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px",
                  background: "#d4af37",
                  color: "#fff",
                  border: "2px solid #d4af37",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  marginBottom: "12px",
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
                Book This Venue
              </Link>

              <Link
                to="/package-builder"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px",
                  background: "transparent",
                  color: "#d4af37",
                  border: "2px solid #d4af37",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                  textAlign: "center",
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
                Build Complete Package
              </Link>

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f8f0e3",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <i
                  className="fas fa-phone"
                  style={{ color: "#d4af37", marginRight: "8px" }}
                ></i>
                <span style={{ color: "#333", fontWeight: "500" }}>
                  Need help? Call us at{" "}
                </span>
                <span style={{ color: "#d4af37", fontWeight: "600" }}>
                  +91 98765 43210
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        input:focus {
          border-color: #d4af37 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr !important;
          }

          .booking-card {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VenueDetails;
