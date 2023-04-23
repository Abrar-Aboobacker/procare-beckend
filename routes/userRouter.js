const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    userSignup,
    postOtp,
    resendUserOtp,
    userLogin,
    getAllDoctors,
    getAllPlans,
    planOrder,
    paymentVerify,
    singleDoctorDetails,
    bookAppointment,
    bookingAvailability,
    isPlanPresent
}=require('../controller/user-controller')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)
router.post('/user_resend_otp',resendUserOtp)
router.post('/userLogin',userLogin)
router.get('/allDoctors',getAllDoctors)
router.get('/getAllPlans',getAllPlans)
router.post('/planOrder',auth.userjwt,planOrder)
router.post('/paymentVerify',auth.userjwt,paymentVerify)
router.get('/singleDoctorDetails/:id',singleDoctorDetails)
router.post('/book_appointment',auth.userjwt,bookAppointment)
router.post('/booking_availabilily',auth.userjwt,bookingAvailability)
router.get('/isPlanPresent',auth.userjwt,isPlanPresent)
module.exports = router