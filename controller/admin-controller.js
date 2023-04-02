const jwt = require("jsonwebtoken");
const admin = require("../models/adminModel");
const bcrypt  = require ('bcryptjs')
module.exports = {
  adminLogin: async (req, res) => {
    try {
      const adminz = await admin.findOne({ email: req.body.email });
      console.log(adminz);
      if (adminz) {
        const isMatch = await bcrypt.compare(req.body.password,adminz.password)
        if (isMatch) {
          const admintoken = jwt.sign({adminId:adminz._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
          res.status(200).send({message:"Login successful",success:true,data:admintoken,adminz})
          
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
  isAdminAuth: async (req, res) => {
    try {
      let admins = await admin.findById(req.id);
      const adminDetails = {
        email: admins.email,
      };
      res.json({
        success: true,
        result: adminDetails,
        status: "success",
        message: "signin success",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
