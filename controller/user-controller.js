
const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {sendOtp,verifyOtp}=require('../middlewares/otp')
const jwt = require('jsonwebtoken')
let signupData
module.exports ={
    userSignup:async(req, res) => {
        try {
            const {fName,lName,email,phone,password,cpassword} =req.body.values
            const mobilenum = req.body.values.phone
            const userExist = await user.findOne({email:req.body.values.email})
            if(userExist){
                return res.status(200).send({message:"user already exists",success:false});
            }else{
                 signupData={
                fName,
                lName,
                email,
                phone,
                password,
                cpassword
                } 
                sendOtp(mobilenum)
                res.status(200).send({message:"otp is resend to your mobile number",success:true});
            }
        }catch(err) {
            console.log(err)
            res.status(500).send({message:"error while creating user",success:false,err})
        }
    },
    resendUserOtp:async(req,res,next)=>{
        try {
            const {userNum}=req.body
            console.log(userNum);
            sendOtp(userNum)
        } catch (error) {
            console.log(error)
            res.status(500).send({message:"error while resending otp",success:false,err})
        }
    },
    postOtp: async (req, res,next) => {
        let {fName,lName,email,phone,cpassword} =signupData
        let{password}= signupData
        const otp = req.body.values.otpis
        try {
            await verifyOtp(phone, otp).then(async (verification_check) => {
                if (verification_check.status == "approved") {
                    password = await bcrypt.hash(signupData.password, 10)
                    cpassword = await bcrypt.hash(signupData.cpassword, 10)
                    let members = new user({
                        fName:fName,
                        lName:lName,
                        email:email,
                        phone:phone,
                        password:password,
                        cpassword:cpassword,    
                    })
                   await members.save()
                   res.status(200).send({message:"user created successfully",success:true})
                }
            })
      
      
        } catch(error){
            console.log(error)
            res.status(500).send({message:"error creating user",success:false})
        }
          },
    userLogin:async(req,res)=>{
        try {
            const userz = await user.findOne({email:req.body.values.email});
            if(userz){ 
                const isMatch = await bcrypt.compare(req.body.values.password,userz.password)
                if(isMatch){
                    const usertoken = jwt.sign({userId:userz._id},process.env.JWT_SECRET_KEY,{expiresIn:"2d"})
                    res.status(200).send({message:"Login successful",success:true,data:usertoken,userz})
                }else{
                    return res.status(200).send({ message:"Password is incorrect",success:false})
                }
            }else{
                return res
                .status(200)
                .send({ message: "user does not exist", success: false });
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({ message: "something went wrong ",success:false,error})
        }
    }
}