const mongoose = require("mongoose");
const plan = require("./planModel");
const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob:{
      type:Date,
      required: true,
    },
    gender:{
      type:String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    notification: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
    cpassword: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    plan: {
      curentPlan: {
        type: mongoose.Types.ObjectId,
        ref: plan,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      session: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
