const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const user = require("../models/userModel");
const Plan = require("../models/planModel");
const AppointmentModel = require("../models/AppointmentModel");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      const adminz = await Admin.findOne({ email: req.body.email });
      if (adminz) {
        const isMatch = await bcrypt.compare(
          req.body.password,
          adminz.password
        );
        if (isMatch) {
          const admintoken = jwt.sign(
            { adminId: adminz._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res
            .status(200)
            .send({
              message: "Login successful",
              success: true,
              data: admintoken,
              adminz,
            });
        } else {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        }
      } else {
        return res
          .status(200)
          .send({ message: "Admin does not exist", success: false });
      }
      //   const isMatch = await
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "error logginf in ", success: false, error });
    }
  },
  adminInfo: async (req, res) => {
    try {
      let adminz = await Admin.findById({ _id: req.adminId });
      // console.log(adminz);
      adminz.password = undefined;
      if (!adminz) {
        return res
          .status(200)
          .send({ message: "admin does not exist", success: false });
      } else {
        // console.log("here");
        res.status(200).send({ success: true, data: adminz });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },

  getAllNotification: async (req, res) => {
    try {
      const adminz = await Admin.findOne({ _id: req.body.adminId });
      const seennotification = adminz.seennotification;
      const notification = adminz.notification;
      seennotification.push(...notification);
      adminz.notification = [];
      adminz.seennotification = notification;

      const updateAdmin = await Admin.updateOne(
        { _id: req.body.adminId },
        { $set: { notification: [], seennotification: notification } }
      );

      res.status(200).send({
        message: "all notifications marked as read",
        success: true,
        data: updateAdmin,
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
      const updateAdmin = await Admin.updateOne(
        { _id: req.body.adminId },
        { $set: { notification: [], seennotification: [] } }
      );
      res.status(200).send({
        message: "all notifications are deleted successfully",
        success: true,
        data: updateAdmin,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error in notification", success: false, error });
    }
  },
  getNewDoctors:async(req,res)=>{
    try {
      const newDoctor = await Doctor.find({$or:[{isActive:'pending'},{isActive:'rejected'}]})
      res.status(200).send({
        message:"New doctor data",
        success:true,
        data:newDoctor
      })
      console.log(newDoctor)
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"Error while fetching new doctor",success:false,error})
    }
  },
  approvingDoctor:async(req,res)=>{
    try {
      // const {doctorId}=req.body
      const approveDoctor = await Doctor.findOneAndUpdate({_id:req.body.doctorId},{
        $set:{isActive:"active"}
      })
      res.status(200).send({
        message: "doctor approved",
        success: true,
        data: approveDoctor,
      });
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"error while approving doctor",success:false,error})
    }
  },
  rejectDoctor:async(req,res)=>{
    try {
      const {doctorId}=req.body
      const reason = req.body.reason
      const rejectDoctor = await Doctor.findOneAndUpdate({_id:req.body.doctorId},{
        $set:{
          isActive:"rejected",
          rejectReason:reason
      }
      })
      res.status(200).send({
        message: 'Doctor rejected',
        success: true,
        data: rejectDoctor
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({message:"error while reject doctor",success:false,error})
    }
  },
  getAllDoctors:async (req,res)=>{
    try {
      const allDoctors = await Doctor.find({isActive:'active'})
      res.status(200).send({
        message: "doctor data",
        success: true,
        data:allDoctors
      })
    }catch (error) {
      console.log(error)
      res.status(500).send({message:"Error while fetching doctor",success:false,error})
    }
  },
  getAllUsers:async (req,res)=>{
    try {
      const allUsers = await user.find({})
      res.status(200).send({
        message: "User data",
        success: true,
        data:allUsers
      })
    }catch (error) {
      console.log(error)
      res.status(500).send({message:"Error while fetching User",success:false,error})
    }
  },
  getAllPlans:async (req,res)=>{
    try {
      const allPlans = await Plan.find()
      res.status(200).send({
        message: "plans",
        success: true,
        data:allPlans
      })
    }catch (error) {
      console.log(error)
      res.status(500).send({message:"Error while fetching plans",success:false,error})
    }
  },
  addPlan:async (req,res)=>{
    const {name,sessions,benefits,price}=req.body.values
    const plans = new Plan({
        name:name,
        sessions:sessions,
        benefits:benefits,
        price:price
    })
   await plans.save()
   console.log(plans);
   res.status(200).send({message:"plan is created successfully",success:true,data:plans })
  },
 getAllAppointments: async (req, res) => {
    try {

      const appointments = await AppointmentModel.find()
        .populate("client")
        .populate("doctor")
        .sort({ updatedAt: 1 })
      if (!appointments) {
        return res
          .status(200)
          .send({ message: "No Appointments exist ", success: false });
      } else {
        res.status(201).send({ appointments,
          success: true });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `getAllAppointments controller ${error.message}`,
      });
    }
  }
  
};
