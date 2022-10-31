const siteModel = require('../models/Site')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/authMiddleware')
const Cryptr = require('cryptr')
const cryptr  = new Cryptr(process.env.CRYPT_KEY);    
require("dotenv").config()


var SiteController = class SiteController{

    // To add new site
    static addSite = async(req, res) =>{
        
        const {url, sitename, sector, username, sitepassword, notes} = req.body
        const encryptedString =  cryptr.encrypt(sitepassword); //encrypts data using cryptr with a secret key
        const newSite = new siteModel({
            url : url,
            sitename : sitename,
            sector : sector,
            username : username,
            sitepassword : encryptedString,
            notes : notes,
            mobNumber:req.user.mobNumber
        })
        try{
            const result = await newSite.save()
            console.log(result)
            res.status(200).send({"status": "success", "message":"Site saved successfully"})
        }catch (error) {
            console.log(error)
            res.send({"status":"failed", "message": " Something went wrong"})
        }
    }

    // To view  all the sites of a authenticated user
    static getAllSite = async (req, res) =>{
        try {
            const response = await siteModel.find({mobNumber:req.user.mobNumber})
            res.send(response)
        }catch(error){
            console.log({"status":"failed", "message": " Something went wrong"})
        }
    }

    // To view single site
    static getSingleSite = async (req, res) =>{
        try {
            const response = await siteModel.find({$and :[ {_id:req.params.id},{mobNumber:req.user.mobNumber}]} )
            res.send(response)
        }catch(error){
            res.send({"status":"failed", "message": " Something went wrong"})
        } 
    }

    // To edit the site details
    static updateSiteById = async (req, res) =>{
        try{
            const response = await siteModel.findOneAndUpdate({$and :[ {_id:req.params.id},{mobNumber:req.user.mobNumber}]}, req.body)
           if( response == null ) return res.send("Unauthorised access")
            res.send({"status": "success", "message":"Updated successfully" })
        }catch(error){
            res.send({"status":"failed", "message": " Something went wrong"})
        }
    }

    // To delete the site
    static deleteSite = async(req,res)=>{   
        await siteModel.findOneAndDelete({$and:[{_id:req.body._id},{mobNumber:req.user.mobNumber}]},function (err,docs)/*callback*/ {
            if (err) return res.status(401).send(err)
        if(docs==null) return res.status(401).send({"status" : "failed","message" : "Unauthorized access to the site"}) // if Id of other site is given
        return res.send({"status" : "success","message" : "Site deleted"})}).clone()
    }
    

    
    // To search the sites

    static searchSite = async (req, res) => {
        try {
            let search =  req.body.text;
            var regex = new RegExp(search, "i"); //case insensitive
            await siteModel.find(
                { mobNumber: req.user.mobNumber, $text: { $search: regex } },
                (err, result) => {
                    if (result) {
                        res.status(200).send({ result });
                    } else res.send(err);
                }
            ).clone();
        } catch (err) {
            return res.status(400).send({ "status": "failed" , "message": "Failed to search"})
        }
    };
    

    

  
    }

module.exports = SiteController
