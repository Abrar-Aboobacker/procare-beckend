const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const adminInstance = new Admin();
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
      adminz.cpassword = undefined;
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
};
