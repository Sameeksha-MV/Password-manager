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
    }
})

module.exports = mongoose.model("sites",siteSchema)