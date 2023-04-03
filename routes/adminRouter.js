const express = require('express')
const router = express.Router()
const auth =require ('../middlewares/auth')
const {
    adminLogin,
    adminInfo,
    getAllNotification,
    deleteNotification
}= require('../controller/admin-controller')

router.post('/admin_login',adminLogin)
router.post('/adminInfo',auth.adminjwt,adminInfo)
router.post('/getAllNotification',auth.adminjwt,getAllNotification)
router.post('/deleteNotification',auth.adminjwt,deleteNotification)
module.exports= router