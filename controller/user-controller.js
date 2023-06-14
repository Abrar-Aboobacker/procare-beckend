const user = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Plan = require("../models/planModel");
const appointment = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const { sendOtp, verifyOtp } = require("../middlewares/otp");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const moment = require("moment");
const { Console, log } = require("console");


let signupData;
module.exports = {
  userSignup: async (req, res) => {
    try {
      const { fName, lName, email, phone, password, cpassword } =
        req.body.values;
      const mobilenum = req.body.values.phone;
      const userExist = await user.findOne({ email: req.body.values.email });
      if (userExist) {
        return res
          .status(200)
          .send({ message: "user already exists", success: false });
      } else {
        signupData = {
          fName,
          lName,
          email,
          phone,
          password,
          cpassword,
        };
        sendOtp(mobilenum);
        res.status(200).send({
          message: "otp is resend to your mobile number",
          success: true,
        });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "error while creating user", success: false, err });
    }
  },
  resendUserOtp: async (req, res, next) => {
    try {
      const { userNum } = req.body;
      if(userNum){
        sendOtp(userNum);
      }else{
        res
        .status(500)
        .send({ message: "error while resending otp", success: false });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "error while resending otp", success: false, err });
    }
  },
  postOtp: async (req, res, next) => {
    // let { fName, lName, email, phone, cpassword } = signupData;
    // let { password } = signupData;
    const otp = req.body.values.otpis;
    try {
      if(signupData?.phone){
        await verifyOtp(signupData?.phone, otp).then(async (verification_check) => {
          if (verification_check.status == "approved") {
            signupData.password = await bcrypt.hash(signupData.password, 10);
            signupData.cpassword = await bcrypt.hash(signupData.cpassword, 10);
            let members = new user({
              fName: signupData.fName,
              lName: signupData.lName,
              email: signupData.email,
              phone: signupData.phone,
              password: signupData.password,
              cpassword: signupData.cpassword,
            });
            await members.save();
            res
              .status(200)
              .send({ message: "user created successfully", success: true });
          }
        });
      }else{
        res.status(500).send({ message: "phone number is missing please signup once more", success: false });
      }
     
    } catch (error) {
     console.log(error);
      next(error);
      res.status(500).send({ message: "error creating user", success: false });
    }
  },
  userLogin: async (req, res) => {
    try {
      const userz = await user.findOne({ email: req.body.values.email });
      if (userz) {
        const isMatch = await bcrypt.compare(
          req.body.values.password,
          userz.password
        );
        if (isMatch) {
          const usertoken = jwt.sign(
            { userId: userz._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );
          res.status(200).send({
            message: "Login successful",
            success: true,
            data: usertoken,
            userz,
          });
        } else {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        }
      } else {
        return res
          .status(200)
          .send({ message: "user does not exist", success: false });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong ", success: false, error });
    }
  },
  userInfo: async (req, res) => {
    try {
      const userz = await user.findById({ _id: req.userId });
      userz.password = undefined;
      if (!userz) {
        return res
          .status(200)
          .send({ message: "user does not exist", success: false });
      } else {
        res.status(200).send({ success: true, data: userz });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  userProfileEdit: async (req, res) => {
    try {
      const information = req.body;
      await user.updateOne(
        { _id: req.userId },
        {
          $set: {
            fName: information.fName,
            lName: information.lName,
            phone: information.phone,
            email: information.email,
            dob: information.dob,
            gender: information.gender,
          },
        }
      );
      const userr = await user.findById({ _id: req.userId });
      res.status(200).send({
        success: true,
        message: "User Profile is edited",
        data: userr,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  userProfilePicUpload: async (req, res) => {
   
    try {
     
      if(req?.file?.path){
        const path = req.file.path.replace("public", "");
        await user.updateOne(
          { _id: req.userId },
          {
            $set: {
              profile: path,
            },
          }
        );
        const userr = await user.findById({ _id: req.userId });
        res.status(200).send({
          success: true,
          message: "Doctor Profile is edited",
          data: userr,
        });
      }else{
        res
        .status(404)
        .send({ message: "Please select a profile picture", success: false });
      }
    
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  getAllDoctors: async (req, res) => {
    try {
      const allDoctors = await Doctor.find({ isActive: "Active" });
      allDoctors.forEach((doctor) => {
        doctor.password = undefined;
        doctor.cpassword = undefined;
        doctor.file = undefined;
      });
      res.status(200).send({
        message: "doctor data",
        success: true,
        data: allDoctors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error while fetching doctor",
        success: false,
        error,
      });
    }
  },
  getAllPlans: async (req, res) => {
    try {
      const allPlans = await Plan.find();
      res.status(200).send({
        message: "plans",
        success: true,
        data: allPlans,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error while fetching plans", success: false, error });
    }
  },
  planOrder: async (req, res) => {
    try {
      const { _id, name, sessions, benefits, isActice, price } = req.body;
      const instance = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret,
      });
      const options = {
        amount: price * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
      };
      instance.orders.create(options, (error, order) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .send({ message: "something went wrong", success: false });
        } else {
          res.status(200).send({ success: true, data: order });
        }
      });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .send({ success: false, message: "internal server error" });
    }
  },
  paymentVerify: async (req, res) => {
    try {
      var planId = req.body.price._id;
      var sessions = req.body.price.sessions;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body.response;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.key_secret)
        .update(sign.toString())
        .digest("hex");
      if (razorpay_signature === expectedSign) {
        await user.findByIdAndUpdate(
          { _id: req.userId },
          {
            $set: {
              "plan.curentPlan": planId,
              "plan.isActive": true,
              "plan.session": sessions,
            },
          }
        );
        return res
          .status(200)
          .send({ message: "You parchased a plan", success: true });
      } else {
        return res
          .status(400)
          .send({ message: "invalid signature", success: false });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "internal server error" });
    }
  },
  singleDoctorDetails: async (req, res) => {
    try {
      id = req.params.id;
      const doctorDetail = await Doctor.findById({ _id: id });
      doctorDetail.password = undefined;
      doctorDetail.cpassword = undefined;
      const availableDays = [];
      doctorDetail.availability.forEach((day) => {
        if (day.status == "active") availableDays.push(day.day);
      });
      if (doctorDetail) {
        res.status(200).send({
          success: true,
          message: "details fetched",
          data: doctorDetail,
          availableDays,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "error while fetching doctor details",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "internal server error" });
    }
  },
  isPlanPresent: async (req, res) => {
    try {
      const userz = await user.findById({ _id: req.userId });
      const plan = userz.plan.isActive;
      const session = userz.plan.session
      if (plan == false) {
        return res
          .status(200)
          .send({ message: "Please purchase a plan ", success: true });
      }else if(session <=0) {
        res.status(200).send({message:"Your plan is expired. Please purchase a plan",success:true})
      }else {
        res.status(200).send({ success: false, data: userz });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  verifyAppointment: async (req, res) => {
    try {
      console.log(req.body)
      const { date, timeId, doctor, time } = req.body;
      const client = req.userId;
      const selectedDay = moment(date).format("dddd");
      console.log(selectedDay);
      Doctor.findOne(
        {
          _id: doctor,
          "availability.day": selectedDay,
          "availability.time._id": timeId,
        },
        {
          "availability.$": 1,
        }
      ).then(async (doctors) => {
        console.log(doctors);
        if (!doctors) {
          res.status(200).send({
            message: "Doctor not found",
            success: false,
          });
          return;
        }
        const availablity = doctors.availability[0];
        const times = availablity.time.find((t) => t._id == timeId);
        if (!times) {
          res.status(200).send({
            message: "Time not available",
            success: false,
          });
          return;
        }

        const totalSlots = times.slots;
        const toTime = moment(times.start).format(" h:mm a");
        const allreadyBooked = await appointment.find({
          doctor: doctor,
          date: date,
          time: toTime,
          client: client,
        });
        if (allreadyBooked.length !== 0) {
          res.status(200).send({
            message: "You have already booked this slot",
            success: false,
          });
          return;
        }

        const apointments = await appointment.find({
          doctor: doctor,
          date: date,
          time: toTime,
        });
        var appointmentsCount = apointments.length;
        if (totalSlots <= appointmentsCount) {
          res.status(200).send({
            message: "The selected slot is no longer available.",
            success: false,
          });
          return;
        } else {
          // it is for updating the plan session
          const userSession = await user.findOne({ _id: req.userId });
          const session = userSession.plan.session;
          if (session > 0) {
            const userUpdate = await user.findOneAndUpdate(
              { _id: req.userId },
              {
                $set: {
                  "plan.session": session - 1,
                },
              }
            );
            const token = appointmentsCount + 1;
            const newAppointment = new appointment({
              date: date,
              time: toTime,
              doctor: doctor,
              token: token,
              client: client,
            });
            await newAppointment.save();
            const doctorNotification = await Doctor.findOne({ _id: doctor });
            const notification = doctorNotification.notification;
            notification.push({
              type: "New appointment-request",
              message: `New appointment request from ${
                userSession.fName + " " + userSession.lName
              }`,
              onClickPath: "/user/appointment",
            });
            await Doctor.findOneAndUpdate(doctor, { notification });
            res.send({
              schedulTime: toTime,
              token: appointmentsCount + 1,
              message: "Appointment verifyd.",
              success: true,
            });
          } else {
            res.status(200).send({
              success: false,
              message: "session is expired.please purchase a plan ",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `client getSearchDoctor  controller ${error.message}`,
      });
    }
  },
  availableSlot: async (req, res) => {
    try {
      const { id, selectedDay } = req.params;
      const doctorr = await Doctor.findById(id);
      const availability = doctorr.availability.find(
        (day) => day.day === selectedDay
      );

      if (!availability) {
        res.status(200).send({
          message: "Doctor is not available on this day.",
          success: false,
        });
        return;
      }
      // return availability for selected day
      res.status(201).send({ availability, success: true });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `client getSearchDoctor  controller ${error.message}`,
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const userr = await user.findOne({ _id: req.userId });
      const isMatch = await bcrypt.compare(
        req.body.values.currentPassword,
        userr.password
      );
      if (isMatch) {
        password = await bcrypt.hash(req.body.values.password, 10);
        cpassword = await bcrypt.hash(req.body.values.cpassword, 10);
        await user.updateOne(
          { _id: req.userId },
          {
            $set: {
              password: password,
              cpassword: cpassword,
            },
          }
        );
        const updateUser = await user.findOne({ _id: req.userId });
        res
          .status(200)
          .send({ message: "Password Change Successfully", success: true });
      } else {
        res
          .status(200)
          .send({ message: "Current Password is not correct", success: false });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getPendingAppointments: async (req, res) => {
    try {
      const pendingAppointments = await appointment
        .find({
          user: req.userId,
          status: "pending",
        })
        .populate("doctor")
        .sort({ updatedAt: -1 });
      if (pendingAppointments) {
        res.status(200).send({ pendingAppointments, success: true });
      } else {
        return res
          .status(200)
          .send({ message: "No pending appointments", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `getAppointment controller ${error.message}`,
      });
    }
  },
  cancelAppointment: async (req, res) => {
    try {
      const appointmentt = await appointment.findByIdAndUpdate(
        req.body.id,
        { status: "cancelled" },
        { new: true }
      );

      if (appointmentt) {
        const client = await user.findById(appointmentt.client);
        const id = client._id;
        const session = client.plan.session;
        await user.findOneAndUpdate(
          { _id: appointmentt.client },
          {
            $set: {
              "plan.session": session + 1,
            },
          }
        );

        res.status(201).send({
          message: ` Patient Booking cancelled`,
          success: true,
        });
      } else {
        return res.status(200).send({
          message: `Patient  doesnot exist`,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `rejectDoctorAppointment controller ${error.message}`,
      });
    }
  },
  getAppointmentHistory: async (req, res) => {
    try {
      const userId = req.userId;
      const appointmentHistory = await appointment
        .find({
          client: userId,
          // status: { $nin: ["pending"] },
          // $or:[{status:'completed'},{status:'cancelled'}]
        })
        .populate("doctor")
        .sort({ updatedAt: -1 });
      if (appointmentHistory) {
        res.status(201).send({ appointmentHistory, success: true });
      } else {
        return res
          .status(200)
          .send({ message: "No notifications Exist  ", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `getDoctorAppointmentHistory controller ${error.message}`,
      });
    }
  },
  getAllNotification:async(req,res)=>{
    try {
      const userr = await user.findOne({ _id: req.userId });
      const userNotification = userr.notification;
      const userSeenNotification = userr.seennotification;
      res
        .status(200)
        .send({success:true, userNotification, userSeenNotification });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `getAllNotifications  controller ${error.message}`,
      });
    }
  },
  markAllNotification: async (req, res) => {
    try {
      const userr = await user.findOne({ _id: req.userId });
      const seennotification = userr.seennotification;
      const notification = userr.notification;
      seennotification.push(...notification);
      userr.notification = [];
      userr.seennotification = notification;

      const updateUser = await user.updateOne(
        { _id: req.userId },
        { $set: { notification: [], seennotification: notification } }
      );

      res.status(200).send({
        message: "all notifications marked as read",
        success: true,
        data: updateUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error in notification",
        success: false,
        error,
      });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const updateUser = await user.updateOne(
        { _id: req.userId },
        { $set: { notification: [], seennotification: [] } }
      );
      res.status(200).send({
        message: "all notifications are deleted successfully",
        success: true,
        data: updateUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error in notification", success: false, error });
    }
  },
  getChatContacts:async(req,res)=>{
    try {
      const isActive = await appointment.find({ status: "active" }).distinct("doctor");
      if(isActive){
        const doctors = await Doctor.find({ _id: { $in: isActive } });
        res.status(200).send({message:"detials fetched successfully",data:doctors,success:"true"})
      }
      
    } catch (error) {
      console.log(error);
    }
  }
};
