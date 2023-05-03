if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const cors = require('cors') ;
const express = require('express');
const dbConfig = require('./config/dbConfig');
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const doctorRouter = require('./routes/doctorRouter')
const messageRouter = require('./routes/messagesRouter')
var bodyParser = require("body-parser");
const socket = require("socket.io")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '300kb'}));
app.use(cors({
    origin: '*',
    methods:["GET","POST"],
    credentials:true,
}))

app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/doctor',doctorRouter)
app.use('/message',messageRouter)

app.use(express.static(__dirname + '/public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
const port = process.env.PORT ||3001
const server = app.listen(port,()=>console.log('listening on port ' + port));

// const io= socket(server,{
//     cors:{
//         origin: ['http://localhost:3000'],
//         credentials:true,
//     }
// })

// global.onlineUsers = new Map()

// io.on("connection",(socket)=>{
//     console.log('a user connected');
//     global.chatSocket = socket
//     socket.on("add-user",(userId)=>{
//         onlineUsers.set(userId,socket.id)
//     })
// })

// socket.on("send-msg",(data)=>{
//     const sendUserSocket = onlineUsers.get(data.to)
//     if(sendUserSocket){
//         socket.to(sendUserSocket).emit("msg-recieve".data.msg)
//     }
// })

const io = socket(server, {
    cors: {
        origin:"*",
        credentials: true,
    }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        console.log(data,"fffff");
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    });
});