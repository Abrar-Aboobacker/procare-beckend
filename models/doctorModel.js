const mongoose = require('mongoose')

const doctorSchema= new mongoose.Schema({
    name:{
        type: String,
        // required: true
    },
    email:{
        type: String,
        // required: true
    },
    phone:{
        type: String,
        // required: true
    },
    file:{
        type: String,
        // required: true
    },
    password:{
        type:String,
        // required:true
    },
    cpassword:{
        type:String,
        // required:true
    },
    isActive:{
        type:Boolean,
        // required:true,
        default:false
    },
    About:{
        type:String
    }
},{
    timestamps:true
})

module.exports = mongoose.model('doctor',doctorSchema)