const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Creates the master (admin) account, or promotes and resets it if the email exists.
// Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env
const createAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Master Admin" } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first");
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 6) {
    console.error("ADMIN_PASSWORD must be at least 6 characters");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    const existed = Boolean(user);
    if (!user) user = new User({ email: ADMIN_EMAIL, name: ADMIN_NAME });

    user.role = "admin";
    user.password = ADMIN_PASSWORD; // hashed by the pre-save hook

    await user.save();
    console.log(
      `✅ Master account ${existed ? "updated" : "created"}: ${user.email}`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating master account:", error.message);
    process.exit(1);
  }
};

createAdmin();
