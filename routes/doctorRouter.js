const express = require('express');
const router = express.Router()
const store = require ('../middlewares/multer')
const {
    doctorSignup
}= require('../controller/doctor-controller')

router.post('/doctor_signup',doctorSignup,store.uploadImages)

module.exports = router