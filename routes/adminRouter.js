const express = require('express')
const router = express.Router()
const {
    adminLogin
}= require('../controller/admin-controller')

router.post('/admin_login',adminLogin)
module.exports= router