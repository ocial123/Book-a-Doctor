const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "full Name is required"],
      set: function (value) {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    phone: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "user"
    },
    isdoctor: {
      type: Boolean,
      default: false
    },
    notification: {
      type: Array,
      default: []
    },
    seennotification: {
      type: Array,
      default: []
    },
    documents: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
