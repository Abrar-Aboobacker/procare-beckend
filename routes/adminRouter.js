const express = require('express')
const router = express.Router()
const auth =require ('../middlewares/auth')
const {
    adminLogin,
    isAdminAuth,
}= require('../controller/admin-controller')

router.post('/admin_login',adminLogin)
router.get('/isAdminAuth',isAdminAuth)
module.exports= router