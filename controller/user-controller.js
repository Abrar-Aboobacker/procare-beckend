
const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {sendOtp,verifyOtp}=require('../middlewares/otp')
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
                res.status(200).send({message:"otp is send to your mobile number",success:true});
            }
            
            // const password = req.body.values.password
            // const salt = await bcrypt.genSalt()
            // const hashedPassword = await bcrypt.hash(password,salt);
            // req.body.values.password = hashedPassword
            // req.body.values.cpassword = hashedPassword
            // const newUser = new user(req.body.values)
            
            // await newUser.save()
            // res.status(200).send({message:"User created successfully",success:true})
        }catch(err) {
            console.log(err)
            res.status(500).send({message:"error while creating user",success:false,err})
        }
    },
    postOtp: async (req, res,next) => {
        let {fName,lName,email,phone,cpassword} =signupData
        let{password}= signupData
        const otp = req.body.values.otpis
        try {
          
            console.log(fName);
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
    userLogin:(req,res)=>{
        try {
            
        } catch (error) {
            
        }
    }
}