const express = require('express')
const router = express.Router()
const {
    userSignup,
    postOtp,
    resendUserOtp,
    userLogin,
}=require('../controller/user-controller')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)
router.post('/user_resend_otp',resendUserOtp)
router.post('/userLogin',userLogin)
module.exports = router