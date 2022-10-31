const express = require ('express')
const { default: mongoose } = require('mongoose')
const { GetNewAccessToken } = require('../controllers/refreshToken')
const { userSignUp, userSignIn, resetMPin, addNewMPin, generateOtp } = require('../controllers/userController')
const userController = require('../controllers/userController')
const router = express.Router()
const route = require('../controllers/userController')
const checkUserAuth = require('../middlewares/authMiddleware')
const {logout}=require('../controllers/refreshToken')
const verifyOtp=require('../middlewares/verifyOtp')



// Public routes
router.post('/signup', userSignUp)
router.post('/signin', userSignIn)

// router.delete('/logout',checkUserAuth, logOut)

// router.use('/changepassword', checkUserAuth, changeUserPassword)
router.post('/refreshToken',GetNewAccessToken)
router.delete('/logout',checkUserAuth,logout)

router.post('/reset',checkUserAuth,resetMPin)
router.get('/otpGen',generateOtp)
router.post('/verifyOtp', verifyOtp, addNewMPin)



module.exports = router