const doctor = require('../models/doctorModel')
const admin = require('../models/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { log } = require('sharp/lib/libvips')
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
                    const token = jwt.sign({doctorId:doctorz._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
                    res.status(200).send({message:"Login successful",success:true,data:token,doctorz})
                }else{
                    return res.status(200).send({ message:"Password is incorrect",success:false})
                }
            }else{
                return res
                .status(200)
                .send({ message: "Doctor does not exist", success: false });
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({ message: "something went wrong ",success:false,error})
        }
    },
    doctorapply:async(req,res)=>{
        try {
            
            const information = req.body
            // console.log(information);
            const updateDoctor = await doctor.updateOne({_id:req.doctorId},{
                $set:{
                    name:information.name,
                    email:information.email,
                    phone: information.phone,
                    about:information.about,
                    specialization:information.specialization,
                    experience:information.experience,
                    feesPerCunsaltation:information.feesPerCunsaltation,

                }
            })
            const docinfo = await doctor.findOne({_id:req.doctorId})
            const adminz = await admin.findOne({})
            const notification = adminz.notification
            notification.push({
                type:'apply-doctor-request',
                message:`${docinfo.name} has Applied for a Doctor Account`,
                data:{
                    doctorId:updateDoctor._id,
                    name:updateDoctor.name,
                    onclick:'admin/admin_newDoctors'
                }
            })
            await admin.findByIdAndUpdate(adminz._id,{notification})
            res.status(200).send({success:true, message:"Doctor Account Applied Successfully.Please wait for confirmation"})
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "something went wrong ",success:false,error})
        }
    },
    doctorInfo:async (req,res) => {
        try {
            
            const doctorz = await doctor.findById({_id:req.doctorId})
            doctorz.password= undefined
            if(!doctorz) {
                return res.status(200).send({message:"Doctor does not exist",success:false})
            }else{
                res.status(200).send({success:true,data:doctorz})
        }
        } catch (error) {
            res.status(500).send({message:"something went wrong",success:false,error})
        }
    }

}