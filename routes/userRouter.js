const express = require('express')
const router = express.Router()
const {
    userSignup,
    postOtp,
    resendUserOtp,
    userLogin,
    getAllDoctors,
    getAllPlans,
    planOrder,
    paymentVerify
}=require('../controller/user-controller')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)
router.post('/user_resend_otp',resendUserOtp)
router.post('/userLogin',userLogin)
router.get('/allDoctors',getAllDoctors)
router.get('/getAllPlans',getAllPlans)
router.post('/planOrder',planOrder)
router.post('/paymentVerify',paymentVerify)
module.exports = router