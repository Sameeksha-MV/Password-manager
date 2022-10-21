const mongoose = require("mongoose")

// Defining Schema
const userSchema = new mongoose.Schema({
    mobNumber: {
        type : String,
        unique:true,
        validate: {
            validator: function(v){

                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v)
              },
            message: '{VALUE} is not a valid 10 digit number!'
        },
        required : true
    },
    mPin:{
        type : String,
        required : true
    },
    RefreshToken:{
        type:String
    }
})

module.exports = mongoose.model("user",userSchema)