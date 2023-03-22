const doctor = require('../models/doctorModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
module.exports = {
    doctorSignup: async (req, res) => {
        try {
            const doctorExist = await doctor.findOne({email:req.body.email})
            if(doctorExist){
                return res.status(200).send({message:"user already exists",success:false});
            }
            const password = req.body.password
            const salt = await bcrypt.genSalt()
            const hashedPassword= await bcrypt.hash(password,salt)
            req.body.password = hashedPassword
            console.log(req.body + "body");
            for (const key in req.body) {
                console.log(key);
            }
            const newDoctor = new doctor(req.body)
            await newDoctor.save()
            res.status(200).send({message:"Doctor created successfully",success:true})
        } catch (error) {
            res.status(500).send({message:"error creating user",success:false})
        }
    },
    doctorLogin:async (req,res)=>{
        try {
            const doctorz = await doctor.findOne({email:req.body.email})
            if(doctorz){
                const isMatch = await bcrypt.compare(req.body.password,doctorz.password)
                console.log(req.body);
                if(isMatch){
                    const token = jwt.sign({doctor_id:doctor._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
                    res.status(200).send({message:"Login successful",success:true,data:token})
                }else{
                    return res.status(200).send({ message:"Password is incorrect",success:false})
                }
            }else{
                return res
                .status(200)
                .send({ message: "Admin does not exist", success: false });
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({ message: "error logginf in ",success:false,error})
        }
    }
}