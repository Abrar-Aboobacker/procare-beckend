const jwt = require("jsonwebtoken");
const admin = require("../models/adminModel");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      const adminz = await admin.findOne({ email: req.body.email });
      console.log(req.body.password+"eeeeee");
      if (adminz) {
        if(req.body.password == adminz.password) {
            console.log(req.body.password);
            const token = jwt.sign({id:admin._id},process.env.JWT_SECRET_KEY,{expiresIn: "5d"})
            res.status(200).send({message:"Login successful",success:true,data:token})
        }else{
            return res.status(200).send({ message:"Password is incorrect",success:false})
        }
        
      }else{
        return res
          .status(200)
          .send({ message: "Admin does not exist", success: false });
      }
    //   const isMatch = await 
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error logginf in ",success:false,error})
    }
  },
};
