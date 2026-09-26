import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import "./PackageBuilder.css";

const PackageBuilder = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(100);
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    fetchVenues();
    fetchServices();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("/venues?limit=20");
      setVenues(response.data.venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
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

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    setStep(2);
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.find((s) => s.service._id === service._id);
      if (isSelected) {
        return prev.filter((s) => s.service._id !== service._id);
      } else {
        return [...prev, { service, quantity: 1, price: service.price }];
      }
    });
  };

  const calculateTotal = () => {
    let total = selectedVenue ? selectedVenue.price : 0;
    selectedServices.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      return;
    }

    if (!selectedVenue) {
      toast.error("Please select a venue");
      return;
    }

    try {
      const bookingData = {
        venue: selectedVenue._id,
        services: selectedServices,
        eventDate,
        guestCount,
        totalAmount: calculateTotal(),
        specialRequests,
      };

      await axios.post("/bookings", bookingData);
      toast.success("Booking created successfully!");
      setStep(4);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="package-builder">
      <div className="container">
        <div className="builder-header">
          <h1>Build Your Wedding Package</h1>
          <p>Customize your perfect wedding in simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="builder-steps">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`step ${step >= num ? "active" : ""}`}>
              <div className="step-number">{num}</div>
              <span>
                {num === 1 && "Select Venue"}
                {num === 2 && "Add Services"}
                {num === 3 && "Review & Book"}
                {num === 4 && "Confirmation"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Venue Selection */}
        {step === 1 && (
          <div className="builder-step">
            <h2>Choose Your Wedding Venue</h2>
            <div className="venues-grid">
              {venues.map((venue, index) => (
                <div
                  key={venue._id}
                  className={`venue-option ${
                    selectedVenue?._id === venue._id ? "selected" : ""
                  }`}
                  onClick={() => handleVenueSelect(venue)}
                >
                  <div className="venue-image">
                    <img src={getVenueImage(venue, index)} alt={venue.name} />
                  </div>
                  <div className="venue-info">
                    <h3>{venue.name}</h3>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i>
                      {venue.location.city}, {venue.location.state}
                    </p>
                    <p className="capacity">
                      Capacity: {venue.capacity.min} - {venue.capacity.max}{" "}
                      guests
                    </p>
                    <p className="price">₹{venue.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Services Selection */}
        {step === 2 && (
          <div className="builder-step">
            <h2>Add Services to Your Package</h2>
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service._id}
                  className={`service-option ${
                    selectedServices.find((s) => s.service._id === service._id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <div className="service-icon">
                    <i
                      className={`fas ${
                        service.category === "catering"
                          ? "fa-utensils"
                          : service.category === "makeup"
                          ? "fa-palette"
                          : service.category === "photography"
                          ? "fa-camera"
                          : service.category === "videography"
                          ? "fa-video"
                          : "fa-ring"
                      }`}
                    ></i>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.providerName}</p>
                  <p className="price">₹{service.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="builder-navigation">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={selectedServices.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Booking */}
        {step === 3 && (
          <div className="builder-step">
            <h2>Review Your Package</h2>
            <div className="booking-details">
              <div className="booking-section">
                <h3>Venue</h3>
                {selectedVenue && (
                  <div className="selected-item">
                    <h4>{selectedVenue.name}</h4>
                    <p>
                      {selectedVenue.location.city},{" "}
                      {selectedVenue.location.state}
                    </p>
                    <p className="price">
                      ₹{selectedVenue.price.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="booking-section">
                <h3>Services</h3>
                {selectedServices.map((item, index) => (
                  <div key={index} className="selected-item">
                    <h4>{item.service.name}</h4>
                    <p>by {item.service.providerName}</p>
                    <p className="price">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="booking-form">
                <h3>Event Details</h3>
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    min={selectedVenue?.capacity.min || 50}
                    max={selectedVenue?.capacity.max || 500}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>

              <div className="booking-summary">
                <h3>Total: ₹{calculateTotal().toLocaleString()}</h3>
              </div>
            </div>

            <div className="builder-navigation">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="builder-step confirmation">
            <div className="confirmation-content">
              <i className="fas fa-check-circle"></i>
              <h2>Booking Confirmed!</h2>
              <p>
                Your wedding package has been successfully booked. We'll contact
                you shortly to confirm the details.
              </p>
              <div className="confirmation-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => (window.location.href = "/bookings")}
                >
                  View My Bookings
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => (window.location.href = "/")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageBuilder;
