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
        const encryptedString = cryptr.encrypt(sitepassword); //encrypts data using cryptr with a secret key
        const newSite = new siteModel({
            url : url,
            sitename : sitename,
            sector : sector,
            username : username,
            sitepassword : encryptedString,
            notes : notes,
            userId:req.userId
        })
        try{
            await newSite.save()
            res.status(200).send({"status": "success", "message":"Site saved successfully"})
        }catch (error) {
            console.log(error)
            res.send({"status":"failed", "message": " Something went wrong"})
        }
    }

    // To view  all the sites 
    static getAllSite = async (req, res) =>{
        try {
            const response = await siteModel.find()
            res.send(response)
        }catch(error){
            console.log(error)
        }
    }

    // To view single site
    static getSingleSite = async (req, res) =>{
        try {
            const response = await siteModel.findById(req.params.id)
            res.send(response)
        }catch(error){
            console.log(error)
        }
    }

    // To edit the site details
    static updateSiteById = async (req, res) =>{
        try{
            const response = await siteModel.findByIdAndUpdate(req.params.id, req.body)
            res.send(response)
        }catch(error){
            console.log(error)
        }
    }

    // To delete the site
    // static deleteSiteById = async (req, res) =>{
    //     try{
    //         const response = await siteModel.findByIdAndDelete(req.params.id)
    //         res.send(response)
    //     }catch(error){
    //         console.log(error)
    //     }
    // }


    // To search the sites

    static searchSite = async (req, res)=>{
        try {
           const results = await siteModel.find({
                $or: [
                    {url:{$regex: req.body.text}},
                    {notes:{$regex: req.body.text}},
                    {sector:{$regex: req.body.text}},
                    {sitename:{$regex: req.body.text}},
                    {username:{$regex: req.body.text}}
                ]
            })
            res.send(results)
        }catch(error){
            console.log(error)
            res.status(400).send({ "status": "failed" , "message": "Failed to search"})
        }
    }

    // To copy the password 
    static decryptPassword = async (req, res)=>{

        const {url} = req.body
        try{
            const response = await siteModel.find({url})
            res.send(cryptr.decrypt(response[0].sitepassword))  // decrypts password
            
        }catch(error){
            console.log(error)
            res.send({ "status": "failed", "message": "Something went wrong" })
        }
    }
    }

module.exports = SiteController
