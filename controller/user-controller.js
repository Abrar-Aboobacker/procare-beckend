const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
module.exports ={
    userSignup:async(req, res) => {
        try {
            const userExist = await user.findOne({email:req.body.email})
            if(userExist){
                return res.status(200).send({message:"user already exists",success:false});
            }
            const password = req.body.password
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password,salt);
            req.body.password = hashedPassword
            const newUser = new user(req.body)
            await newUser.save()
            res.status(200).send({mesage:"User created successfully",success:true})
        }catch(err) {
            res.status(500).send({mesage:"error creating user",success:false,err})
        }
    }
}