const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/userModel");
const docSchema = require("../models/docModel");
const appointmentSchema = require("../models/appointmentModel");

// Register User
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res.status(200).send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `${error.message}` });
  }
};

// Login User
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY || "medicare_secret_key_12345", {
      expiresIn: "1d"
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login successfully",
      success: true,
      token,
      userData: user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: `Error in login: ${error.message}`, success: false });
  }
};

// Auth Controller - Get logged-in user info
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    user.password = undefined;
    return res.status(200).send({
      success: true,
      data: user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Auth error", success: false, error });
  }
};

// Apply to become a doctor
const docController = async (req, res) => {
  try {
    const doctorData = typeof req.body.doctor === "string" ? JSON.parse(req.body.doctor) : (req.body.doctor || req.body);
    const userId = req.body.userId || doctorData.userId;
    
    // Check if already applied
    const existingDoc = await docSchema.findOne({ userId });
    if (existingDoc) {
      return res.status(200).send({ message: "Doctor account already applied", success: false });
    }

    const newDoctor = new docSchema({
      ...doctorData,
      userId: userId,
      status: "pending"
    });
    await newDoctor.save();

    // Push notification to admin user
    const adminUser = await userSchema.findOne({ type: "admin" });
    if (adminUser) {
      adminUser.notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.fullName} has applied for a doctor account`,
        onClickPath: "/admin/doctors",
        createdAt: new Date()
      });
      await adminUser.save();
    }

    return res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while applying for doctor"
    });
  }
};

// Mark all notifications as seen
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    user.seennotification.push(...user.notification);
    user.notification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    return res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in notification",
      success: false,
      error
    });
  }
};

// Delete all seen notifications
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    return res.status(200).send({
      success: true,
      message: "Notifications cleared successfully",
      data: updatedUser
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in notification deletion",
      success: false,
      error
    });
  }
};

// Get all approved doctors for users
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docSchema.find({ status: "approved" });
    return res.status(200).send({
      success: true,
      message: "Approved Doctors List Fetched Successfully",
      data: doctors
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error fetching approved doctors"
    });
  }
};

// Book an appointment
const appointmentController = async (req, res) => {
  try {
    const { doctorId, userId, date } = req.body;
    let userInfo = req.body.userInfo;
    let doctorInfo = req.body.doctorInfo;

    if (typeof userInfo === "string") userInfo = JSON.parse(userInfo);
    if (typeof doctorInfo === "string") doctorInfo = JSON.parse(doctorInfo);

    if (!userInfo) {
      const u = await userSchema.findById(userId);
      userInfo = u ? { name: u.fullName, email: u.email, phone: u.phone } : {};
    }
    if (!doctorInfo) {
      const d = await docSchema.findById(doctorId);
      doctorInfo = d ? { fullName: d.fullName, specialization: d.specialization, phone: d.phone } : {};
    }

    let document = null;
    if (req.file) {
      document = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype
      };
      
      // Store in user document history
      const userObj = await userSchema.findById(userId);
      if (userObj) {
        userObj.documents.push(document);
        await userObj.save();
      }
    }

    const newAppointment = new appointmentSchema({
      userId,
      doctorId,
      userInfo,
      doctorInfo,
      date,
      document,
      status: "pending"
    });
    await newAppointment.save();

    // Push notification to doctor user
    const doctorObj = await docSchema.findById(doctorId);
    if (doctorObj && doctorObj.userId) {
      const doctorUser = await userSchema.findById(doctorObj.userId);
      if (doctorUser) {
        doctorUser.notification.push({
          type: "New-appointment-request",
          message: `A new appointment request from ${userInfo.name || "Patient"} on ${date}`,
          onClickPath: "/doctor/appointments",
          createdAt: new Date()
        });
        await doctorUser.save();
      }
    }

    return res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment"
    });
  }
};

// Get user appointments
const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentSchema.find({ userId: req.body.userId });
    
    // Fetch doctor names if needed
    const doctorIds = appointments.map((app) => app.doctorId);
    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = appointments.map((appointment) => {
      const doc = doctors.find((d) => d._id.toString() === appointment.doctorId.toString());
      return {
        ...appointment.toObject(),
        docName: doc ? doc.fullName : (appointment.doctorInfo ? appointment.doctorInfo.fullName : "Doctor")
      };
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: appointmentsWithDoctor
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "something went wrong",
      success: false,
      error
    });
  }
};

// Get user docs
const getDocsController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    const allDocs = user ? user.documents : [];
    return res.status(200).send({
      message: "All user documents retrieved",
      success: true,
      data: allDocs
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "something went wrong",
      success: false,
      error
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController
};
