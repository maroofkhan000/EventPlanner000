import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./AdminVenues.css";
import "./AdminBookings.css";

const tabs = [
  {
    key: "verify",
    label: "To verify",
    hint: "Check each UPI reference and amount in your bank or UPI app before approving. Approving confirms the booking.",
    match: (b) => b.status !== "cancelled" && b.paymentStatus === "verifying",
  },
  {
    key: "awaiting",
    label: "Awaiting payment",
    hint: "Booked but not paid yet. These still hold the venue's date.",
    match: (b) => b.status === "pending" && b.paymentStatus === "pending",
  },
  {
    key: "successful",
    label: "Successful",
    hint: "Confirmed bookings.",
    match: (b) => b.status === "confirmed" || b.status === "completed",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    hint: "Cancelled bookings no longer hold the venue's date. Delete removes them for good.",
    match: (b) => b.status === "cancelled",
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const shortRef = (id) => id.slice(-8).toUpperCase();

const AdminBookings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("verify");
  const [search, setSearch] = useState("");
  // { id, action } while a cancel/delete is waiting for confirmation
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    axios
      .get("/bookings/admin/all")
      .then((res) => {
        setBookings(res.data);
        // Open on the first tab that has something in it
        const first = tabs.find((t) => res.data.some(t.match));
        if (first) setTab(first.key);
      })
      .catch(() => toast.error("Could not load bookings"))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="container admin-denied">
          <i className="fas fa-lock"></i>
          <h2>Master account only</h2>
          <p>Log in with the master account to manage bookings.</p>
        </div>
      </div>
    );
  }

  const replaceBooking = (updated) =>
    setBookings((prev) =>
      prev.map((b) =>
        b._id === updated._id
          ? { ...b, ...updated, user: b.user, venue: b.venue }
          : b
      )
    );

  const runAction = async (booking, action) => {
    setBusyId(booking._id);
    try {
      let res;
      if (action === "approve" || action === "reject") {
        res = await axios.put(`/bookings/${booking._id}/payment`, { action });
        replaceBooking(res.data.booking);
      } else if (action === "cancel") {
        res = await axios.put(`/bookings/${booking._id}/cancel`);
        replaceBooking(res.data.booking);
      } else if (action === "delete") {
        res = await axios.delete(`/bookings/${booking._id}`);
        setBookings((prev) => prev.filter((b) => b._id !== booking._id));
      }
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update the booking");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const activeTab = tabs.find((t) => t.key === tab);
  const term = search.trim().toLowerCase();
  const shown = bookings.filter(activeTab.match).filter(
    (b) =>
      !term ||
      [
        shortRef(b._id),
        b.user?.name,
        b.user?.email,
        b.user?.phone,
        b.venue?.name,
        b.paymentReference,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
  );

  const confirmButtons = (b, action, label) => (
    <div className="manage-confirm">
      <span>{label}</span>
      <button
        type="button"
        className="btn-danger"
        disabled={busyId === b._id}
        onClick={() => runAction(b, action)}
      >
        {busyId === b._id ? "Working..." : "Yes"}
      </button>
      <button
        type="button"
        className="clear-btn"
        disabled={busyId === b._id}
        onClick={() => setConfirm(null)}
      >
        No
      </button>
    </div>
  );

  const actionsFor = (b) => {
    if (confirm?.id === b._id) {
      return confirm.action === "delete"
        ? confirmButtons(b, "delete", "Delete permanently?")
        : confirmButtons(b, "cancel", "Cancel this booking?");
    }

    if (b.status === "cancelled") {
      return (
        <div className="manage-confirm">
          <button
            type="button"
            className="btn-delete"
            onClick={() => setConfirm({ id: b._id, action: "delete" })}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      );
    }

    return (
      <div className="manage-confirm">
        {b.paymentStatus === "verifying" && (
          <>
            <button
              type="button"
              className="btn-approve"
              disabled={busyId === b._id}
              onClick={() => runAction(b, "approve")}
            >
              Approve
            </button>
            <button
              type="button"
              className="clear-btn"
              disabled={busyId === b._id}
              onClick={() => runAction(b, "reject")}
            >
              Reject payment
            </button>
          </>
        )}
        <button
          type="button"
          className="btn-delete"
          onClick={() => setConfirm({ id: b._id, action: "cancel" })}
        >
          Cancel booking
        </button>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-head">
          <div>
            <p className="admin-eyebrow">Master account</p>
            <h1>Manage bookings</h1>
          </div>
          <Link to="/admin/venues" className="btn-outline-gold">
            Manage venues
          </Link>
        </div>

        <div className="booking-tabs" role="tablist">
          {tabs.map((t) => {
            const count = bookings.filter(t.match).length;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`booking-tab ${tab === t.key ? "is-active" : ""} tab-${t.key}`}
                onClick={() => {
                  setTab(t.key);
                  setConfirm(null);
                }}
              >
                {t.label}
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        <section className="admin-section">
          <div className="manage-head">
            <p className="admin-hint">{activeTab.hint}</p>
            <input
              type="search"
              className="manage-search"
              placeholder="Search name, email, venue, UPI ref"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="admin-hint">Loading bookings...</p>
          ) : shown.length === 0 ? (
            <p className="admin-hint booking-empty">No bookings here.</p>
          ) : (
            <ul className="manage-list">
              {shown.map((b) => (
                <li key={b._id} className="manage-row booking-row">
                  <div className="booking-main">
                    <div className="booking-title">
                      <strong>{b.venue?.name || "Venue removed"}</strong>
                      <span className="booking-ref">#{shortRef(b._id)}</span>
                    </div>
                    <span>
                      <i className="fas fa-calendar"></i> {formatDate(b.eventDate)} ·{" "}
                      {b.guestCount} guests
                      {b.venue?.location?.city ? ` · ${b.venue.location.city}` : ""}
                    </span>
                    <span>
                      <i className="fas fa-user"></i> {b.user?.name || "Deleted user"}
                      {b.user?.email ? ` · ${b.user.email}` : ""}
                      {b.user?.phone ? ` · ${b.user.phone}` : ""}
                    </span>
                    <span>
                      <i className="fas fa-rupee-sign"></i>{" "}
                      <b>₹{b.totalAmount?.toLocaleString("en-IN")}</b> ·{" "}
                      <span className={`pay-badge pay-${b.paymentStatus}`}>
                        {b.paymentStatus}
                      </span>
                      {b.paymentReference && <> · UPI ref <b>{b.paymentReference}</b></>}
                    </span>
                    {b.status === "cancelled" && b.paymentStatus === "paid" && (
                      <span className="refund-note">
                        <i className="fas fa-exclamation-triangle"></i> Was paid — refund
                        the customer if needed.
                      </span>
                    )}
                  </div>
                  {actionsFor(b)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminBookings;
