const mongoose = require('mongoose');

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
    }
    
},{
        timestamps:true   
     }
)
module.exports = mongoose.model('users',userSchema)