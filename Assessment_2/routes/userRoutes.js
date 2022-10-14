const express = require ('express')
const { default: mongoose } = require('mongoose')
const { userSignUp, userSignIn, loggedUser, changeUserPassword } = require('../controllers/userController')
const userController = require('../controllers/userController')
const router = express.Router()
const route = require('../controllers/userController')
const checkUserAuth = require('../middlewares/authMiddleware')


// Public routes
router.post('/signup', userSignUp)
router.post('/signin', userSignIn)
// router.post('/sendOtp', userController.sendOtp)

// Protected routes using middleware
router.get('/signedInUser',checkUserAuth, loggedUser)
// router.use('/changepassword', checkUserAuth, changeUserPassword)





module.exports = router