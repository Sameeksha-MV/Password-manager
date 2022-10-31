const userModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const generateTokens = require("../utils/generateTokens");
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
                    const salt = await bcrypt.genSalt(Number(process.env.SALT))
                    const hashMpin = await bcrypt.hash(mPin, salt)
                    const newUser = new userModel({
                        mobNumber : mobNumber,
                        mPin : hashMpin
                    })
                    await newUser.save()
                    const saved_user = await userModel.findOne({mobNumber : mobNumber})

                    // // Generate JWT Token

                    // const token = jwt.sign({userID:saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
                    res.status(200).send({"status": "success", "message":"You are done!!! You can Sign In to access the vault"})

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

                        // const token = jwt.sign({userID:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
                        const token =await generateTokens(user)
                        

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
  
    static generateOtp = async (req, res) =>{
        try {
         const secret = speakeasy.generateSecret({length: 10})
       res.send({
         "token": speakeasy.totp({ //Time-based one-time password
             secret: secret.base32,
             encoding: "base32",
             step: 60
         }),
         "secret":secret.base32,
         // "secretData":secret
       })
        } catch (error) {
         res.send(error)
       
        } 
    }

    // Change mpin after signin

    static resetMPin = async (req, res) => {
        try {
            const user = await userModel.findOne({ mobNumber: req.user.mobNumber });
            const result = await bcrypt.compare(
                req.body.mPin.toString(),
                user.mPin
            );
    
            if (result) {
                res.send({ message: "Your new mPin cannot be same as old!" });
            } else {
                const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
                const newmPin = await bcrypt.hash(req.body.mPin.toString(), salt);
                await userModel.findOneAndUpdate(
                    { mobNumber: req.user.mobNumber },
                    { mPin: newmPin } 
                );
                res.send({"status" : "success", "message": "MPin changed successfully" });
            }
        } catch (error) {
            res.json({ message: error });
        }
    };


    static addNewMPin = async (req,res)=>{
        const newMPin = req.body.newMPin.toString()
        if(newMPin.length!=4) return res.send("Enter a valid 4-digit new MPin")
        try {
            const salt = await bcrypt.genSalt(Number(process.env.SALT)); // salt generation
            const hashedPassword = await bcrypt.hash(req.body.newMPin.toString(), salt) // bcrypting MPin
            const docs = await userModel.findOneAndUpdate({ mobNumber: req.body.mobNumber},{ mPin: hashedPassword },(err)=>{ //Update in database
                if(err) return res.send(err)
            }).clone();
            if(docs==null) return res.send("User is not registered")
            return res.status(200).send("MPin successfully Updated")
        } 
        catch(err) {
            return res.status(500).send(err)
        }
}


 


}

module.exports = UserController