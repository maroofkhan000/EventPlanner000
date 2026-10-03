import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UpiPayment from "../components/UpiPayment";
import { todayIST as today, checkAvailability } from "../utils/dates";
import "./Venues.css";
import "./BookVendor.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

// Book a single vendor without going through the package builder
const BookVendor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [vendor, setVendor] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({
    eventDate: "",
    guestCount: "",
    specialRequests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentSent, setPaymentSent] = useState(false);
  // null = no date yet, otherwise { checking, available, unavailable }
  const [dateCheck, setDateCheck] = useState(null);

  useEffect(() => {
    axios
      .get(`/services/${id}`)
      .then((res) => setVendor(res.data))
      .catch((err) =>
        setLoadError(
          err.response?.status === 404
            ? "This vendor is no longer available."
            : "Could not load this vendor."
        )
      );
  }, [id]);

  // Tell the customer straight away if the vendor is taken on that date
  useEffect(() => {
    if (!vendor || !form.eventDate) {
      setDateCheck(null);
      return;
    }
    if (form.eventDate < today()) {
      setDateCheck({
        checking: false,
        available: false,
        unavailable: ["This date has already passed. Please pick an upcoming date."],
      });
      return;
    }
    let cancelled = false;
    setDateCheck({ checking: true });
    checkAvailability([{ kind: "services", id: vendor._id }], form.eventDate).then(
      (result) => {
        if (!cancelled) setDateCheck({ checking: false, ...result });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [vendor, form.eventDate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!form.eventDate || form.eventDate < today()) {
      toast.error("Please choose an upcoming event date");
      return;
    }
    if (dateCheck && !dateCheck.checking && !dateCheck.available) {
      toast.error(dateCheck.unavailable[0]);
      return;
    }
    const guests = Number(form.guestCount);
    if (!Number.isInteger(guests) || guests < 1) {
      toast.error("Please enter the number of guests");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/bookings", {
        services: [{ service: vendor._id }],
        eventDate: form.eventDate,
        guestCount: guests,
        specialRequests: form.specialRequests,
      });
      toast.success("Booking created! Complete the payment to confirm it.");
      setBookingId(data._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="book-vendor-page">
        <div className="container book-vendor-state">
          <i className="fas fa-exclamation-circle"></i>
          <p>{loadError}</p>
          <Link to="/services" className="btn-gold">
            Browse vendors
          </Link>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="book-vendor-page">
        <div className="container book-vendor-state">Loading vendor...</div>
      </div>
    );
  }

  return (
    <div className="book-vendor-page">
      <div className="container">
        <Link to={`/services?category=${vendor.category}`} className="book-vendor-back">
          <i className="fas fa-arrow-left"></i> Back to vendors
        </Link>

        <div className="book-vendor-layout">
          <article className="book-vendor-card">
            <img
              src={vendor.images?.[0] || FALLBACK_IMAGE}
              alt={vendor.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <div className="book-vendor-info">
              <span className="book-vendor-category">{vendor.category}</span>
              <h1>{vendor.name}</h1>
              <p className="book-vendor-provider">by {vendor.providerName}</p>
              {vendor.location?.city && (
                <p className="venue-meta">
                  <i className="fas fa-map-marker-alt"></i>
                  {vendor.location.city}, {vendor.location.state}
                </p>
              )}
              {vendor.experience && (
                <p className="venue-meta">
                  <i className="fas fa-award"></i>
                  {vendor.experience} experience
                </p>
              )}
              {vendor.description && <p className="book-vendor-desc">{vendor.description}</p>}
              {vendor.features?.length > 0 && (
                <div className="book-vendor-tags">
                  {vendor.features.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              )}
            </div>
          </article>

          <section className="book-vendor-panel">
            {bookingId ? (
              <div className="book-vendor-done">
                <i className="fas fa-check-circle"></i>
                {paymentSent ? (
                  <>
                    <h2>Payment Submitted!</h2>
                    <p>
                      Thank you! We'll verify your payment and confirm your booking
                      shortly.
                    </p>
                    <button className="btn-gold" onClick={() => navigate("/bookings")}>
                      View My Bookings
                    </button>
                  </>
                ) : (
                  <>
                    <h2>Booking Created!</h2>
                    <p>Pay through UPI below to confirm your booking.</p>
                    <UpiPayment
                      bookingId={bookingId}
                      onSubmitted={() => setPaymentSent(true)}
                    />
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>Book this vendor</h2>
                <div className="book-vendor-price">
                  <strong>₹{vendor.price?.toLocaleString("en-IN")}</strong>
                  <span>total price</span>
                </div>

                <label className="field">
                  <span>Event date *</span>
                  <input
                    type="date"
                    name="eventDate"
                    min={today()}
                    value={form.eventDate}
                    onChange={handleChange}
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
                          <i className="fas fa-check-circle"></i> Available on this
                          date
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle"></i>{" "}
                          {dateCheck.unavailable[0]}
                        </>
                      )}
                    </div>
                  )}
                </label>
                <label className="field">
                  <span>Number of guests *</span>
                  <input
                    type="number"
                    name="guestCount"
                    min="1"
                    placeholder="e.g. 300"
                    value={form.guestCount}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Special requests</span>
                  <textarea
                    name="specialRequests"
                    rows="4"
                    placeholder="Venue address, timings, anything the vendor should know"
                    value={form.specialRequests}
                    onChange={handleChange}
                  />
                </label>

                <button type="submit" className="btn-gold book-vendor-submit"
                  disabled={
                    submitting ||
                    dateCheck?.checking ||
                    (dateCheck && !dateCheck.available)
                  }
                >
                  {submitting
                    ? "Booking..."
                    : user
                    ? "Confirm Booking"
                    : "Log in to book"}
                </button>
                <p className="book-vendor-alt">
                  Planning more?{" "}
                  <Link to={`/package-builder?service=${vendor._id}`}>
                    Add it to a full package instead
                  </Link>
                </p>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookVendor;
