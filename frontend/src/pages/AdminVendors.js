import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import PhotoPicker, { usePhotos } from "../components/PhotoPicker";
import "./Venues.css";
import "./AdminVenues.css";
import "./AdminVendors.css";

const categories = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "makeup", label: "Bridal Makeup" },
  { value: "mehndi", label: "Mehndi" },
  { value: "catering", label: "Catering" },
  { value: "decoration", label: "Decoration" },
  { value: "music", label: "DJ & Music" },
];

const emptyForm = {
  name: "",
  category: "photography",
  providerName: "",
  price: "",
  city: "",
  state: "",
  experience: "",
  features: "",
  description: "",
};

const placeholderImage =
  "/images/1519225421980-715cb0215aed.jpg";

const splitList = (text) =>
  text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const AdminVendors = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const photoState = usePhotos();
  const { photos } = photoState;
  const [saving, setSaving] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    axios
      .get("/services?limit=1000")
      .then((res) => setVendors(res.data.services))
      .catch(() => toast.error("Could not load vendors"))
      .finally(() => setVendorsLoading(false));
  }, [isAdmin]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="container admin-denied">
          <i className="fas fa-lock"></i>
          <h2>Master account only</h2>
          <p>Log in with the master account to add vendors.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      toast.error("Add at least one photo");
      return;
    }

    setSaving(true);
    try {
      const images = await photoState.uploadAll("/services/upload");
      const experience = form.experience.trim();

      const res = await axios.post("/services", {
        name: form.name.trim(),
        category: form.category,
        providerName: form.providerName.trim(),
        price: Number(form.price),
        location: { city: form.city.trim(), state: form.state.trim() },
        experience: /^\d+(\.\d+)?$/.test(experience) ? `${experience} years` : experience,
        features: splitList(form.features),
        description: form.description.trim(),
        images,
      });

      toast.success(`${res.data.name} is now live`);
      setVendors((prev) => [res.data, ...prev]);
      setForm(emptyForm);
      photoState.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save the vendor");
    } finally {
      setSaving(false);
    }
  };

  const deleteVendor = async (vendor) => {
    setDeletingId(vendor._id);
    try {
      const res = await axios.delete(`/services/${vendor._id}`);
      toast.success(res.data.message);
      setVendors((prev) => prev.filter((v) => v._id !== vendor._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete the vendor");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const categoryLabel = (value) =>
    categories.find((c) => c.value === value)?.label || value;

  const term = search.trim().toLowerCase();
  const shownVendors = term
    ? vendors.filter((v) =>
        [v.name, v.providerName, categoryLabel(v.category), v.location?.city]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : vendors;

  const features = splitList(form.features);
  const cover = photos[0]?.preview || placeholderImage;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-head">
          <div>
            <p className="admin-eyebrow">Master account</p>
            <h1>Add a new vendor</h1>
          </div>
          <Link to="/services" className="btn-outline-gold">
            View all vendors
          </Link>
        </div>

        <div className="admin-layout">
          <form className="admin-form" onSubmit={handleSubmit}>
            <section className="admin-section">
              <h3>Photos</h3>
              <p className="admin-hint">
                Up to 10 photos (JPG, PNG, WEBP, 5 MB each). The first photo is the
                card cover.
              </p>
              <PhotoPicker photoState={photoState} label="Vendor photo" />
            </section>

            <section className="admin-section">
              <h3>Vendor details</h3>
              <div className="admin-grid">
                <label className="field span-2">
                  <span>Service name *</span>
                  <input
                    name="name"
                    placeholder="e.g. Candid Wedding Photography"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Category *</span>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Business / provider name *</span>
                  <input
                    name="providerName"
                    placeholder="e.g. Capture Moments Studio"
                    value={form.providerName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Price (₹) *</span>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="field">
                  <span>Experience</span>
                  <input
                    name="experience"
                    placeholder="e.g. 8 years"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </label>
                <label className="field">
                  <span>City *</span>
                  <input name="city" value={form.city} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>State *</span>
                  <input name="state" value={form.state} onChange={handleChange} required />
                </label>
                <label className="field span-2">
                  <span>Highlights (comma separated)</span>
                  <input
                    name="features"
                    placeholder="Pre-wedding shoot, Album design, Drone shots"
                    value={form.features}
                    onChange={handleChange}
                  />
                </label>
                <label className="field span-2">
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows="5"
                    placeholder="Tell couples what this vendor offers"
                    value={form.description}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <button type="submit" className="btn-gold admin-submit" disabled={saving}>
              {saving ? "Saving vendor..." : "Publish vendor"}
            </button>
          </form>

          <aside className="admin-preview">
            <p className="admin-eyebrow">Card preview</p>
            <article className="vendor-preview">
              <div className="vendor-preview-img">
                <img src={cover} alt="Cover preview" />
                <span className="venue-badge">{form.category}</span>
              </div>
              <div className="vendor-preview-body">
                <h3>{form.name || "Service name"}</h3>
                <p className="vendor-preview-provider">
                  by {form.providerName || "Provider name"}
                </p>
                <p className="venue-meta">
                  <i className="fas fa-map-marker-alt"></i>
                  {form.city || "City"}, {form.state || "State"}
                </p>
                {form.description && (
                  <p className="vendor-preview-desc">{form.description}</p>
                )}
                {features.length > 0 && (
                  <div className="vendor-preview-tags">
                    {features.slice(0, 3).map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                    {features.length > 3 && <span>+{features.length - 3} more</span>}
                  </div>
                )}
                <div className="vendor-preview-footer">
                  <strong>₹{Number(form.price || 0).toLocaleString()}</strong>
                  <span>
                    <i className="fas fa-star"></i> New
                  </span>
                </div>
                {form.experience && (
                  <p className="vendor-preview-exp">
                    <i className="fas fa-award"></i> {form.experience}
                    {/^\d+(\.\d+)?$/.test(form.experience.trim()) ? " years" : ""} experience
                  </p>
                )}
              </div>
            </article>
          </aside>
        </div>

        <section className="admin-section admin-manage">
          <div className="manage-head">
            <div>
              <h3>Manage vendors</h3>
              <p className="admin-hint">
                {vendors.length} live vendor{vendors.length === 1 ? "" : "s"}. Vendors in
                bookings are hidden from listings but kept for those bookings.
              </p>
            </div>
            <input
              type="search"
              className="manage-search"
              placeholder="Search by name, category or city"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {vendorsLoading ? (
            <p className="admin-hint">Loading vendors...</p>
          ) : shownVendors.length === 0 ? (
            <p className="admin-hint">No vendors found.</p>
          ) : (
            <ul className="manage-list">
              {shownVendors.map((v) => (
                <li key={v._id} className="manage-row">
                  <img src={v.images?.[0] || placeholderImage} alt="" />
                  <div className="manage-info">
                    <Link to={`/services?category=${v.category}`}>{v.name}</Link>
                    <span>
                      {v.providerName} · {categoryLabel(v.category)} ·{" "}
                      {v.location?.city || "—"} · ₹{v.price?.toLocaleString()}
                    </span>
                  </div>
                  {confirmId === v._id ? (
                    <div className="manage-confirm">
                      <span>Delete this vendor?</span>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={deletingId === v._id}
                        onClick={() => deleteVendor(v)}
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

export default AdminVendors;
