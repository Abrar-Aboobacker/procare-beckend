const express = require('express')
const router = express.Router()
const {
    userSignup,
    postOtp,
    userLogin,
}=require('../controller/user-controller')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)
router.post('/userLogin',userLogin)
module.exports = router