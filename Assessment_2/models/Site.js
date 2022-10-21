const mongoose = require ('mongoose')

// Defining schema

const siteSchema = new mongoose.Schema({
    mobNumber : {
        type : Number
    },
    url : {
        type : String,
        required : true
    },
    sitename:{
        type : String,
        required : true
    },
    sector:{
        type : String,
        enum:["Social Media", "Payment ", "Entertainment", ],
        required : true
    },
    username:{
        type : String,
        required : true
    },
    sitepassword:{
        type : String,
        required : true
    },
    notes : {
        type : String
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "user"

    }
})

module.exports = mongoose.model("sites",siteSchema)