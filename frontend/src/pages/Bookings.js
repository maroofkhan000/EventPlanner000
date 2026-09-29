import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      case "completed":
        return "status-completed";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "fas fa-check-circle";
      case "pending":
        return "fas fa-clock";
      case "cancelled":
        return "fas fa-times-circle";
      case "completed":
        return "fas fa-calendar-check";
      default:
        return "fas fa-clock";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return "fas fa-check-circle";
      case "pending":
        return "fas fa-clock";
      case "failed":
        return "fas fa-exclamation-circle";
      default:
        return "fas fa-clock";
    }
  };

  return (
    <div className="bookings-page">
      {/* Header Section */}
      <div className="page-header-section">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Manage your wedding bookings and packages
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                {/* Booking Header */}
                <div className="booking-header">
                  <div className="booking-id">
                    <i className="fas fa-receipt"></i>
                    Booking #{booking._id.slice(-8).toUpperCase()}
                  </div>
                  <div
                    className={`status-badge ${getStatusColor(booking.status)}`}
                  >
                    <i className={getStatusIcon(booking.status)}></i>
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Event Date</span>
                        <span className="detail-value">
                          {new Date(booking.eventDate).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Guests</span>
                        <span className="detail-value">
                          {booking.guestCount} people
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-indian-rupee-sign"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Total Amount</span>
                        <span className="detail-value price">
                          ₹{booking.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        <i
                          className={getPaymentStatusIcon(
                            booking.paymentStatus
                          )}
                        ></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Payment</span>
                        <span
                          className={`detail-value payment-status ${booking.paymentStatus}`}
                        >
                          {booking.paymentStatus.charAt(0).toUpperCase() +
                            booking.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Venue Information */}
                {booking.venue && (
                  <div className="venue-section">
                    <div className="section-header">
                      <i className="fas fa-building"></i>
                      <h4>Venue</h4>
                    </div>
                    <div className="venue-info">
                      <h5>{booking.venue.name}</h5>
                      <p>
                        <i className="fas fa-map-marker-alt"></i>
                        {booking.venue.location?.city},{" "}
                        {booking.venue.location?.state}
                      </p>
                    </div>
                  </div>
                )}

                {/* Services Information */}
                {booking.services && booking.services.length > 0 && (
                  <div className="services-section">
                    <div className="section-header">
                      <i className="fas fa-concierge-bell"></i>
                      <h4>Services Included</h4>
                    </div>
                    <div className="services-list">
                      {booking.services.map((serviceItem, index) => (
                        <div key={index} className="service-item">
                          <div className="service-info">
                            <span className="service-name">
                              {serviceItem.service?.name}
                            </span>
                            <span className="service-price">
                              ₹{serviceItem.price?.toLocaleString()}
                            </span>
                          </div>
                          <span className="service-provider">
                            by {serviceItem.service?.providerName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="requests-section">
                    <div className="section-header">
                      <i className="fas fa-sticky-note"></i>
                      <h4>Special Requests</h4>
                    </div>
                    <p className="requests-text">{booking.specialRequests}</p>
                  </div>
                )}

                {/* Booking Actions - Only Download Invoice button remains */}
                <div className="booking-actions">
                  {booking.status === "confirmed" && (
                    <button className="action-btn secondary">
                      <i className="fas fa-download"></i>
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <div className="no-bookings-content">
              <i className="fas fa-calendar-times"></i>
              <h3>No Bookings Yet</h3>
              <p>
                Start planning your perfect wedding by exploring our venues and
                services
              </p>
              <a href="/package-builder" className="cta-btn">
                <i className="fas fa-magic"></i>
                Start Planning
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}

      <style jsx>{`
        .bookings-page {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #f8f0e3 0%,
            #fff 50%,
            #f8f0e3 100%
          );
        }


        /* Header Section */
        .page-header-section {
          background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
          color: white;
          padding: 80px 0 60px;
          text-align: center;
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 3rem;
          margin-bottom: 15px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Loading State */
        .loading-container {
          text-align: center;
          padding: 80px 20px;
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

        /* Bookings Grid */
        .bookings-grid {
          display: grid;
          gap: 30px;
          margin: -30px auto 60px;
          max-width: 1000px;
        }

        /* Booking Card */
        .booking-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 30px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
        }

        .booking-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        /* Booking Header */
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f8f0e3;
        }

        .booking-id {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: #333;
          font-size: 1.1rem;
        }

        .booking-id i {
          color: #d4af37;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: capitalize;
        }

        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .status-completed {
          background: #d1ecf1;
          color: #0c5460;
        }

        /* Booking Details */
        .booking-details {
          margin-bottom: 25px;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .detail-content {
          flex: 1;
        }

        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .price {
          color: #d4af37;
          font-size: 1.1rem;
        }

        .payment-status.paid {
          color: #28a745;
        }

        .payment-status.pending {
          color: #ffc107;
        }

        .payment-status.failed {
          color: #dc3545;
        }

        /* Sections */
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          color: #333;
        }

        .section-header i {
          color: #d4af37;
        }

        .section-header h4 {
          margin: 0;
          font-size: 1.1rem;
        }

        .venue-section,
        .services-section,
        .requests-section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #d4af37;
        }

        .venue-info h5 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1rem;
        }

        .venue-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .venue-info i {
          color: #d4af37;
          margin-right: 5px;
        }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .service-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-name {
          font-weight: 600;
          color: #333;
        }

        .service-price {
          color: #d4af37;
          font-weight: 600;
        }

        .service-provider {
          font-size: 0.8rem;
          color: #666;
        }

        .requests-text {
          margin: 0;
          color: #666;
          line-height: 1.5;
          font-style: italic;
        }

        /* Booking Actions - Updated */
        .booking-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 2px solid #f8f0e3;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          text-decoration: none;
        }

        .action-btn.secondary {
          background: #6c757d;
          color: white;
        }

        .action-btn.secondary:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        /* No Bookings State */
        .no-bookings {
          text-align: center;
          padding: 80px 20px;
        }

        .no-bookings-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .no-bookings i {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 20px;
        }

        .no-bookings h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.8rem;
        }

        .no-bookings p {
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: #d4af37;
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-btn:hover {
          background: #b8941f;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        /* Footer Section */
        .main-footer {
          background: #2c3e50;
          color: white;
          padding: 50px 0 20px;
          margin-top: 60px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: #d4af37;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .footer-section h4 {
          color: #d4af37;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .footer-section p {
          color: #bdc3c7;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .footer-section a {
          display: block;
          color: #bdc3c7;
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #d4af37;
        }

        .footer-bottom {
          border-top: 1px solid #34495e;
          padding-top: 20px;
          text-align: center;
          color: #bdc3c7;
          font-size: 0.9rem;
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
          .page-title {
            font-size: 2.5rem;
          }

          .detail-row {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 480px) {
          .page-header-section {
            padding: 60px 0 40px;
          }

          .page-title {
            font-size: 2rem;
          }

          .booking-card {
            padding: 20px;
          }

          .booking-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .no-bookings {
            padding: 60px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Bookings;
