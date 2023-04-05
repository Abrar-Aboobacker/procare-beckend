
const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
module.exports ={
    userSignup:async(req, res) => {
        try {
            const userExist = await user.findOne({email:req.body.email})
            if(userExist){
                return res.status(200).send({message:"user already exists",success:false});
            }
            
            const password = req.body.values.password
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password,salt);
            req.body.values.password = hashedPassword
            req.body.values.cpassword = hashedPassword
            const newUser = new user(req.body.values)
            
            await newUser.save()
            res.status(200).send({message:"User created successfully",success:true})
        }catch(err) {
            console.log(err)
            res.status(500).send({message:"error while creating user",success:false,err})
        }
    }
}