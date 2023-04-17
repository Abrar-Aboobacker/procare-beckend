const mongoose = require('mongoose');
const plan = require('./planModel');
const userSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true
    },
    lName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    plan:{

       curentPlan: {
            type:mongoose.Types.ObjectId,
            ref:plan
        },
        isActive:{
            type: Boolean,
            default: false
        },
        session:{
            type:Number,
            
        }
    }
},{
        timestamps:true   
     }
)
module.exports = mongoose.model('users',userSchema)