const doctor = require("../models/doctorModel");
const admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const nodeUser = process.env.nodeMailer_User;
const nodePass = process.env.SMTP_key_value;
const port = process.env.SMTP_PORT;
const host = process.env.host;
let signupData;
let otp = null;
const mailer = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: nodeUser,
    pass: nodePass,
  },
});

let sendEmailOTP = (email, otpEmail) => {
  console.log(otpEmail);

  const mailOptions = {
    to: email,
    from: nodeUser,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for email verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otpEmail +
      "</h1>", // html body
  };
  return mailer.sendMail(mailOptions);
};
module.exports = {
  doctorSignup: async (req, res) => {
    try {
      const { name, email, phone, password, cpassword, about } =
        req.body.values;
      const doctorExist = await doctor.findOne({ email: email });
      if (!doctorExist) {
       
        signupData = {
          name,
          email,
          phone,
          password,
          cpassword,
          about,
        };
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(email,otpEmail)
        .then((info) => {
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        })
        .catch((error) => {
            console.log(error);
          throw error;
        });
        res.status(200).send({message:'Otp is send to given email address',success:true,doctorExist})
       
      } else{
            return res.status(200).send({message:"user already exists",success:false}); 
      }
    } catch (error) {
      console.log("heeeeeeeeeeeeee");
      console.log(error);
      res.status(500).send({ message: "error creating user", success: false });
    }
  },
  resendDoctorOtp:async(req,res,next)=>{
    try {
        const {doctorEmail}=req.body
        const otpEmail = Math.floor(1000 + Math.random() * 9000);
        otp = otpEmail;
        sendEmailOTP(doctorEmail,otpEmail)
        .then((info) => {
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        })
        .catch((error) => {
          throw error;
        });
        res.status(200).send({message:'Otp is resend to given email address',success:true})
    } catch (error) {
      res.status(500).send({ message: "error while resending otp", success: false });
    }
  },
  postDoctorOtp: async (req, res,next) => {
    let { name,email,phone,password,cpassword,about,}=signupData
    const {otpis} = req.body.values
    try {
        if(otpis == otp){
            password = await bcrypt.hash(signupData.password,10)
            cpassword = await bcrypt.hash(signupData.cpassword,10)
            let newDoctor= new doctor({
                name:name,
                email:email,
                phone:phone,
                password:password,
                cpassword:cpassword,
                about:about,

            })
            await newDoctor.save()
            const doctorwaitingtoken = jwt.sign({doctorwaitingId:newDoctor._id},process.env.JWT_SECRET_KEY,{expiresIn:"10d"})
            res
        .status(200)
        .send({
          message: "Doctor created successfully",
          success: true,
          data: doctorwaitingtoken,
          newDoctor,
        });
        }
      
    } catch (error) {
      console.log(error);
      const errors = handleError(error);
      res.status(400).json({ errors, otpSend: false });
    }
  },
  doctorLogin: async (req, res) => {
    try {
      const doctorz = await doctor.findOne({ email: req.body.email });
      if (doctorz) {
        const isMatch = await bcrypt.compare(
          req.body.password,
          doctorz.password
        );

        if (isMatch) {
          const token = jwt.sign(
            { doctorId: doctorz._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res
            .status(200)
            .send({
              message: "Login successful",
              success: true,
              data: token,
              doctorz,
            });
        } else {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        }
      } else {
        return res
          .status(200)
          .send({ message: "Doctor does not exist", success: false });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong ", success: false, error });
    }
  },
  doctorStatus: async (req, res) => {
    try {
      const doctorStatus = await doctor.findById({ _id: req.doctorId });
      const IsActive = doctorStatus.isActive;
      doctorStatus.password = undefined;
      doctorStatus.cpassword = undefined;
      if (IsActive == "active") {
        res
          .status(200)
          .send({
            message: "doctor is acitve",
            success: true,
            data: IsActive,
            doctorStatus,
          });
      } else if (IsActive == "rejected") {
        res
          .status(200)
          .send({
            message: "doctor request is rejected",
            success: true,
            data: IsActive,
            doctorStatus,
          });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error getting doctor status" });
    }
  },
  doctorapply: async (req, res) => {
    try {
      const path = req.file.path.replace("public", "");
      const information = req.body;
      // console.log(information);
      const updateDoctor = await doctor.updateOne(
        { _id: req.doctorId },
        {
          $set: {
            name: information.name,
            email: information.email,
            phone: information.phone,
            about: information.about,
            specialization: information.specialization,
            experience: information.experience,
            feesPerCunsaltation: information.feesPerCunsaltation,
            qualification:information.qualification,
            language:information.language,
            file: path,
            isActive: "pending",
          },
        }
      );
      const docinfo = await doctor.findOne({ _id: req.doctorId });
      const adminz = await admin.findOne({});
      const notification = adminz.notification;
      notification.push({
        type: "apply-doctor-request",
        message: `${docinfo.name} has Applied for a Doctor Account`,
        data: {
          doctorId: updateDoctor._id,
          name: updateDoctor.name,
          onClickPath: "admin/admin_newDoctors",
        },
      });
      await admin.findByIdAndUpdate(adminz._id, { notification });
      res
        .status(200)
        .send({
          success: true,
          message: "Doctor Account Applied Succefully",
          data: docinfo,
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "something went wrong ", success: false, error });
    }
  },
  doctorInfo: async (req, res) => {
    try {
      const doctorz = await doctor.findById({ _id: req.doctorId });
      doctorz.password = undefined;
      if (!doctorz) {
        return res
          .status(200)
          .send({ message: "Doctor does not exist", success: false });
      } else {
        res.status(200).send({ success: true, data: doctorz });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  doctorProfileEdit: async (req, res) => {
    const information = req.body;
    try {
     await doctor.updateOne(
        { _id: req.doctorId },
        {
          $set: {
            name: information.name,
            email: information.email,
            phone: information.phone,
            about: information.about,
            specialization: information.specialization,
            experience: information.experience,
            feesPerCunsaltation: information.feesPerCunsaltation,
            qualification:information.qualificaiton,
          },
        }
      );
      const doctorz = await doctor.findById({_id: req.doctorId})
      res
        .status(200)
        .send({
          success: true,
          message: "Doctor Profile is edited",
          data: doctorz,
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  doctorProfilePicUpload: async (req, res) => {
    const path = req.file.path.replace("public", "");
    try {
     await doctor.updateOne(
        { _id: req.doctorId },
        {
          $set: {
            profile:path,
          },
        }
      );
      const doctorz = await doctor.findById({_id: req.doctorId})
      res
        .status(200)
        .send({
          success: true,
          message: "Doctor Profile is edited",
          data: doctorz,
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong", success: false, error });
    }
  },
  updateSlotTime:async (req,res)=>{
    try {
      const startTime = req.body.startTime;
      const endTime = req.body.endTime;
      const slots = req.body.slot;
       await doctor.findByIdAndUpdate({_id:req.doctorId},
        {
          $set:{
            time:{start:req.body.startTime,end:req.body.endTime,slot:req.body.slot}
          }
        })
        const updateData = await doctor.findById({_id:req.doctorId})
        console.log(updateData); 
        res
        .status(200)
        .send({
          success: true,
          message: "Doctor Profile is edited",
          data: updateData,
        });
    } catch (error) {
      console.log(error);
    }
  },
updateDotorAvailability:async (req, res) => {
    try {
      const { selectedDay, timings } = req.body;
      const doctorData = await doctor.findOne({ _id: req.doctorId });
      console.log(doctorData);
      const existingDay = doctorData.availability.find(
        (day) => day.day === selectedDay
      )
      if (existingDay) {
        existingDay.time.push(
          ...timings.map((timing) => ({
            start: new Date(`2023-03-01T${timing.startTime}:00Z`),
            end: new Date(`2023-03-01T${timing.endTime}:00Z`),
            slots: timing.slots,
          }))
        );
      } else {
        doctorData.availability.push({
          day: selectedDay,
          time: timings.map((timing) => ({
            start: new Date(`2023-03-01T${timing.startTime}:00Z`),
            end: new Date(`2023-03-01T${timing.endTime}:00Z`),
            slots: timing.slots,
          })),
        });
      }
  
      const doctorz = new doctor(doctorData);
      await doctorz.save();
      console.log(doctorz);
      if (doctorz) {
        res
          .status(201)
          .send({ message: "Your Time schedule added ", success: true });
      } else {
        return res
          .status(200)
          .send({ message: "No doctor Exist  ", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `postDoctorAvailability controller ${error.message}`,
      });
    }
  },
   getScheduleDetails:async (req, res) => {
    try {
      const doctorr = await doctor.findOne({ _id: req.doctorId });
  
      const schedule = doctorr.availability;
      if (schedule) {
        res.status(201).send({ schedule, success: true });
      } else {
        return res
          .status(200)
          .send({ message: "No doctor Exist  ", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `postDoctorAvailability controller ${error.message}`,
      });
    }
  },
  deleteScheduleTime:async (req, res) => {
    try {
      const doctorId = req.doctorId;
      const timingId = req.query.timingId;
      const doctorr = await doctor.findOne({ _id: req.doctorId });
  
      if (!doctorr) {
        return res
          .status(200)
          .send({ message: " doctor not Exist  ", success: false });
      } else {
        doctorr.availability.forEach((day) => {
          day.time.pull({ _id: timingId });
        });
        doctorr.availability.forEach((day, index) => {
          if (day.time.length === 0) {
            doctorr?.availability?.splice(index, 1);
          }
        });
  
        doctorr.save().then(() => {
          res
            .status(201)
            .send({ message: "Your Timing is removed", success: true });
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: `deleteScheduleTime controller ${error.message}`,
      });
    }
  }
};
