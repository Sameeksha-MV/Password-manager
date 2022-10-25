const express = require ('express')
const { default: mongoose } = require('mongoose')
const { GetNewAccessToken } = require('../controllers/refreshToken')
const { userSignUp, userSignIn, loggedUser, changeUserPassword } = require('../controllers/userController')
const userController = require('../controllers/userController')
const router = express.Router()
const route = require('../controllers/userController')
const checkUserAuth = require('../middlewares/authMiddleware')
const {logout}=require('../controllers/refreshToken')


// Public routes
router.post('/signup', userSignUp)
router.post('/signin', userSignIn)

// router.delete('/logout',checkUserAuth, logOut)

// router.use('/changepassword', checkUserAuth, changeUserPassword)
router.post('/refreshToken',GetNewAccessToken)
router.delete('/logout',checkUserAuth,logout)




module.exports = router