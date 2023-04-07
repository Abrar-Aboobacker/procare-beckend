const express = require('express');
const router = express.Router()
const {handleUpload} = require ('../middlewares/multer')
const auth = require('../middlewares/auth')
const {
    doctorSignup,
    doctorLogin,
    doctorInfo,
    doctorapply,
    doctorStatus,
    doctorProfileEdit
}= require('../controller/doctor-controller')

router.post('/doctor_signup',doctorSignup)
router.post('/doctor_signin',doctorLogin)
router.post ('/doctorInfo',auth.doctorwaitingjwt, doctorInfo)
router.post ('/doctor_apply', auth.doctorwaitingjwt,handleUpload('file'), doctorapply)
router.get('/doctorStatus',auth.doctorwaitingjwt,doctorStatus)
router.post('/doctorProfileEdit',auth.doctorjwt,doctorProfileEdit)
module.exports = router