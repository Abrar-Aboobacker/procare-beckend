const express = require('express')
const router = express.Router()
const {
    userSignup,
    postOtp,
}=require('../controller/user-controller')

router.post('/signup', userSignup)
router.post('/postOtp',postOtp)

module.exports = router