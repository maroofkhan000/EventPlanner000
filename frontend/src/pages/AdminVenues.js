import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Venues.css";
import "./AdminVenues.css";

const emptyForm = {
  name: "",
  type: "banquet-hall",
  address: "",
  city: "",
  state: "",
  capacityMin: "",
  capacityMax: "",
  price: "",
  amenities: "",
  description: "",
};

const placeholderImage =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

const revokePreview = (p) => p.file && URL.revokeObjectURL(p.preview);

const AdminVenues = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  // Each photo is { id, file?, url, preview } — file for uploads, url for pasted links
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState([]);
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [reviewingId, setReviewingId] = useState(null);
  const isAdmin = user?.role === "admin";

  // Free object URLs made for local file previews when leaving the page
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach(revokePreview), []);

  useEffect(() => {
    if (!isAdmin) return;
    axios
      .get("/venues?limit=1000")
      .then((res) => setVenues(res.data.venues))
      .catch(() => toast.error("Could not load venues"))
      .finally(() => setVenuesLoading(false));
    axios
      .get("/bookings/admin/payments")
      .then((res) => setPayments(res.data))
      .catch(() => toast.error("Could not load payments"));
  }, [isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="container admin-denied">
          <i className="fas fa-lock"></i>
          <h2>Master account only</h2>
          <p>Log in with the master account to add venues.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const room = 10 - photos.length;
    if (files.length > room) toast.warn("You can add up to 10 photos");
    const added = files.slice(0, room).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...added]);
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Enter an image link starting with http:// or https://");
      return;
    }
    if (photos.length >= 10) {
      toast.warn("You can add up to 10 photos");
      return;
    }
    setPhotos((prev) => [...prev, { id: url + Date.now(), url, preview: url }]);
    setImageUrl("");
  };

  const removePhoto = (id) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) revokePreview(photo);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // First photo is the card cover
  const makeCover = (id) => {
    setPhotos((prev) => {
      const pick = prev.find((p) => p.id === id);
      return [pick, ...prev.filter((p) => p.id !== id)];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const min = Number(form.capacityMin);
    const max = Number(form.capacityMax);
    if (min > max) {
      toast.error("Minimum guests can't be more than maximum guests");
      return;
    }
    if (photos.length === 0) {
      toast.error("Add at least one photo");
      return;
    }

    setSaving(true);
    try {
      // Upload local files first, then keep the photo order
      const files = photos.filter((p) => p.file);
      let uploaded = [];
      if (files.length) {
        const data = new FormData();
        files.forEach((p) => data.append("images", p.file));
        const res = await axios.post("/venues/upload", data);
        uploaded = res.data.urls;
      }
      let next = 0;
      const images = photos.map((p) => (p.file ? uploaded[next++] : p.url));

      const res = await axios.post("/venues", {
        name: form.name.trim(),
        type: form.type,
        location: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
        },
        capacity: { min, max },
        price: Number(form.price),
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        description: form.description.trim(),
        images,
      });

      toast.success(`${res.data.name} is now live`);
      setCreated((prev) => [res.data, ...prev]);
      setVenues((prev) => [res.data, ...prev]);
      setForm(emptyForm);
      photos.forEach(revokePreview);
      setPhotos([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save the venue");
    } finally {
      setSaving(false);
    }
  };

  const deleteVenue = async (venue) => {
    setDeletingId(venue._id);
    try {
      const res = await axios.delete(`/venues/${venue._id}`);
      toast.success(res.data.message);
      setVenues((prev) => prev.filter((v) => v._id !== venue._id));
      setCreated((prev) => prev.filter((v) => v._id !== venue._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete the venue");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const reviewPayment = async (booking, action) => {
    setReviewingId(booking._id);
    try {
      const res = await axios.put(`/bookings/${booking._id}/payment`, { action });
      toast.success(res.data.message);
      setPayments((prev) => prev.filter((b) => b._id !== booking._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update the payment");
    } finally {
      setReviewingId(null);
    }
  };

  const term = search.trim().toLowerCase();
  const shownVenues = term
    ? venues.filter((v) =>
        [v.name, v.location?.city, v.location?.state, v.type]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : venues;

  const cover = photos[0]?.preview || placeholderImage;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-head">
          <div>
            <p className="admin-eyebrow">Master account</p>
            <h1>Add a new venue</h1>
          </div>
          <Link to="/venues" className="btn-outline-gold">
            View all venues
          </Link>
        </div>

        {payments.length > 0 && (
          <section className="admin-section admin-payments">
            <h3>Payments to verify ({payments.length})</h3>
            <p className="admin-hint">
              Check that each UPI reference number and amount appears in your bank or
              UPI app before approving. Approving confirms the booking.
            </p>
            <ul className="manage-list">
              {payments.map((b) => (
                <li key={b._id} className="manage-row payment-row">
                  <div className="manage-info">
                    <strong className="payment-amount">
                      ₹{b.totalAmount?.toLocaleString("en-IN")}
                    </strong>
                    <span>
                      UPI ref <b>{b.paymentReference}</b> · Booking{" "}
                      {b._id.slice(-8).toUpperCase()}
                    </span>
                    <span>
                      {b.user?.name} ({b.user?.email}) · {b.venue?.name || "Venue removed"} ·{" "}
                      {new Date(b.eventDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="manage-confirm">
                    <button
                      type="button"
                      className="btn-approve"
                      disabled={reviewingId === b._id}
                      onClick={() => reviewPayment(b, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      disabled={reviewingId === b._id}
                      onClick={() => reviewPayment(b, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="admin-layout">
          <form className="admin-form" onSubmit={handleSubmit}>
            <section className="admin-section">
              <h3>Photos</h3>
              <p className="admin-hint">
                Up to 10 photos (JPG, PNG, WEBP, 5 MB each). The first photo is the
                card cover.
              </p>

              <div className="photo-grid">
                {photos.map((p, i) => (
                  <div key={p.id} className={`photo-tile ${i === 0 ? "is-cover" : ""}`}>
                    <img src={p.preview} alt={`Venue photo ${i + 1}`} />
                    {i === 0 && <span className="cover-tag">Cover</span>}
                    <div className="photo-actions">
                      {i !== 0 && (
                        <button type="button" onClick={() => makeCover(p.id)}>
                          Make cover
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() => removePhoto(p.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                {photos.length < 10 && (
                  <label className="photo-drop">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload photos</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={addFiles}
                    />
                  </label>
                )}
              </div>

              <div className="url-row">
                <input
                  type="url"
                  placeholder="…or paste an image link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <button type="button" className="clear-btn" onClick={addImageUrl}>
                  Add link
                </button>
              </div>
            </section>

            <section className="admin-section">
              <h3>Venue details</h3>
              <div className="admin-grid">
                <label className="field span-2">
                  <span>Venue name *</span>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Venue type *</span>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="banquet-hall">Banquet Hall</option>
                    <option value="marriage-lawn">Marriage Lawn</option>
                    <option value="hotel">Luxury Hotel</option>
                    <option value="destination">Destination</option>
                  </select>
                </label>
                <label className="field">
                  <span>Starting price (₹) *</span>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field span-2">
                  <span>Address *</span>
                  <input name="address" value={form.address} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>City *</span>
                  <input name="city" value={form.city} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>State *</span>
                  <input name="state" value={form.state} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Min guests *</span>
                  <input
                    type="number"
                    min="1"
                    name="capacityMin"
                    value={form.capacityMin}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Max guests *</span>
                  <input
                    type="number"
                    min="1"
                    name="capacityMax"
                    value={form.capacityMax}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field span-2">
                  <span>Amenities (comma separated)</span>
                  <input
                    name="amenities"
                    placeholder="Parking, AC, Bridal room, In-house catering"
                    value={form.amenities}
                    onChange={handleChange}
                  />
                </label>
                <label className="field span-2">
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows="5"
                    placeholder="Tell couples what makes this venue special"
                    value={form.description}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <button type="submit" className="btn-gold admin-submit" disabled={saving}>
              {saving ? "Saving venue..." : "Publish venue"}
            </button>
          </form>

          <aside className="admin-preview">
            <p className="admin-eyebrow">Card preview</p>
            <article className="vcard">
              <div className="vcard-img">
                <img src={cover} alt="Cover preview" />
                <span className="venue-badge">{form.type.replace("-", " ")}</span>
              </div>
              <div className="vcard-body">
                <h3>{form.name || "Venue name"}</h3>
                <p className="venue-meta">
                  <i className="fas fa-map-marker-alt"></i>
                  {form.city || "City"}, {form.state || "State"}
                </p>
                <p className="venue-meta">
                  <i className="fas fa-users"></i>
                  {form.capacityMin || 0} - {form.capacityMax || 0} guests
                </p>
                <div className="vcard-footer">
                  <div className="vcard-price">
                    <strong>₹{Number(form.price || 0).toLocaleString()}</strong>
                    <span>starting price</span>
                  </div>
                </div>
              </div>
            </article>
            {form.description && (
              <p className="preview-description">{form.description}</p>
            )}

            {created.length > 0 && (
              <div className="admin-created">
                <p className="admin-eyebrow">Added this session</p>
                {created.map((v) => (
                  <Link key={v._id} to={`/venues/${v._id}`}>
                    <img src={v.images?.[0] || placeholderImage} alt="" />
                    <span>{v.name}</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>

        <section className="admin-section admin-manage">
          <div className="manage-head">
            <div>
              <h3>Manage venues</h3>
              <p className="admin-hint">
                {venues.length} live venue{venues.length === 1 ? "" : "s"}. Venues with
                bookings are hidden from listings but kept for those bookings.
              </p>
            </div>
            <input
              type="search"
              className="manage-search"
              placeholder="Search by name, city or type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {venuesLoading ? (
            <p className="admin-hint">Loading venues...</p>
          ) : shownVenues.length === 0 ? (
            <p className="admin-hint">No venues found.</p>
          ) : (
            <ul className="manage-list">
              {shownVenues.map((v) => (
                <li key={v._id} className="manage-row">
                  <img src={v.images?.[0] || placeholderImage} alt="" />
                  <div className="manage-info">
                    <Link to={`/venues/${v._id}`}>{v.name}</Link>
                    <span>
                      {v.location?.city}, {v.location?.state} ·{" "}
                      {v.type?.replace("-", " ")} · ₹{v.price?.toLocaleString()}
                    </span>
                  </div>
                  {confirmId === v._id ? (
                    <div className="manage-confirm">
                      <span>Delete this venue?</span>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={deletingId === v._id}
                        onClick={() => deleteVenue(v)}
                      >
                        {deletingId === v._id ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        type="button"
                        className="clear-btn"
                        disabled={deletingId === v._id}
                        onClick={() => setConfirmId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-delete"
                      aria-label={`Delete ${v.name}`}
                      onClick={() => setConfirmId(v._id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminVenues;
