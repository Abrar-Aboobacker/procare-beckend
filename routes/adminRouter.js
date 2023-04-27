const express = require('express')
const router = express.Router()
const auth =require ('../middlewares/auth')
const {
    adminLogin,
    adminInfo,
    getAllNotification,
    markAllNotification,
    deleteNotification,
    getNewDoctors,
    getAllDoctors,
    approvingDoctor,
    rejectDoctor,
    getAllUsers,
    getAllPlans,
    addPlan,
    getAllAppointments
}= require('../controller/admin-controller')

router.post('/admin_login',adminLogin)
router.post('/adminInfo',auth.adminjwt,adminInfo)
router.get('/getAllNotification',auth.adminjwt,getAllNotification)
router.post('/markAllNotification',auth.adminjwt,markAllNotification)
router.post('/deleteNotification',auth.adminjwt,deleteNotification)
router.get('/getNewDoctors',auth.adminjwt,getNewDoctors)
router.get('/getAllDoctors',auth.adminjwt,getAllDoctors)
router.post('/approvingDoctor',auth.adminjwt,approvingDoctor)
router.post('/rejectDoctor',auth.adminjwt,rejectDoctor)
router.get('/getAllUsers',auth.adminjwt,getAllUsers)
router.post('/addPlan',addPlan)
router.get('/getAllPlans',auth.adminjwt,getAllPlans)
router.get('/getAllAppointments',auth.adminjwt,getAllAppointments)
module.exports= router