const docSchema = require("../models/docModel");
const userSchema = require("../models/userModel");
const appointmentSchema = require("../models/appointmentModel");

// Get All Users Controller
const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    return res.status(200).send({
      message: "Users data list",
      success: true,
      data: users
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong", success: false });
  }
};

// Get All Doctors Controller
const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({});
    return res.status(200).send({
      message: "doctor Users data list",
      success: true,
      data: docUsers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong", success: false });
  }
};

// Approve Doctor Controller
const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status: status || "approved" },
      { new: true }
    );
    
    const targetUserId = userid || (doctor ? doctor.userId : null);
    const user = await userSchema.findOne({ _id: targetUserId });
    
    if (user) {
      user.isdoctor = (status === "approved" || status === true || !status);
      user.notification.push({
        type: "doctor-account-approved",
        message: `Your Doctor account status has been updated to ${status || "approved"}`,
        onClickPath: "/notification",
        createdAt: new Date()
      });
      await user.save();
    }

    return res.status(200).send({
      message: "Successfully updated doctor status to approved",
      success: true,
      data: doctor
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong", success: false });
  }
};

// Reject Doctor Controller
const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findOneAndUpdate(
      { _id: doctorId },
      { status: status || "rejected" },
      { new: true }
    );

    const targetUserId = userid || (doctor ? doctor.userId : null);
    const user = await userSchema.findOne({ _id: targetUserId });
    if (user) {
      user.notification.push({
        type: "doctor-account-rejected",
        message: `Your Doctor account request has been ${status || "rejected"}`,
        onClickPath: "/notification",
        createdAt: new Date()
      });
      await user.save();
    }

    return res.status(200).send({
      message: "Successfully updated Rejected status of the doctor!",
      success: true,
      data: doctor
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong", success: false });
  }
};

// Display All Appointments Controller for Admin
const displayAllAppointmentController = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find({});
    return res.status(200).send({
      success: true,
      message: "successfully fetched All Appointments",
      data: allAppointments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "something went wrong", success: false });
  }
};

module.exports = {
  getAllDoctorsControllers,
  getAllUsersControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController
};
