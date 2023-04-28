const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    userSignup,
    postOtp,
    resendUserOtp,
    userLogin,
    userInfo,
    userProfileEdit,
    getAllDoctors,
    getAllPlans,
    planOrder,
    paymentVerify,
    singleDoctorDetails,
    // bookAppointment,
    // bookingAvailability,
    isPlanPresent,
    verifyAppointment,
    availableSlot,
    changePassword,
    getPendingAppointments,
    cancelAppointment,
    getAppointmentHistory,
    userProfilePicUpload,
    getAllNotification,
    markAllNotification,
    deleteNotification
}=require('../controller/user-controller')
const { handleUpload } = require('../middlewares/multer')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)
router.post('/user_resend_otp',resendUserOtp)
router.post('/userLogin',userLogin)
router.get('/userInfo',auth.userjwt,userInfo)
router.post('/userProfileEdit',auth.userjwt,userProfileEdit)
router.get('/allDoctors',getAllDoctors)
router.get('/getAllPlans',getAllPlans)
router.post('/planOrder',auth.userjwt,planOrder)
router.post('/paymentVerify',auth.userjwt,paymentVerify)
router.get('/singleDoctorDetails/:id',singleDoctorDetails)
// router.post('/book_appointment',auth.userjwt,bookAppointment)
// router.post('/booking_availabilily',auth.userjwt,bookingAvailability)
router.get('/isPlanPresent',auth.userjwt,isPlanPresent)
router.post('/verifyAppointment',auth.userjwt,verifyAppointment)
router.get('/availableSlot/:id/:selectedDay',auth.userjwt,availableSlot)
router.post("/changePassword",auth.userjwt,changePassword)
router.get("/getPendingAppointments",auth.userjwt,getPendingAppointments)
router.post("/cancelAppointment",auth.userjwt,cancelAppointment)
router.get("/getAppointmentHistory",auth.userjwt,getAppointmentHistory)
router.post("/userProfilePicUpload",auth.userjwt,handleUpload('profile'),userProfilePicUpload)
router.get("/getAllnotification",auth.userjwt,getAllNotification)
router.post("/markAllNotification",auth.userjwt,markAllNotification)
router.post("/deleteNotification",auth.userjwt,deleteNotification)
module.exports = router