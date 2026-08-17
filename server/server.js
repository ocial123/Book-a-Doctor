const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const connectToDB = require("./config/connectToDB");
const userModel = require("./models/userModel");
const docModel = require("./models/docModel");
const appointmentModel = require("./models/appointmentModel");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect Database
connectToDB().then(() => {
  seedInitialData();
});

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(uploadsDir));

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).send("Book a Doctor Backend API is up and running!");
});

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));


// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ message: "Something went wrong", success: false, error: err.message });
});

// Initial Seeding Function
async function seedInitialData() {
  try {
    const userCount = await userModel.countDocuments();
    if (userCount === 0) {
      console.log("Seeding default demo data...");
      const salt = await bcrypt.genSalt(10);

      // 1. Admin
      const adminPass = await bcrypt.hash("admin123", salt);
      const admin = await userModel.create({
        fullName: "System Admin",
        email: "admin@medicare.com",
        password: adminPass,
        phone: "555-0100",
        type: "admin",
        isdoctor: false
      });

      // 2. Approved Doctor User & Profile
      const docPass = await bcrypt.hash("doctor123", salt);
      const docUser1 = await userModel.create({
        fullName: "Dr. Indrajeet Kadam",
        email: "dr.indrajeet@medicare.com",
        password: docPass,
        phone: "9876543210",
        type: "user",
        isdoctor: true
      });

      const doc1 = await docModel.create({
        userId: docUser1._id,
        fullName: "Dr. Indrajeet Kadam",
        email: "dr.indrajeet@medicare.com",
        phone: "9876543210",
        address: "742 Evergreen Terrace, Medical District, Mumbai",
        specialization: "Cardiology",
        experience: "12 Years",
        fees: 500,
        status: "approved",
        timings: { start: "09:00", end: "17:00" }
      });

      // 3. Pending Doctor User & Profile
      const docUser2 = await userModel.create({
        fullName: "Dr. Emily Watson",
        email: "dr.watson@medicare.com",
        password: docPass,
        phone: "555-0188",
        type: "user",
        isdoctor: false
      });

      await docModel.create({
        userId: docUser2._id,
        fullName: "Dr. Emily Watson",
        email: "dr.watson@medicare.com",
        phone: "555-0188",
        address: "100 Innovation Way, Suite 400, NY",
        specialization: "Neurology",
        experience: "8 Years",
        fees: 200,
        status: "pending",
        timings: { start: "10:00", end: "16:00" }
      });

      // 4. Patient User
      const patientPass = await bcrypt.hash("patient123", salt);
      const patientUser = await userModel.create({
        fullName: "John Doe",
        email: "john@gmail.com",
        password: patientPass,
        phone: "555-0123",
        type: "user",
        isdoctor: false
      });

      // 5. Sample Appointment
      await appointmentModel.create({
        userId: patientUser._id,
        doctorId: doc1._id,
        userInfo: { name: patientUser.fullName, email: patientUser.email, phone: patientUser.phone },
        doctorInfo: { fullName: doc1.fullName, specialization: doc1.specialization, phone: doc1.phone },
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace("T", " "),
        status: "pending"
      });

      console.log("Demo data seeded successfully!");
    }
  } catch (err) {
    console.error("Error seeding initial data:", err);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
