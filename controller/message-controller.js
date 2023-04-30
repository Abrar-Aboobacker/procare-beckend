const messageModel = require('../models/messageModel');
const moment = require('moment');
module.exports = {
    userAddMessage:async (req,res)=>{
      try {
        console.log(req.body)
        const {from,to,messages}=req.body
        const data = await messageModel.create({
          message:{text:messages},
          users:[from,to],
          // doctors:[to],
          // userSender:from
          sender:from
        })
        if(data){
          return res.status(200).send({sucess:true,message:"message added successfully"})
        }else{
          return res.status(404).send({success:false,message:"failed to add message to the database"}) 
        }
      } catch (error) {
        console.log(error);
      }
    },
    getAllMessages:async(req,res)=>{
      try {
        // console.log(req.body,"alllll");
        const {from,to}=req.body
        const messages= await messageModel.find({
          users:{
            $all:[from,to]
          }
        }).sort({updatedAt:1})
        // console.log(messages,'messages');
        const projectedMessages = messages.map((msg)=>{
          return{
            fromSelf:msg.sender?.toString()===from,
            message:msg.message.text,
            time:moment(msg.createdAt).format('LLL')
          }
        })
        console.log(projectedMessages);
        res.status(200).send({success:true,message:'message fetched successfully',projectedMessages})
      } catch (error) {
        console.log(error);
      }
    },
    
  };