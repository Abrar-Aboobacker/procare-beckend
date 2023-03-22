if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const cors = require('cors') ;
const express = require('express');
const dbConfig = require('./config/dbConfig');
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const doctorRouter = require('./routes/doctorRouter')
var bodyParser = require("body-parser");
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '300kb'}));
app.use(cors({
    origin: ['http://localhost:3000'],
    methods:["GET","POST"],
    credentials:true,
}))

app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/doctor',doctorRouter)
const port = process.env.PORT ||3001
app.listen(port,()=>console.log('listening on port ' + port));