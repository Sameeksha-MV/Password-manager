const userModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const messagebird = require('messagebird')('process.env.MESSAGEBIRD_API_KEY');

var UserController = class UserController{
    
    // SignUp
    static userSignUp = async (req, res)=>{
        const {mobNumber, mPin, mPinConfirmation} = req.body
        const user = await userModel.findOne({mobNumber : mobNumber})
        if(user){
            res.send({"status" : "Failed", "message" : "Mobile number alredy exists"})
        }else{
            if(mobNumber && mPin && mPinConfirmation){
                if(mPin === mPinConfirmation){
                   try{
                    const salt = await bcrypt.genSalt(10)
                    const hashMpin = await bcrypt.hash(mPin, salt)
                    const newUser = new userModel({
                        mobNumber : mobNumber,
                        mPin : hashMpin
                    })
                    await newUser.save()
                    const saved_user = await userModel.findOne({mobNumber : mobNumber})

                    // // Generate JWT Token

                    // const token = jwt.sign({userID:saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
                    // res.status(200).send({"status": "success", "message":"You are done!!! You can Sign In to access the vault"})

                   }catch (error) {
                        console.log(error)
                        res.send({"status":"failed", "message": "Unable to SignUp, Please enter 10 digit mobile number"})
                   }

                }else{
                    res.send({"status":"failed", "message": "MPin and confirm Mpin doesn't match"})
                }
            }else{
                res.send({"status" : "Failed", "message" : "All fields are required"})
            }
        }
    }

    // SignIn
    static userSignIn = async (req, res)=> {
        try{
            const {mobNumber, mPin} = req.body
            if(mobNumber && mPin){
                const user = await userModel.findOne({mobNumber : mobNumber})
                if(user != null){
                    const isMatch = await bcrypt.compare(mPin, user.mPin)  // user.mPin is used to fetch the mpin which is present in the DB
                    if((user.mobNumber === mobNumber) && isMatch){

                        // Generate JWT token

                        const token = jwt.sign({userID:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})

                        res.status(200).send({"status": "success", "message":"Sign In successful!!!", "token" : token})
                    }else{
                        res.send({"status" : "Failed", "message" : "Invalid Mobile number or MPin"})
                    }
                }else{
                    res.send({"status" : "Failed", "message" : "You are not a registered user"})
                }
            }else{
                res.send({"status" : "Failed", "message" : "All fields are required"})
            }
        }catch(error){
            console.log(error)

        }
    }

    static loggedUser = async(req, res)=>{
        res.send({"user":req.user })
    }

    // static changeUserPassword = async (req, res) => {
    //     const { mPin, mPinConfirmation } = req.body
    //     if (mPin && mPinConfirmation) {
    //       if (mPin !== mPinConfirmation) {
    //         res.send({ "status": "failed", "message": "New Mpin and Confirm MPin doesn't match" })
    //       } else {
    //         const salt = await bcrypt.genSalt(10)
    //         const newHashPassword = await bcrypt.hash(mPin, salt)
    //         const result = await userModel.findByIdAndUpdate(req.user._id, { $set: { mPin: newHashPassword } })
    //         res.send(result)
    //         res.send({ "status": "success", "message": "Password changed succesfully" })
    //       }
    //     } else {
    //       res.send({ "status": "failed", "message": "All Fields are Required" })
    //     }
    //   }
    

    // forgot password

    // static sendOtp =  async(req, res)=>{
    //     const { mobNumber } = req.body
    //     const newMobNumber = "+91" + mobNumber
    //     var params = {
    //       template: 'Your Login OTP is %token',
    //       timeout: 300
    //     };
    
    //     messagebird.verify.create(newMobNumber, params,
    //       (err, response) => {
    //         if (err) {
    //           // Could not send OTP e.g. Phone number Invalid
    //           console.log("OTP Send Error:", err);
    //           res.status(200).send({ "status": "failed", "message": "Unable to Send OTP" })
    //         } else {
    //           // OTP Send Success
    //           console.log("OTP Send Response:", response);
    //           res.status(200).send({ "status": "success", "message": "OTP Send Successfully", "id": response.id })
    //         }
    //       });
    //   }

    
 


}

module.exports = UserController