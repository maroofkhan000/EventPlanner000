import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Venues.css";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  // type and city live in the URL so navbar links like /venues?city=Goa preselect them
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const type = searchParams.get("type") || "";
    const city = searchParams.get("city") || "";
    setFilters((prev) =>
      prev.type === type && prev.city === city ? prev : { ...prev, type, city }
    );
  }, [searchParams]);

  const updateUrlFilters = (next) => {
    const params = {};
    if (next.type) params.type = next.type;
    if (next.city) params.city = next.city;
    setSearchParams(params, { replace: true });
  };

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
      params.append("limit", "100"); // API defaults to 10 per page

      const response = await axios.get(`/venues?${params}`);
      setVenues(response.data.venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    if (e.target.name === "type" || e.target.name === "city") {
      updateUrlFilters(next);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      city: "",
      minPrice: "",
      maxPrice: "",
    });
    updateUrlFilters({});
  };

  const getVenueImage = (venue) =>
    venue.images?.[0] ||
    "/images/1519225421980-715cb0215aed.jpg";

  return (
    <div className="venues-page">
      <div className="container venues-layout">
        {/* Filters */}
        <div className="filters-card">
          <div className="filters-head">
            <h3>Filter Venues</h3>
            <button type="button" className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="filters-grid">
            <label className="field">
              <span>Venue Type</span>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Venue Types</option>
                <option value="marriage-lawn">Marriage Lawn</option>
                <option value="hotel">Luxury Hotel</option>
                <option value="destination">Destination</option>
                <option value="banquet-hall">Banquet Hall</option>
              </select>
            </label>

            <label className="field">
              <span>City</span>
              <input
                type="text"
                name="city"
                placeholder="Search by city..."
                value={filters.city}
                onChange={handleFilterChange}
              />
            </label>

            <label className="field">
              <span>Min Price</span>
              <input
                type="number"
                name="minPrice"
                placeholder="Minimum budget"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </label>

            <label className="field">
              <span>Max Price</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Maximum budget"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </label>
          </div>
        </div>

        {/* Results */}
        <section className="venues-results">
          {loading ? (
            <div className="venues-state">
              <div className="spinner"></div>
              Loading beautiful venues...
            </div>
          ) : venues.length > 0 ? (
            <div className="venue-grid">
                {venues.map((venue) => (
                  <article key={venue._id} className="vcard">
                    <Link to={`/venues/${venue._id}`} className="vcard-img">
                      <img src={getVenueImage(venue)} alt={venue.name} loading="lazy" />
                      <span className="venue-badge">
                        {venue.type?.replace("-", " ") || "Venue"}
                      </span>
                    </Link>

                    <div className="vcard-body">
                      <h3>
                        <Link to={`/venues/${venue._id}`}>{venue.name}</Link>
                      </h3>
                      <p className="venue-meta">
                        <i className="fas fa-map-marker-alt"></i>
                        {venue.location?.city}, {venue.location?.state}
                      </p>
                      <p className="venue-meta">
                        <i className="fas fa-users"></i>
                        {venue.capacity?.min} - {venue.capacity?.max} guests
                      </p>

                      <div className="vcard-footer">
                        <div className="vcard-price">
                          <strong>₹{venue.price?.toLocaleString()}</strong>
                          <span>starting price</span>
                        </div>
                        <div className="venue-actions">
                          <Link to={`/venues/${venue._id}`} className="btn-outline-gold">
                            View Details
                          </Link>
                          <Link
                            to={`/package-builder?venue=${venue._id}`}
                            className="btn-gold"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <div className="venues-state venues-empty">
              <i className="fas fa-search"></i>
              <h3>No Venues Found</h3>
              <p>
                We couldn't find any venues matching your criteria. Try
                adjusting your filters.
              </p>
              <button type="button" className="btn-gold" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Venues;
