import React from "react";
import "./FilterBar.css";

export const VENUE_TYPES = [
  { value: "marriage-lawn", label: "Marriage Lawn" },
  { value: "hotel", label: "Luxury Hotel" },
  { value: "destination", label: "Destination" },
  { value: "banquet-hall", label: "Banquet Hall" },
];

export const VENDOR_TYPES = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "music", label: "DJ & Music" },
  { value: "catering", label: "Catering" },
  { value: "makeup", label: "Makeup Artists" },
  { value: "decoration", label: "Decoration" },
  { value: "mehndi", label: "Mehndi Artists" },
];

export const EMPTY_FILTERS = { city: "", minPrice: "", maxPrice: "" };

// Shared filter card: a type select plus city and price range fields.
// typeName is the key in `values` the select edits ("type" for venues, "category" for vendors).
const FilterBar = ({
  title,
  typeName,
  typeLabel,
  allTypesLabel,
  typeOptions,
  values,
  onChange,
  onClear,
}) => (
  <div className="filters-card">
    <div className="filters-head">
      <h3>{title}</h3>
      <button type="button" className="clear-btn" onClick={onClear}>
        Clear Filters
      </button>
    </div>

    <div className="filters-grid">
      <label className="field">
        <span>{typeLabel}</span>
        <select name={typeName} value={values[typeName]} onChange={onChange}>
          <option value="">{allTypesLabel}</option>
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>City</span>
        <input
          type="text"
          name="city"
          placeholder="Search by city..."
          value={values.city}
          onChange={onChange}
        />
      </label>

      <label className="field">
        <span>Min Price</span>
        <input
          type="number"
          name="minPrice"
          placeholder="Minimum budget"
          value={values.minPrice}
          onChange={onChange}
        />
      </label>

      <label className="field">
        <span>Max Price</span>
        <input
          type="number"
          name="maxPrice"
          placeholder="Maximum budget"
          value={values.maxPrice}
          onChange={onChange}
        />
      </label>
    </div>
  </div>
);

// Client-side version of the API filters, for pages that already hold the full list
export const matchesFilters = (item, values, typeName) => {
  if (values[typeName] && item[typeName] !== values[typeName]) return false;
  const city = values.city.trim().toLowerCase();
  if (city && !item.location?.city?.toLowerCase().includes(city)) return false;
  if (values.minPrice && item.price < Number(values.minPrice)) return false;
  if (values.maxPrice && item.price > Number(values.maxPrice)) return false;
  return true;
};

export default FilterBar;
