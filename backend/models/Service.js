const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "catering",
        "makeup",
        "photography",
        "videography",
        "decoration",
        "music",
        "mehndi",
      ],
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    images: [String],
    location: {
      city: String,
      state: String,
    },
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
        rating: Number,
        comment: String,
        createdAt: Date,
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    features: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
