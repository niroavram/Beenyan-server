const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = mongoose.model(
    "User",
new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    tel:{
        type:Number,
        min:8,  
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    expireToken: Date,
    mylike:[{type:ObjectId,ref:"Deal"}],
    role: {
            type: String,
            default: 'basic',
            enum: ["basic", "seller", "admin"]
        }
    ,
    // appointmentBoard:{
    //     type: mongoose.Schema.Types.ObjectId[],
    //     ref: "Appointment"
    // },
    // myAppointments:{
    //     type: mongoose.Schema.Types.ObjectId[],
    //     ref: "Appointment"
    // }
 /*   confirmPass:{
        type:String,
        required:true
    } */
})
)
module.exports = userSchema;
