const express = require('express');
const router = express.Router()
const store = require ('../middlewares/multer')
const auth = require('../middlewares/auth')
const {
    doctorSignup,
    doctorLogin,
    doctorInfo,
    doctorapply,
}= require('../controller/doctor-controller')

router.post('/doctor_signup',doctorSignup)
router.post('/doctor_signin',doctorLogin)
router.post ('/doctorInfo',auth.doctorjwt, doctorInfo)
router.post ('/doctor_apply', auth.doctorjwt, doctorapply)
module.exports = router