const jwt = require('jsonwebtoken')
const userModel = require('../models/User')
const siteModel = require('../models/Site')

var checkUserAuth = async(req, res, next) =>{
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            //Get token from header
            token = authorization.split(' ')[1]
            // console.log('token', token)
            // console.log('authorization', authorization)

            // Verify Token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // Get user from token
            req.user = await userModel.findById(userID).select('-mPin')
            next()
        }catch{
            
            res.status(401).send({"status": "failed", "message" : "Unauthorized user"})

        }
    }
    if(!token){
        res.status(401).send({"status" : "failed", "message" : "Unauthorized User, No token"})
    }
}

module.exports = checkUserAuth