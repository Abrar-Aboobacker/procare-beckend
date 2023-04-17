const user = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Plan = require("../models/planModel");
const bcrypt = require("bcryptjs");
const { sendOtp, verifyOtp } = require("../middlewares/otp");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { log } = require("console");
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
        res
          .status(200)
          .send({
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
      console.log(userNum);
      sendOtp(userNum);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "error while resending otp", success: false, err });
    }
  },
  postOtp: async (req, res, next) => {
    let { fName, lName, email, phone, cpassword } = signupData;
    let { password } = signupData;
    const otp = req.body.values.otpis;
    try {
      await verifyOtp(phone, otp).then(async (verification_check) => {
        if (verification_check.status == "approved") {
          password = await bcrypt.hash(signupData.password, 10);
          cpassword = await bcrypt.hash(signupData.cpassword, 10);
          let members = new user({
            fName: fName,
            lName: lName,
            email: email,
            phone: phone,
            password: password,
            cpassword: cpassword,
          });
          await members.save();
          res
            .status(200)
            .send({ message: "user created successfully", success: true });
        }
      });
    } catch (error) {
      console.log(error);
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
          res
            .status(200)
            .send({
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
          .send({ message: "Doctor does not exist", success: false });
      } else {
        res.status(200).send({ success: true, data: userz });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  getAllDoctors: async (req, res) => {
    try {
      const allDoctors = await Doctor.find({ isActive: "active" });
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
      res
        .status(500)
        .send({
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
        const {_id,name,sessions,benefits,isActice,price }=req.body
      const instance = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret,
      });
      const options = {
        amount: price*100,
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
          console.log(order);
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
     var planId =req.body.price._id
     var sessions = req.body.price.sessions
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body.response;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.key_secret)
        .update(sign.toString())
        .digest("hex");
        if(razorpay_signature === expectedSign){
          await user.findByIdAndUpdate({_id:req.userId},{
            $set:{
              "plan.curentPlan":planId,
              "plan.isActive":true,
              "plan.session":sessions
            }
          })
            return res.status(200).send({ message:"payment verified successfully",success:true });
        }else{
            return res.status(400).send({ message:"invalid signature",success:false})
        }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "internal server error" });
    }
  },
};
