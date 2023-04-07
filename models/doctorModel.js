const mongoose = require('mongoose')

const doctorSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
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
    specialization:{
        type:String,
        default:''
        // required:true
    },experience:{
        type:String,
        default:''
        // required:true
    },
    feesPerCunsaltation:{
        type:Number,
        // required:true
    },
    timings:{
        type:Object,
        default:{}
        // required:true
    },
    status:{
        type:String,
        defualt:"pending"
    },
    isActive:{
        type:String,
        required:true,
        default:"pending"
    },
    about:{
        type:String
    },notification:{
        type:Array,
        default:[]
    },seennotification:{
        type:Array,
        default:[]
    },rejectReason:{
        type:String,
        default:''
    }
},{
    timestamps:true
})

module.exports = mongoose.model('doctor',doctorSchema)