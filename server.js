if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const express = require('express');
const app = express()
const dbConfig = require('./config/dbConfig');


const port = process.env.PORT ||3001
app.listen(port,()=>console.log('listening on port ' + port));