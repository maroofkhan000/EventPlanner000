const Service = require("../models/Service");

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

    if (service) {
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

module.exports = {
  getServices,
  getServiceById,
  createService,
};
