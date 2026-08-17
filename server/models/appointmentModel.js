const mongoose = require("mongoose");

const appointmentModelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true
    },
    userInfo: {
      type: Object,
      default: {},
      required: true
    },
    doctorInfo: {
      type: Object,
      default: {},
      required: true
    },
    date: {
      type: String,
      required: true
    },
    document: {
      type: Object
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const appointmentSchema = mongoose.model("appointment", appointmentModelSchema);
module.exports = appointmentSchema;
