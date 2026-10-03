import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import UpiPayment from "../components/UpiPayment";
import { todayIST as today, checkAvailability } from "../utils/dates";
import "./PackageBuilder.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

// Display order and labels for service categories
const CATEGORIES = [
  { value: "photography", label: "Photographers", icon: "fa-camera" },
  { value: "videography", label: "Videographers", icon: "fa-video" },
  { value: "music", label: "DJ & Music", icon: "fa-music" },
  { value: "catering", label: "Catering", icon: "fa-utensils" },
  { value: "makeup", label: "Makeup Artists", icon: "fa-palette" },
  { value: "decoration", label: "Decoration", icon: "fa-ring" },
  { value: "mehndi", label: "Mehndi Artists", icon: "fa-hand-sparkles" },
];

const PackageBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [paymentSent, setPaymentSent] = useState(false);
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  // One chosen service per category: { [category]: service }
  const [selectedServices, setSelectedServices] = useState({});
  const [eventDate, setEventDate] = useState(searchParams.get("date") || "");
  const [guestCount, setGuestCount] = useState(
    searchParams.get("guests") || ""
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Availability of the venue and chosen vendors on eventDate:
  // null = not checked, otherwise { checking, available, unavailable }
  const [dateCheck, setDateCheck] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [venueRes, serviceRes] = await Promise.all([
          axios.get("/venues?limit=100"),
          axios.get("/services?limit=100"),
        ]);
        const venueList = venueRes.data.venues || [];
        const serviceList = serviceRes.data.services || [];
        setVenues(venueList);
        setServices(serviceList);

        // Pre-select from "Book this venue" / "Add to package" links
        const venueId = searchParams.get("venue");
        const preVenue = venueList.find((v) => v._id === venueId);
        if (preVenue) {
          setSelectedVenue(preVenue);
          setGuestCount((g) => g || String(preVenue.capacity.min));
          setStep(2);
        }

        const serviceId = searchParams.get("service");
        const preService = serviceList.find((s) => s._id === serviceId);
        if (preService) {
          setSelectedServices({ [preService.category]: preService });
        }
      } catch (error) {
        console.error("Error loading package data:", error);
        toast.error("Failed to load venues and services");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    const guests = Number(guestCount);
    if (!guests || guests < venue.capacity.min || guests > venue.capacity.max) {
      setGuestCount(String(venue.capacity.min));
    }
    setStep(2);
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      const next = { ...prev };
      if (prev[service.category]?._id === service._id) {
        delete next[service.category];
      } else {
        next[service.category] = service;
      }
      return next;
    });
  };

  const chosenServices = Object.values(selectedServices);

  const availabilityItems = [
    ...(selectedVenue ? [{ kind: "venues", id: selectedVenue._id }] : []),
    ...chosenServices.map((s) => ({ kind: "services", id: s._id })),
  ];
  const availabilityKey = availabilityItems.map((i) => i.id).join(",");

  // Re-check whenever the date or the selection changes on the review step
  useEffect(() => {
    if (step !== 3 || !eventDate || !availabilityKey) {
      setDateCheck(null);
      return;
    }
    if (eventDate < today()) {
      setDateCheck({
        checking: false,
        available: false,
        unavailable: ["This date has already passed. Please pick an upcoming date."],
      });
      return;
    }
    let cancelled = false;
    setDateCheck({ checking: true });
    checkAvailability(availabilityItems, eventDate).then((result) => {
      if (!cancelled) setDateCheck({ checking: false, ...result });
    });
    return () => {
      cancelled = true;
    };
    // availabilityKey stands in for availabilityItems, which is rebuilt every render
  }, [step, eventDate, availabilityKey]);

  const calculateTotal = () =>
    (selectedVenue ? selectedVenue.price : 0) +
    chosenServices.reduce((sum, s) => sum + s.price, 0);

  const validateDetails = () => {
    if (!eventDate || eventDate < today()) {
      toast.error("Please choose an upcoming event date");
      return false;
    }
    const guests = Number(guestCount);
    const { min, max } = selectedVenue.capacity;
    if (!Number.isInteger(guests) || guests < min || guests > max) {
      toast.error(`Guest count must be between ${min} and ${max}`);
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      return;
    }
    if (!selectedVenue) {
      toast.error("Please select a venue");
      setStep(1);
      return;
    }
    if (!validateDetails()) return;

    setSubmitting(true);
    try {
      const check = await checkAvailability(availabilityItems, eventDate);
      if (!check.available) {
        setDateCheck({ checking: false, ...check });
        toast.error(check.unavailable[0]);
        return;
      }

      const { data: booking } = await axios.post("/bookings", {
        venue: selectedVenue._id,
        services: chosenServices.map((s) => ({ service: s._id })),
        eventDate,
        guestCount: Number(guestCount),
        specialRequests,
      });
      toast.success("Booking created! Complete the payment to confirm it.");
      setBookingId(booking._id);
      setStep(4);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const imageOf = (item) => item.images?.[0] || FALLBACK_IMAGE;
  const onImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="package-builder">
        <div className="container">
          <div className="builder-step">
            <h2>Loading venues and services...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="package-builder">
      <div className="container">
        <div className="builder-header">
          <h1>Build Your Wedding Package</h1>
          <p>Customize your perfect wedding in simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="builder-steps">
          {["Select Venue", "Add Services", "Review & Book", "Confirmation"].map(
            (label, i) => (
              <div
                key={label}
                className={`step ${step >= i + 1 ? "active" : ""}`}
              >
                <div className="step-number">{i + 1}</div>
                <span>{label}</span>
              </div>
            )
          )}
        </div>

        {/* Running summary */}
        {step > 1 && step < 4 && selectedVenue && (
          <div className="package-summary-bar">
            <div>
              <strong>{selectedVenue.name}</strong>
              {chosenServices.length > 0 &&
                ` + ${chosenServices.length} service${
                  chosenServices.length > 1 ? "s" : ""
                }`}
            </div>
            <div className="summary-total">
              ₹{calculateTotal().toLocaleString()}
            </div>
          </div>
        )}

        {/* Step 1: Venue Selection */}
        {step === 1 && (
          <div className="builder-step">
            <h2>Choose Your Wedding Venue</h2>
            <div className="venues-grid">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  className={`venue-option ${
                    selectedVenue?._id === venue._id ? "selected" : ""
                  }`}
                  onClick={() => handleVenueSelect(venue)}
                >
                  <div className="venue-image">
                    <img
                      src={imageOf(venue)}
                      alt={venue.name}
                      onError={onImageError}
                    />
                    {selectedVenue?._id === venue._id && (
                      <span className="selected-badge">
                        <i className="fas fa-check"></i> Selected
                      </span>
                    )}
                  </div>
                  <div className="venue-info">
                    <h3>{venue.name}</h3>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i>
                      {venue.location.city}, {venue.location.state}
                    </p>
                    <p className="capacity">
                      <i className="fas fa-users"></i>
                      {venue.capacity.min} - {venue.capacity.max} guests
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
            <p className="step-hint">
              Pick one provider per category, or skip any you don't need. Click
              a selected card again to remove it.
            </p>

            {CATEGORIES.map((cat) => {
              const list = services.filter((s) => s.category === cat.value);
              if (list.length === 0) return null;
              return (
                <div key={cat.value} className="service-category">
                  <h3 className="service-category-title">
                    <i className={`fas ${cat.icon}`}></i> {cat.label}
                    {selectedServices[cat.value] && (
                      <span className="category-chosen">
                        <i className="fas fa-check-circle"></i> 1 selected
                      </span>
                    )}
                  </h3>
                  <div className="services-grid">
                    {list.map((service) => {
                      const isSelected =
                        selectedServices[cat.value]?._id === service._id;
                      return (
                        <div
                          key={service._id}
                          className={`service-option ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => handleServiceToggle(service)}
                          role="button"
                          aria-pressed={isSelected}
                        >
                          <div className="service-option-image">
                            <img
                              src={imageOf(service)}
                              alt={service.name}
                              onError={onImageError}
                            />
                            {isSelected && (
                              <span className="selected-badge">
                                <i className="fas fa-check"></i> Selected
                              </span>
                            )}
                          </div>
                          <div className="service-option-body">
                            <h4>{service.name}</h4>
                            <p className="provider">
                              by {service.providerName}
                            </p>
                            <p className="meta">
                              <span>
                                <i className="fas fa-star"></i>{" "}
                                {service.rating || "New"}
                              </span>
                              {service.experience && (
                                <span>{service.experience} exp.</span>
                              )}
                            </p>
                            {service.features?.length > 0 && (
                              <div className="option-features">
                                {service.features.slice(0, 3).map((f) => (
                                  <span key={f}>{f}</span>
                                ))}
                              </div>
                            )}
                            <p className="price">
                              ₹{service.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="builder-navigation">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Change Venue
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                {chosenServices.length === 0
                  ? "Skip Services & Continue"
                  : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Booking */}
        {step === 3 && selectedVenue && (
          <div className="builder-step">
            <h2>Review Your Package</h2>
            <div className="booking-details">
              <div className="booking-section">
                <h3>Venue</h3>
                <div className="selected-item with-image">
                  <img
                    src={imageOf(selectedVenue)}
                    alt={selectedVenue.name}
                    onError={onImageError}
                  />
                  <div>
                    <h4>{selectedVenue.name}</h4>
                    <p>
                      {selectedVenue.location.city},{" "}
                      {selectedVenue.location.state}
                    </p>
                    <p className="price">
                      ₹{selectedVenue.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h3>Services</h3>
                {chosenServices.length === 0 ? (
                  <p className="empty-note">
                    No services added.{" "}
                    <button className="link-button" onClick={() => setStep(2)}>
                      Add services
                    </button>
                  </p>
                ) : (
                  chosenServices.map((service) => (
                    <div key={service._id} className="selected-item with-image">
                      <img
                        src={imageOf(service)}
                        alt={service.name}
                        onError={onImageError}
                      />
                      <div>
                        <h4>{service.name}</h4>
                        <p>by {service.providerName}</p>
                        <p className="price">
                          ₹{service.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => handleServiceToggle(service)}
                        aria-label={`Remove ${service.name}`}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="booking-form">
                <h3>Event Details</h3>
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={today()}
                    required
                  />
                  {dateCheck && (
                    <div
                      className={`date-check ${
                        dateCheck.checking
                          ? "is-checking"
                          : dateCheck.available
                          ? "is-free"
                          : "is-taken"
                      }`}
                    >
                      {dateCheck.checking ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Checking
                          availability...
                        </>
                      ) : dateCheck.available ? (
                        <>
                          <i className="fas fa-check-circle"></i> Your venue and
                          vendors are all available on this date
                        </>
                      ) : (
                        <>
                          <strong>
                            <i className="fas fa-times-circle"></i> Not available on
                            this date
                          </strong>
                          <ul>
                            {dateCheck.unavailable.map((m) => (
                              <li key={m}>{m}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Number of Guests ({selectedVenue.capacity.min} -{" "}
                    {selectedVenue.capacity.max})
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    min={selectedVenue.capacity.min}
                    max={selectedVenue.capacity.max}
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

              {!user && (
                <p className="empty-note">
                  You need to <Link to="/login">log in</Link> to confirm this
                  booking.
                </p>
              )}
            </div>

            <div className="builder-navigation">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBooking}
                disabled={
                  submitting ||
                  dateCheck?.checking ||
                  (dateCheck && !dateCheck.available)
                }
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="builder-step confirmation">
            <div className="confirmation-content">
              <i className="fas fa-check-circle"></i>
              {paymentSent ? (
                <>
                  <h2>Payment Submitted!</h2>
                  <p>
                    Thank you! We'll verify your payment and confirm your booking
                    shortly. You can track it in My Bookings.
                  </p>
                </>
              ) : (
                <>
                  <h2>Booking Created!</h2>
                  <p>
                    Your date is held. Pay through UPI below to confirm your
                    booking.
                  </p>
                  {bookingId && (
                    <UpiPayment
                      bookingId={bookingId}
                      onSubmitted={() => setPaymentSent(true)}
                    />
                  )}
                </>
              )}
              <div className="confirmation-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/bookings")}
                >
                  View My Bookings
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
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
