const doctor = require('../models/doctorModel')
const bcrypt = require('bcryptjs')
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
    }
}