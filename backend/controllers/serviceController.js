const Service = require("../models/Service");
const Booking = require("../models/Booking");
const { uploadedUrls, removeUploadedImages } = require("../middleware/upload");
const { todayIST, dayRange } = require("../utils/dates");

// True if the vendor already has an active booking on that day
const isServiceBooked = async (serviceId, dateStr) => {
  const range = dayRange(dateStr);
  if (!range) return false;
  const existing = await Booking.exists({
    "services.service": serviceId,
    status: { $ne: "cancelled" },
    eventDate: { $gte: range.start, $lt: range.end },
  });
  return Boolean(existing);
};

// Check if a vendor is free on a given date
const getServiceAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !dayRange(date)) {
      return res.status(400).json({ message: "A valid date is required" });
    }

    if (date < todayIST()) {
      return res.json({ available: false, message: "Date is in the past" });
    }

    const service = await Service.findById(req.params.id);
    if (!service || !service.available) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const booked = await isServiceBooked(service._id, date);
    res.json({
      available: !booked,
      message: booked
        ? `${service.providerName} is already booked on this date`
        : `${service.providerName} is available on this date`,
    });
  } catch (error) {
    console.error("Vendor availability error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all services
const getServices = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let query = { available: true };
    if (category) query.category = category;

    const services = await Service.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get single service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service && service.available) {
      res.json(service);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    console.error("Get service error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Create service
const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    console.error("Create service error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Upload vendor photos, returns their public URLs
const uploadServiceImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }
  res.status(201).json({ urls: uploadedUrls(req, "vendors") });
};

// Delete vendor. Vendors in active bookings are hidden instead, so those
// bookings keep their details; others are removed with their photos.
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || !service.available) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const hasBookings = await Booking.exists({
      "services.service": service._id,
      status: { $ne: "cancelled" },
    });

    if (hasBookings) {
      service.available = false;
      await service.save();
      return res.json({
        message: `${service.name} was removed from listings (kept for its existing bookings)`,
      });
    }

    await service.deleteOne();
    removeUploadedImages(service.images, "vendors");

    res.json({ message: `${service.name} was deleted` });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  uploadServiceImages,
  deleteService,
  getServiceAvailability,
  isServiceBooked,
};
