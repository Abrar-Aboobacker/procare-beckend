const express = require('express');
const router = express.Router()
const store = require ('../middlewares/multer')
const {
    doctorSignup,
    doctorLogin,
}= require('../controller/doctor-controller')

router.post('/doctor_signup',doctorSignup,store.uploadImages)
router.post('/doctor_signin',doctorLogin)

module.exports = router