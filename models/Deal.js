const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const dealSchema = mongoose.model(
    "Deal",
new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    buildingclass:{
        type:String,
    },
    numOfUnit:{
        type:Number,
        required:true
    },
    dimension:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    photo:{
        type:String    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    dealsBy:{
        type: ObjectId,
          ref: "User"
    }
    
    
})
)
module.exports = dealSchema;