const express = require('express')
const router = express.Router()
const auth =require ('../middlewares/auth')
const {
    adminLogin,
    adminInfo,
    getAllNotification,
    deleteNotification,
    getNewDoctors,
    getAllDoctors,
    approvingDoctor,
    rejectDoctor
}= require('../controller/admin-controller')

router.post('/admin_login',adminLogin)
router.post('/adminInfo',auth.adminjwt,adminInfo)
router.post('/getAllNotification',auth.adminjwt,getAllNotification)
router.post('/deleteNotification',auth.adminjwt,deleteNotification)
router.get('/getNewDoctors',auth.adminjwt,getNewDoctors)
router.get('/getAllDoctors',auth.adminjwt,getAllDoctors)
router.post('/approvingDoctor',auth.adminjwt,approvingDoctor)
router.post('/rejectDoctor',auth.adminjwt,rejectDoctor)
module.exports= router