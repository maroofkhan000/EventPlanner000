const mongoose = require("mongoose");

const venueSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["marriage-lawn", "hotel", "destination", "banquet-hall"],
      required: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    capacity: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    amenities: [String],
    images: [String],
    description: String,
    availableDates: [Date],
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Venue", venueSchema);
