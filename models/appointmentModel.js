const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "users",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "doctors",
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    consultationFees: {
      type: Number,
    },
    date: {
      type: String,
    },
  
    time: {
      type: String,
    },
    token: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Appointments", appointmentSchema);
