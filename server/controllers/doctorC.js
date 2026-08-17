const docSchema = require("../models/docModel");
const appointmentSchema = require("../models/appointmentModel");
const userSchema = require("../models/userModel");
const fs = require("fs");
const path = require("path");

// Update Doctor Profile
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor profile not found" });
    }
    return res.status(200).send({
      success: true,
      data: doctor,
      message: "successfully updated profile"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "something went wrong",
      success: false
    });
  }
};

// Get All Doctor Appointments
const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(200).send({
        message: "No doctor profile found for this user",
        success: true,
        data: []
      });
    }
    const allAppointments = await appointmentSchema.find({ doctorId: doctor._id });
    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: allAppointments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "something went wrong",
      success: false
    });
  }
};

// Handle Appointment Status
const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentSchema.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).send({ success: false, message: "Appointment not found" });
    }

    // Send notification to patient user
    const user = await userSchema.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "status-updated",
        message: `Your appointment status has been updated to ${status}`,
        onClickPath: "/user/appointments",
        createdAt: new Date()
      });
      await user.save();
    }

    return res.status(200).send({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "something went wrong",
      success: false
    });
  }
};

// Document Download Controller
const documentDownloadController = async (req, res) => {
  try {
    const appointId = req.query.appointId;
    const appointment = await appointmentSchema.findById(appointId);
    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found", success: false });
    }

    const documentUrl = appointment.document?.path;
    if (!documentUrl || typeof documentUrl !== "string") {
      return res.status(404).send({ message: "Document URL is invalid", success: false });
    }

    const absoluteFilePath = path.isAbsolute(documentUrl)
      ? documentUrl
      : path.join(__dirname, "..", documentUrl);

    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).send({ message: "File not found", success: false });
    }

    const fileName = appointment.document.originalname || path.basename(absoluteFilePath);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", appointment.document.mimetype || "application/octet-stream");

    const fileStream = fs.createReadStream(absoluteFilePath);
    fileStream.on("error", (err) => {
      console.log(err);
      return res.status(500).send({ message: "Error reading the document", success: false });
    });
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController
};
