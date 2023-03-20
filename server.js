if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const cors = require('cors') ;
const express = require('express');
const dbConfig = require('./config/dbConfig');
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const app = express()
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods:["GET","POST"],
    credentials:true,
}))

app.use('/',userRouter)
app.use('/admin',adminRouter)

const port = process.env.PORT ||3001
app.listen(port,()=>console.log('listening on port ' + port));