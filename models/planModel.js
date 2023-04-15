const mongoose= require("mongoose");

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    sessions:{
        type:Number,
        required:true,
    },
    benefits:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    price:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model('plan',planSchema)