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
    updateSlotTime,
    updateDotorAvailability,
    getScheduleDetails,
    deleteScheduleTime,
    getAppointments,
    approveAppointment,
    cancelAppointment,
    completedAppointment,
    getAppointmentHistory,
    getAllNotification,
    markAllNotification,
    deleteNotification,
    getChatContacts,
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
router.post('/updateDotorAvailability',auth.doctorjwt,updateDotorAvailability)
router.get('/getScheduleDetails',auth.doctorjwt,getScheduleDetails)
router.post('/deleteScheduleTime',auth.doctorjwt,deleteScheduleTime)
router.get('/getAppointments',auth.doctorjwt,getAppointments)
router.post('/approveAppointment',auth.doctorjwt,approveAppointment)
router.post ('/cancelAppointment',auth.doctorjwt,cancelAppointment)
router.post ('/completedAppointment',auth.doctorjwt,completedAppointment)
router.get('/getAppointmentHistory',auth.doctorjwt,getAppointmentHistory)
router.get('/getAllNotification',auth.doctorjwt,getAllNotification)
router.post('/markAllNotification',auth.doctorjwt,markAllNotification)
router.post('/deleteNotification',auth.doctorjwt,deleteNotification)
router.get('/getChatContacts',auth.doctorjwt,getChatContacts)
module.exports = router