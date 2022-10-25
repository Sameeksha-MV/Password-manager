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

            // Verify Token
            const user = jwt.verify(token.toString(), process.env.JWT_SECRET_KEY.toString())
            req.user=user
            // console.log(user)
           
        }catch{
            res.status(401).send({"status": "failed", "message" : "Unauthorized user"})
        }
    }
    if(!token){
        res.status(401).send({"status" : "failed", "message" : "Unauthorized User, No token"})
    }
    next()
}


module.exports = checkUserAuth