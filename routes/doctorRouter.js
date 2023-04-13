const express = require('express');
const router = express.Router()
const {handleUpload} = require ('../middlewares/multer')
const auth = require('../middlewares/auth')
const {
    doctorSignup,
    postDoctorOtp,
    doctorLogin,
    doctorInfo,
    doctorapply,
    doctorStatus,
    doctorProfileEdit,
    resendDoctorOtp,
    doctorProfilePicUpload,
    updateSlotTime
}= require('../controller/doctor-controller')

router.post('/doctor_signup',doctorSignup)
router.post('/postDoctorOtp',postDoctorOtp)
router.post('/doctor_signin',doctorLogin)
router.post('/resendDoctorOtp',resendDoctorOtp)
router.post ('/doctorInfo',auth.doctorwaitingjwt, doctorInfo)
router.post ('/doctor_apply', auth.doctorwaitingjwt,handleUpload('file'), doctorapply)
router.get('/doctorStatus',auth.doctorwaitingjwt,doctorStatus)
router.post('/doctorProfileEdit',auth.doctorjwt,doctorProfileEdit)
router.post('/doctorProfilePicUpload',auth.doctorjwt,handleUpload('profile'),doctorProfilePicUpload)
router.post('/updateSlotTime',auth.doctorjwt,updateSlotTime)
module.exports = router