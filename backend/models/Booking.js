const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        date: Date,
        price: Number,
      },
    ],
    eventDate: {
      type: Date,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verifying", "paid", "failed", "refunded"],
      default: "pending",
    },
    // UPI transaction reference (UTR) the customer enters after paying
    paymentReference: {
      type: String,
      trim: true,
    },
    paymentSubmittedAt: Date,
    specialRequests: String,
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
