const express = require ('express')
const { default: mongoose } = require('mongoose')
const { addSite, getAllSite, getSingleSite, updateSiteById, deleteSiteById, searchSite, decryptPassword, resetPassword, deleteSite } = require('../controllers/siteController')
const siteController = require('../controllers/siteController')
const router = express.Router()
const route = require('../controllers/siteController')
const checkUserAuth = require('../middlewares/authMiddleware')

router.post('/addsite',checkUserAuth, addSite)
router.get('/getallsites',checkUserAuth, getAllSite)
router.get('/:id',checkUserAuth, getSingleSite)
router.put('/:id',checkUserAuth, updateSiteById)
router.delete('/delete',checkUserAuth, deleteSite)
router.get('/',checkUserAuth, searchSite)

// router.get('/decryptpassword',checkUserAuth, decryptPassword)

module.exports = router
